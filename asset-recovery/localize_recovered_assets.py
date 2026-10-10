#!/usr/bin/env python3
"""Download remote page assets into the recovered archive and rewrite references locally."""
from __future__ import annotations
import hashlib
import mimetypes
import os
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path("facepunch-recovered")
ASSET_DIR = ROOT / "_local_assets"
SNAPSHOT = "20160719005138"
MAX_DOWNLOADS = 2000
TIMEOUT = 20
downloaded = {}
failures = set()
count = 0

WAYBACK = re.compile(r"^https?://web\.archive\.org/web/\d+(?:id_|im_|if_|oe_|cs_|js_|css_)?/(https?://.*)$", re.I)
ATTR = re.compile(r"""(?P<whole>\b(?P<name>src|poster)\s*=\s*)(?P<q>["'])(?P<url>.*?)(?P=q)""", re.I | re.S)
LINK = re.compile(r"<link\b[^>]*>", re.I | re.S)
HREF = re.compile(r"""(?P<prefix>\bhref\s*=\s*)(?P<q>["'])(?P<url>.*?)(?P=q)""", re.I | re.S)
SRCSET = re.compile(r"""(?P<prefix>\bsrcset\s*=\s*)(?P<q>["'])(?P<url>.*?)(?P=q)""", re.I | re.S)
CSS_URL = re.compile(r"""url\(\s*(?P<q>["']?)(?P<url>[^)'"]+)(?P=q)\s*\)""", re.I)
CSS_IMPORT = re.compile(r"""(@import\s+)(["'])(.*?)\2""", re.I)

def unwrap(url):
    u = url.strip()
    m = WAYBACK.match(u)
    return m.group(1) if m else u

def is_remote(u):
    return urlparse(u).scheme.lower() in ("http", "https") or u.startswith("//")

def asset_name(url, content_type=""):
    parsed = urlparse(url)
    suffix = Path(unquote(parsed.path)).suffix.lower()
    if suffix not in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".bmp", ".avif", ".css", ".js", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".webm"}:
        guessed = mimetypes.guess_extension(content_type.split(";")[0].strip()) if content_type else None
        suffix = guessed or ".bin"
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:20]
    host = (parsed.hostname or "remote").lower().replace(".", "_")
    return ASSET_DIR / host / (digest + suffix)

def candidates(url):
    original = unwrap(url)
    parsed = urlparse(original)
    if parsed.scheme not in ("http", "https"):
        return [url]
    if parsed.hostname == "web.archive.org":
        return [url]
    return [
        f"https://web.archive.org/web/{SNAPSHOT}id_/{original}",
        f"https://web.archive.org/web/{SNAPSHOT}/{original}",
        original,
    ]

def download(url):
    global count
    if url in downloaded:
        return downloaded[url]
    if count >= MAX_DOWNLOADS:
        failures.add(url)
        return None
    target = asset_name(unwrap(url))
    if target.exists() and target.stat().st_size:
        rel = os.path.relpath(target, ROOT).replace(os.sep, "/")
        downloaded[url] = rel
        return rel
    errors = []
    for candidate in candidates(url):
        try:
            req = Request(candidate, headers={"User-Agent": "ARCHIVED-static-mirror/1.0"})
            with urlopen(req, timeout=TIMEOUT) as response:
                data = response.read()
                ctype = response.headers.get("Content-Type", "")
                if not data:
                    raise ValueError("empty response")
                if "text/html" in ctype.lower() and not any(Path(urlparse(unwrap(url)).path).suffix.lower() == x for x in (".html", ".htm")):
                    # A real HTML image endpoint can legitimately return HTML; reject common Wayback error pages only.
                    low = data[:1500].lower()
                    if b"wayback machine" in low and (b"not available" in low or b"not found" in low or b"error" in low):
                        raise ValueError("Wayback error page")
                target = asset_name(unwrap(url), ctype)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
                count += 1
                rel = os.path.relpath(target, ROOT).replace(os.sep, "/")
                downloaded[url] = rel
                # Recursively localize URLs inside downloaded CSS.
                if target.suffix.lower() == ".css" or "text/css" in ctype.lower():
                    css = data.decode("utf-8", errors="replace")
                    css = rewrite_css(css, unwrap(url), target)
                    target.write_text(css, encoding="utf-8")
                return rel
        except Exception as exc:
            errors.append(f"{candidate}: {exc}")
    failures.add(url)
    return None

