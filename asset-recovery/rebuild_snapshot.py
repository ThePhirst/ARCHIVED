#!/usr/bin/env python3
"""Localize the saved Facepunch thread HTML and its static dependencies."""
from __future__ import annotations
import hashlib, os, re, sys
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
HTML_PATH = ROOT / "index.html"
ASSET_ROOT = ROOT / "assets" / "facepunch"
REPORT_PATH = ROOT / "asset-recovery" / "missing-assets.txt"
SNAPSHOT = "20160719005138"
SITE_ROOT = "http://www.facepunch.com/"
WAYBACK_PREFIX = re.compile(r"^https?://web\.archive\.org/web/\d+(?:id_|im_|if_|oe_|cs_)?/(https?://.*)$", re.I)
CSS_URL = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.I)
CSS_IMPORT = re.compile(r"(@import\s+)(['\"])(.*?)\2", re.I)
ASSET_ATTR = re.compile(r"\b(src|poster)\s*=\s*(['\"])(.*?)\2", re.I)
LINK_TAG = re.compile(r"<link\b[^>]*>", re.I | re.S)
HREF_ATTR = re.compile(r"\bhref\s*=\s*(['\"])(.*?)\1", re.I)
STYLE_ATTR = re.compile(r"\bstyle\s*=\s*(['\"])(.*?)\1", re.I | re.S)
url_to_local = {}
failed = []
seen_css = set()

def unwrap_wayback(url):
    match = WAYBACK_PREFIX.match(url.strip())
    return match.group(1) if match else url.strip()

def absolute_asset_url(raw, base=SITE_ROOT):
    raw = raw.strip()
    if not raw or raw.startswith(("data:", "blob:", "javascript:", "mailto:", "#")):
        return raw
    return unwrap_wayback(urljoin(base, raw))

