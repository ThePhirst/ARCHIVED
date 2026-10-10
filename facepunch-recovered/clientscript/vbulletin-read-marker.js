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
var vB_ReadMarker={forum_statusicon_prefix:"forum_statusicon_",thread_statusicon_prefix:"thread_statusicon_",thread_gotonew_prefix:"thread_gotonew_",thread_title_prefix:"thread_title_"};function vB_AJAX_ReadMarker(A){this.forumid=A}vB_AJAX_ReadMarker.prototype.mark_read=function(){YAHOO.util.Connect.asyncRequest("POST","ajax.php?do=markread&f="+this.forumid,{success:this.handle_ajax_request,failure:this.handle_ajax_error,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=markread&forumid="+this.forumid)};vB_AJAX_ReadMarker.prototype.handle_ajax_error=function(A){vBulletin_AJAX_Error_Handler(A)};vB_AJAX_ReadMarker.prototype.handle_ajax_request=function(D){var E=YAHOO.util.Dom.getElementsByClassName("threadbit","li","threadlist");for(var A=0;A<E.length;A++){YAHOO.util.Dom.removeClass(E[A],"new");var C=YAHOO.util.Dom.getElementsByClassName("threadtitle_unread","a",E[A]);C=C[0];if(C){YAHOO.util.Dom.removeClass(C,"threadtitle_unread");var F=YAHOO.util.Dom.getElementsByClassName("gotonewpost","img",E[A]);if(F&&F[0]){var B=YAHOO.util.Dom.getAncestorByTagName(F[0],"a");if(B){YAHOO.util.Dom.setStyle(B,"display","none")}}}}if(window.YAHOO&&YAHOO.vBulletin&&YAHOO.vBulletin.vBPopupMenu){YAHOO.vBulletin.vBPopupMenu.close_all()}};function mark_forum_read(A){if(AJAX_Compatible){vB_ReadMarker[A]=new vB_AJAX_ReadMarker(A);vB_ReadMarker[A].mark_read()}else{window.location="forumdisplay.php?"+SESSIONURL+"do=markread&forumid="+A}return false};
}

/*
     FILE ARCHIVED ON 17:27:57 Jul 29, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:52:11 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.464
  exclusion.robots: 0.057
  exclusion.robots.policy: 0.048
  esindex: 0.007
  cdx.remote: 4.057
  LoadShardBlock: 118.274 (3)
  PetaboxLoader3.datanode: 174.66 (5)
  load_resource: 209.605 (2)
  PetaboxLoader3.resolve: 93.188 (2)
*/