def local_ref(raw, base_url, owner_file):
    raw = raw.strip()
    if not raw or raw.startswith(("data:", "blob:", "javascript:", "mailto:", "#", "about:")):
        return raw
    if not is_remote(raw):
        # Existing relative paths inside the recovered site are already local.
        # Relative dependencies inside a downloaded remote CSS file must resolve against that CSS URL.
        try:
            owner_file.resolve().relative_to(ASSET_DIR.resolve())
            from_remote_css = owner_file.suffix.lower() == ".css"
        except ValueError:
            from_remote_css = False
        if not from_remote_css:
            return raw
    abs_url = urljoin(base_url, raw)
    if not is_remote(abs_url):
        return raw
    local = download(abs_url)
    if not local:
        return raw
    return os.path.relpath(ROOT / local, owner_file.parent).replace(os.sep, "/")

def rewrite_css(css, base_url, owner_file):
    def url_repl(m):
        raw = m.group("url").strip()
        if raw.startswith(("data:", "#", "about:")):
            return m.group(0)
        local = local_ref(raw, base_url, owner_file)
        return f"url('{local}')" if local != raw else m.group(0)
    css = CSS_URL.sub(url_repl, css)
    def import_repl(m):
        raw = m.group(3).strip()
        local = local_ref(raw, base_url, owner_file)
        return f"{m.group(1)}'{local}'" if local != raw else m.group(0)
    return CSS_IMPORT.sub(import_repl, css)

def base_for(path, html):
    # Resolve local relative URLs from the page's own directory; preserve absolute references as their own base.
    return "https://web.archive.org/web/" + SNAPSHOT + "/" + path.as_posix()

def rewrite_html(path):
    text = path.read_text(encoding="utf-8", errors="replace")
    base = base_for(path, text)
    def attr_repl(m):
        raw = m.group("url")
        local = local_ref(raw, base, path)
        return m.group("whole") + m.group("q") + local + m.group("q")
    text = ATTR.sub(attr_repl, text)
    def srcset_repl(m):
        items = []
        for part in m.group("url").split(","):
            bits = part.strip().split()
            if bits:
                bits[0] = local_ref(bits[0], base, path)
                items.append(" ".join(bits))
        value = ", ".join(items)
        return m.group("prefix") + m.group("q") + value + m.group("q")
    text = SRCSET.sub(srcset_repl, text)
    def link_repl(m):
        tag = m.group(0)
        relm = re.search(r"""\brel\s*=\s*["']([^"']+)["']""", tag, re.I)
        if not relm or not any(x in relm.group(1).lower() for x in ("stylesheet", "icon", "preload", "apple-touch-icon")):
            return tag
        return HREF.sub(lambda h: h.group("prefix") + h.group("q") + local_ref(h.group("url"), base, path) + h.group("q"), tag, count=1)
    text = LINK.sub(link_repl, text)
    # Inline CSS backgrounds.
    def style_repl(m):
        style = m.group(2)
        style = CSS_URL.sub(lambda u: "url('" + local_ref(u.group("url"), base, path) + "')" if local_ref(u.group("url"), base, path) != u.group("url").strip() else u.group(0), style)
        return "style=" + m.group(1) + style + m.group(1)
    text = re.sub(r"""style\s*=\s*(["'])(.*?)\1""", style_repl, text, flags=re.I | re.S)
    path.write_text(text, encoding="utf-8")

def main():
    global count
    if not ROOT.exists():
        raise SystemExit("Missing facepunch-recovered directory")
    files = [p for p in ROOT.rglob("*") if p.is_file() and p.suffix.lower() in (".html", ".htm", ".css")]
    # Process CSS before HTML so stylesheet assets are localized first.
    files.sort(key=lambda p: (0 if p.suffix.lower() == ".css" else 1, str(p)))
    for path in files:
        try:
            if path.suffix.lower() == ".css":
                css = path.read_text(encoding="utf-8", errors="replace")
                path.write_text(rewrite_css(css, base_for(path, css), path), encoding="utf-8")
            else:
                rewrite_html(path)
        except Exception as exc:
            print(f"Warning: could not process {path}: {exc}")
    report = ROOT / "LOCAL-ASSET-REPORT.txt"
    report.write_text(
        "Local asset localization report\n"
        f"Downloaded/localized assets this run: {count}\n"
        f"Unresolved asset URLs: {len(failures)}\n\n"
        + ("\n".join(sorted(failures)) if failures else "All scanned remote asset references were localized.\n"),
        encoding="utf-8",
    )
    print(f"Localized {count} assets; unresolved URLs: {len(failures)}. See {report}.")
if __name__ == "__main__":
    main()
