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
|| # vBulletin 4.1.10
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2012 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
function display_post(A){if(AJAX_Compatible){vB_PostLoader[A]=new vB_AJAX_PostLoader(A);vB_PostLoader[A].init()}else{pc_obj=fetch_object("postcount"+this.postid);openWindow("showthread.php?"+(SESSIONURL?"s="+SESSIONURL:"")+(pc_obj!=null?"&postcount="+PHP.urlencode(pc_obj.name):"")+"&p="+A+"#post"+A)}return false}var vB_PostLoader=new Array();function vB_AJAX_PostLoader(A){this.postid=A;this.post=YAHOO.util.Dom.get("post_"+this.postid)}vB_AJAX_PostLoader.prototype.init=function(){if(this.post){postid=this.postid;pc_obj=fetch_object("postcount"+this.postid);YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("showpost.php?p="+this.postid),{success:this.display,failure:this.handle_ajax_error,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&ajax=1&postid="+this.postid+(pc_obj!=null?"&postcount="+PHP.urlencode(pc_obj.name):""))}};vB_AJAX_PostLoader.prototype.handle_ajax_error=function(A){vBulletin_AJAX_Error_Handler(A)};vB_AJAX_PostLoader.prototype.display=function(B){if(B.responseXML){var C=B.responseXML.getElementsByTagName("postbit");if(C.length){var A=string_to_node(C[0].firstChild.nodeValue);this.post.parentNode.replaceChild(A,this.post);PostBit_Init(A,this.postid)}else{openWindow("showthread.php?"+(SESSIONURL?"s="+SESSIONURL:"")+(pc_obj!=null?"&postcount="+PHP.urlencode(pc_obj.name):"")+"&p="+this.postid+"#post"+this.postid)}}};
}

/*
     FILE ARCHIVED ON 09:38:56 Jul 19, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:13:46 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.369
  exclusion.robots: 0.046
  exclusion.robots.policy: 0.04
  esindex: 0.005
  cdx.remote: 19.066
  LoadShardBlock: 108.227 (3)
  PetaboxLoader3.datanode: 139.17 (5)
  load_resource: 35.282 (2)
*/