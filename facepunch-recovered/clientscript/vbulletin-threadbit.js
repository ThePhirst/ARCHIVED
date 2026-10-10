var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.1.5 Patch Level 1
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2011 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
vB_XHTML_Ready.subscribe(init_ThreadBits);function init_ThreadBits(){var B=YAHOO.util.Dom.getElementsByClassName("threadbit","li","threadlist");for(var A=0;A<B.length;A++){new ThreadBit(B[A])}}function ThreadBit(A){this.threadbit=YAHOO.util.Dom.get(A);this.handle_description()}ThreadBit.prototype.handle_description=function(){var A=YAHOO.util.Dom.getElementsByClassName("threaddesc","p",this.threadbit);if(A&&A[0]&&A[0].firstChild){this.description=A[0].firstChild.nodeValue;YAHOO.util.Dom.getElementsByClassName("threadinfo","div",this.threadbit)[0].title=this.description}};
}

/*
     FILE ARCHIVED ON 05:59:51 Jul 12, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:14:20 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.503
  exclusion.robots: 0.058
  exclusion.robots.policy: 0.048
  esindex: 0.007
  cdx.remote: 17.064
  LoadShardBlock: 96.029 (3)
  PetaboxLoader3.datanode: 108.95 (5)
  load_resource: 567.127 (2)
  PetaboxLoader3.resolve: 516.275 (2)
*/