def local_path_for(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower().replace(":", "_")
    path = unquote(parsed.path or "/").lstrip("/") or "index"
    if path.endswith("/"):
        path += "index"
    target = ASSET_ROOT / host / path
    suffix = target.suffix
    if parsed.query:
        digest = hashlib.sha1(parsed.query.encode("utf-8")).hexdigest()[:10]
        target = target.with_name(target.stem + "-" + digest + (suffix or ".bin"))
    if target.suffix.lower() == ".php" or not target.suffix:
        digest = hashlib.sha1((parsed.query or url).encode("utf-8")).hexdigest()[:10]
        target = target.with_name(target.stem + "-" + digest + ".css")
    return target

def archive_candidates(url):
    parsed = urlparse(url)
    if parsed.netloc.lower() == "web.archive.org":
        return [url]
    original = f"{parsed.scheme or 'http'}://{parsed.netloc}{parsed.path}"
    if parsed.query:
        original += "?" + parsed.query
    return [
        f"https://web.archive.org/web/{SNAPSHOT}id_/{original}",
        f"https://web.archive.org/web/{SNAPSHOT}/{original}",
        url,
    ]

def download(url):
    errors = []
    for candidate in archive_candidates(url):
        try:
            req = Request(candidate, headers={"User-Agent": "ARCHIVED-static-mirror/1.0"})
            with urlopen(req, timeout=25) as response:
                data = response.read()
                ctype = response.headers.get("Content-Type", "").lower()
                if not data:
                    raise ValueError("empty response")
                if "text/html" in ctype and not urlparse(url).path.lower().endswith((".html", ".htm")):
                    prefix = data[:500].lower()
                    if b"wayback machine" in prefix or b"not found" in prefix or b"error" in prefix:
                        raise ValueError("received an HTML error page")
                return data, ""
        except Exception as exc:
            errors.append(f"{candidate}: {exc}")
    return None, " | ".join(errors)

def css_is_url(url):
    path = urlparse(url).path.lower()
    return path.endswith(".css") or path.endswith("/css.php")

def save_asset(url, base=SITE_ROOT):
    absolute = absolute_asset_url(url, base)
    if not absolute or absolute.startswith(("data:", "blob:", "javascript:", "mailto:", "#")):
        return absolute
    if absolute in url_to_local:
        return url_to_local[absolute]
    target = local_path_for(absolute)
    rel = target.relative_to(ROOT).as_posix()
    url_to_local[absolute] = rel
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.stat().st_size:
        data = target.read_bytes()
    else:
        data, error = download(absolute)
        if data is None:
            failed.append((absolute, error))
            url_to_local.pop(absolute, None)
            return absolute
    if css_is_url(absolute) or target.suffix.lower() == ".css":
        if absolute not in seen_css:
            seen_css.add(absolute)
            css = data.decode("utf-8", errors="replace")
            data = rewrite_css(css, absolute, target).encode("utf-8")
    target.write_bytes(data)
    return rel

def rewrite_css(css, source_url, local_css_path):
    def replace_url(match):
        raw = match.group(2).strip()
        if not raw or raw.startswith(("data:", "#", "about:")):
            return match.group(0)
        absolute = absolute_asset_url(raw, source_url)
        local = save_asset(absolute, source_url)
        if local == absolute:
            return match.group(0)
        rel = os.path.relpath(ROOT / local, local_css_path.parent).replace(os.sep, "/")
        return f"url('{rel}')"
    css = CSS_URL.sub(replace_url, css)
    def replace_import(match):
        raw = match.group(3).strip()
        if raw.startswith(("data:", "#")):
            return match.group(0)
        absolute = absolute_asset_url(raw, source_url)
        local = save_asset(absolute, source_url)
        if local == absolute:
            return match.group(0)
        rel = os.path.relpath(ROOT / local, local_css_path.parent).replace(os.sep, "/")
        return f"{match.group(1)}'{rel}'"
    return CSS_IMPORT.sub(replace_import, css)

def rewrite_html(html):
    html = re.sub(r"<base\b[^>]*>", "", html, flags=re.I)
    def rewrite_asset_attr(match):
        name, quote, raw = match.groups()
        absolute = absolute_asset_url(raw)
        local = save_asset(absolute, SITE_ROOT)
        return f"{name}={quote}{local}{quote}"
    html = ASSET_ATTR.sub(rewrite_asset_attr, html)
    def rewrite_link(tag_match):
        tag = tag_match.group(0)
        rel_match = re.search(r"\brel\s*=\s*(['\"])(.*?)\1", tag, re.I)
        if not rel_match or not any(token in rel_match.group(2).lower() for token in ("stylesheet", "icon")):
            return tag
        href_match = HREF_ATTR.search(tag)
        if not href_match:
            return tag
        absolute = absolute_asset_url(href_match.group(2))
        local = save_asset(absolute, SITE_ROOT)
        return tag[:href_match.start()] + 'href="' + local + '"' + tag[href_match.end():]
    html = LINK_TAG.sub(rewrite_link, html)
    def rewrite_style_attr(match):
        quote, style = match.groups()
        def one_url(url_match):
            raw = url_match.group(2).strip()
            if raw.startswith(("data:", "#")):
                return url_match.group(0)
            absolute = absolute_asset_url(raw)
            local = save_asset(absolute, SITE_ROOT)
            return f"url('{local}')" if local != absolute else url_match.group(0)
        return "style=" + quote + CSS_URL.sub(one_url, style) + quote
    return STYLE_ATTR.sub(rewrite_style_attr, html)

def main():
    if not HTML_PATH.exists():
        print("Missing index.html", file=sys.stderr)
        return 2
    html = HTML_PATH.read_text(encoding="utf-8", errors="replace")
    HTML_PATH.write_text(rewrite_html(html), encoding="utf-8")
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Assets that could not be downloaded", "",
        "These references remain pointed at their original URL because the download failed.", "",
    ]
    for url, error in sorted(set(failed)):
        lines.extend(["## " + url, "", "Reason: " + error, ""])
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Assets saved under {ASSET_ROOT.relative_to(ROOT)}")
    print(f"Failed downloads: {len(set(failed))}; report: {REPORT_PATH.relative_to(ROOT)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
