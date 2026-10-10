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
function vB_AJAX_NameVerify(C,A){var B=userAgent.match(/applewebkit\/([0-9]+)/);if(AJAX_Compatible&&!(is_saf&&!(B[1]>=412))){this.textobj=fetch_object(A);this.textobj.setAttribute("autocomplete","off");this.textobj.obj=this;this.varname=C;this.fragment="";this.timeout=null;this.ajax_req=null;this.get_text=function(){this.fragment=new String(this.textobj.value);this.fragment=PHP.trim(this.fragment)};this.key_event_handler=function(D){this.get_text();clearTimeout(this.timeout);this.timeout=setTimeout(this.varname+".name_verify();",500)};this.name_verify=function(){if(YAHOO.util.Connect.isCallInProgress(this.ajax_req)){YAHOO.util.Connect.abort(this.ajax_req)}this.ajax_req=YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url("ajax.php?do=verifyusername"),{success:this.handle_ajax_request,failure:vBulletin_AJAX_Error_Handler,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do=verifyusername&username="+PHP.urlencode(this.fragment))};this.handle_ajax_request=function(F){if(F.responseXML&&(F.responseXML.getElementsByTagName("status").length>0)){var D=F.responseXML.getElementsByTagName("status")[0].firstChild.nodeValue;var E=F.responseXML.getElementsByTagName("message")[0].firstChild.nodeValue;var G=document.getElementById("reg_verif_div");YAHOO.util.Dom.setStyle(G,"display","block");if(D=="valid"){YAHOO.util.Dom.removeClass(G,"redbox");YAHOO.util.Dom.removeClass(this.textobj,"redbox");YAHOO.util.Dom.addClass(G,"greenbox");YAHOO.util.Dom.addClass(this.textobj,"greenbox")}else{YAHOO.util.Dom.removeClass(this.textobj,"greenbox");YAHOO.util.Dom.addClass(this.textobj,"redbox");YAHOO.util.Dom.removeClass(G,"greenbox");YAHOO.util.Dom.addClass(G,"redbox")}G.innerHTML=E}};this.textobj.onkeyup=function(D){return this.obj.key_event_handler(D)}}};
}

/*
     FILE ARCHIVED ON 13:03:41 Jun 08, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:14:30 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.613
  exclusion.robots: 0.074
  exclusion.robots.policy: 0.062
  esindex: 0.01
  cdx.remote: 28.557
  LoadShardBlock: 588.994 (3)
  PetaboxLoader3.datanode: 586.208 (4)
  load_resource: 256.115
  PetaboxLoader3.resolve: 212.053
*/