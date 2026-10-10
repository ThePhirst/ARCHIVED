var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");
MouseX = 0;
MouseY = 0;

$(document).mousemove(function(e){
	MouseX = e.pageX;
	MouseY = e.pageY;
});

function CreateFloatingDiv(x, y, id, divClass)
{
	var Exists = $('#' + id)[0];
	if (Exists)
	{
		if (Exists.style.display == 'block')
		{
			$(Exists).hide('fast');
			return false;
		}
		Exists.style.left = x + 'px';
		Exists.style.top = y + 'px';
		Exists.style.display = 'none';
		$(Exists).show('fast');
		return false;
	}

	var div = document.createElement('div');
	div.style.left = x + 'px';
	div.style.top = y + 'px';
	/*div.style.position = 'absolute';
	div.style.background = '#ffd';
	div.style.border = "1px solid #777";
	div.style.padding = '5px';
	div.style.color = '#555';
	div.style.fontSize = '11px';
	div.style.display = 'none';*/
	div.className = "top popupbox " + divClass;
	div.id = id;
	

	document.body.appendChild(div);

	//$(div).show('fast');

	return div;
}

function CloseThis(pChild, reason)
{
	if ( $( pChild ).hasClass("top") )
	{
		if ( reason )
		{
			pChild.innerHTML = reason;
			$(pChild).fadeOut( 3000 );
		}
		else
		{
			$( pChild ).hide();
		}

		return false;
	}

	return CloseThis( pChild.parentNode, reason );
}

/* AMAZING INTERNER EXPLORER IS AMAZING */
if ( ! window.location.origin ) {
	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

function OpenEventlog(userid)
{
	var div = CreateFloatingDiv( MouseX, MouseY, 'Event_' + userid, 'eventlog');
	if (!div) return false;

	div.innerHTML += "Fetching...";
	$(div).click(function(){
		$(div).hide();
	});

	$(div).show('fast');

	$.get( window.location.origin + '/fp_events.php', 'aj=1&user=' + userid, function(d){
		div.innerHTML = d;
	}, 'html');

	return false;
}

function OpenURLInBox(name, url)
{
	var div = CreateFloatingDiv(MouseX, MouseY, name, 'urlbox');
	if (!div) return false;

	div.innerHTML += "Fetching...";
	$(div).click(function(){
		$(div).hide();
	});

	$(div).show('fast');

	$.get( window.location.origin + '/' + url, '', function(d){
		div.innerHTML = d;
	}, 'html');
	return false;
}

function RatePost(postid, rating, key)
{
	$.post( window.location.origin + '/ajax.php', {'do': 'rate_post', postid: postid, rating: rating, key: key, securitytoken: SECURITYTOKEN}, function(data) {
		var $ratings = $('#rating_' + postid),
			$control = $('#ratingcontrols_post_' + postid),
			isError = (data.error != undefined),
			message = (isError) ? data.error : data.message;
		if (!isError) {
			$ratings.fadeOut('fast', function(){
				$ratings[0].innerHTML = data.result;
				$ratings.fadeIn('fast');
			});
		}
		$control.css({
			'opacity': '1',
			'color' : '#888'
		});
		$control[0].innerHTML = message;
	}, 'json');
	$('#ratingslist_'+postid).remove();
	$('#ratingcontrols_post_' + postid)[0].innerHTML = "";
	return false;
}

function ReportPost(postid)
{
	var div = CreateFloatingDiv(MouseX, MouseY, 'Report_' + postid, 'report');
	if (!div) return;
	div.innerHTML = 'Wait...';
	$(div).show('fast');

	$.get( window.location.origin + '/ajax.php', {'do': 'report_text', postid:postid}, function(data){
		div.innerHTML = data;
	}, 'html');
}

function SendReportPost(postid, reasonid)
{
	$.post( window.location.origin + '/ajax.php', {'do': 'report_submit', postid: postid, reasonid: reasonid,  securitytoken: SECURITYTOKEN}, function(data) {
		if (data) alert(data);
	}, 'html');
}

function InitReportPage()
{
	$(document).ready(function(){
		$('.post_report .userbox .ignore_link').click(function(){
			var userid = this.id;

			$('.userbox_' + userid).fadeOut('fast', function(){
				
				if ($(this).siblings().length < 2)
				{
					$(this).parents('.post_report').slideUp('fast', function(){
						$(this).remove();
					});
				}
				else
				{
					$(this).remove();
				}
			});

			$.post( window.location.origin + '/ajax.php', {'do': 'report_ignoreuser', userid: userid, securitytoken: SECURITYTOKEN});

			return false;
		});

		$('.post_report a.dismiss').click(function(){
			var postid = this.id;

			$(this).parents('.post_report').slideUp('fast', function(){
				$(this).remove();
			});

			$.post( window.location.origin + '/ajax.php', {'do': 'report_dismissreport', postid: postid, securitytoken: SECURITYTOKEN});

			return false;
		});
	});
}

function InitQueuePage_Upgrades()
{
	$(document).ready(function() {
		$('.upgradebox .approvebuttons a').click(function() {
			var action = $(this).attr('action'),
				$upgradebox = $(this).parents('.upgradebox'),
				queueid = $upgradebox.attr('queueid');
			
			$.post( window.location.origin + '/ajax.php', {
				'do': 'queue_dismiss',
				provider: 'upgrades',
				itemid: queueid,
				action: action,
				securitytoken: SECURITYTOKEN
			}, function(data) {
				$upgradebox.animate({
					backgroundColor: '#ccc'
				}, 'fast');
				
				if (data.error !== undefined) {
					var text = "<strong>Error:</strong> " + data.error;
				} else {
					var text = data.message;
				}
				
				text = "<em>" + text + "</em>";
				
				$upgradebox.children('.upgradetext').html(text);
			}, 'json');
			$upgradebox.children('.approvebuttons').fadeOut('fast');
		});
	});
}

function OpenPostAdmin( threadid, postid, userid, verify )
{
	var left = MouseX;
	var top = MouseY;

	if( $('#postadmin_'+postid).length > 0 )
	{
		$('#postadmin_'+postid).remove();
	}

	$('img#PAIMG_' +  postid).attr('src', 'fp/progress.gif');

	$.post( window.location.origin + '/ajax.php', {'do': 'postadmin', action: 'postadmin_text', type: 'user', threadid: threadid, postid: postid, userid: userid, verify: verify, securitytoken: SECURITYTOKEN}, function(data){
		if (data.getElementsByTagName('response').length > 0)
		{
			alert(data.getElementsByTagName('response')[0].firstChild.nodeValue);

			return;
		}

		var width = data.getElementsByTagName('postadmin')[0].attributes.getNamedItem('width').value;
		var div = document.createElement('div');
		div.id = 'postadmin_' + postid;
		div.className = 'postadmin';
		div.style.left = left - width - 20 + 'px'; // Compensate for padding
		div.style.top = top + 'px';
		div.style.width = width + 'px';
		div.style.display = 'none';

		div.innerHTML = data.getElementsByTagName('postadmin')[0].firstChild.nodeValue;

		document.body.appendChild(div);

		$('#PAC_' + postid).click(function(){
			$(div).slideUp('fast', function(){
				$(this).remove();
			});

			return false;
		});

		$('#PAEL_' + postid).click(function(){
			$(this).fadeOut('fast');

			$('#postadmin_eventlog_' + postid).slideToggle('fast', function(){
				var toglink = $('#PAEL_' + postid)[0];
				if ($(this).css('display') == 'none')
				{
					toglink.innerHTML = 'Show';
				}
				else
				{
					toglink.innerHTML = 'Hide';
				}

				$(toglink).fadeIn('fast');
			});

			return false;
		});

		$(div).slideDown('fast');
		$('img#PAIMG_' +  postid).attr('src', 'fp/postadmin.png');
		$('#PAR_' + postid).focus();
	}, 'xml');

	return false;
}

function AdminUser(action, userid, postid, threadid, verify)
{
	var reason = $('#PAR_' + postid)[0].value;

	$.post( window.location.origin + '/ajax.php', {'do': 'postadmin', action: action, type: 'user', userid: userid, postid: postid, threadid: threadid, reason: reason, verify: verify, securitytoken: SECURITYTOKEN}, function(data){
		$('#postadmin_response_' + postid)[0].innerHTML += data.getElementsByTagName('response')[0].firstChild.nodeValue + "<br />";
	}, 'xml');

	if ($('#postadmin_response_' + postid)[0].innerHTML == '<em>None</em><br>') $('#postadmin_response_' + postid)[0].innerHTML = '';

	$('#postadmin_response_' + postid)[0].innerHTML += "<span style=\"color:green;\">&gt;&gt;" + action + "..</span><br />";

	return false;
}

function NumOccur( text, str )
{
	var matches = text.match( new RegExp( str, "g" ) );
	if ( !matches ) return 0;
	return matches.length * 2;
}

function WorkOutLanguage( txt )
{
	var arry = new Array();
	
	//
	// lua
	//
	var score = 0;
		score += NumOccur( txt, "self:" );
		score += NumOccur( txt, "\\-\\- " );
		score += NumOccur( txt, "function ENT\\:" );
		score += NumOccur( txt, "function GM\\:" );
		score += NumOccur( txt, "\\) do" );
		score += NumOccur( txt, "\\) then" );
		score += NumOccur( txt, "hook\\.Add" );
		score += NumOccur( txt, "then return" );
	arry.push( { name: "lua", score: score } );
	
	//
	// c#
	//
	var score = 0;
		score += NumOccur( txt, "using System" );
		score += NumOccur( txt, "public class " );
		score += NumOccur( txt, "private class " );
		score += NumOccur( txt, "public float " );
		score += NumOccur( txt, "private float " );
		score += NumOccur( txt, "public bool " );
		score += NumOccur( txt, "private bool " );
		score += NumOccur( txt, "Time.deltaTime" );
		score += NumOccur( txt, "rigidbody.AddForce\\(" );
		score += NumOccur( txt, "Vector3.forward" );
		score += NumOccur( txt, "Vector3.right" );
	arry.push( { name: "csharp", score: score } );
	
	//
	// c (default)
	//
	var score = 1;
	
	arry.push( { name: "c", score: score } );

	arry.sort(function(a,b) 
	{
		return a.score < b.score;
	});
	
	return arry[0].name;
}

function InitShowthread()
{
	$('#threadadmin_toggle a').click(function(){
		$('#threadadmin').stop().slideToggle('fast');
		return false;
	});

	$('a[rel=tipsy]').tipsy({gravity: 's'});

	$('ol#posts > li').each(function(){
		$('#ratingcontrols_'+this.id).hide();
		$(this).hover(function(){
			$('#ratingcontrols_'+this.id).fadeIn(150);
		},function(){
			$('#ratingcontrols_'+this.id).fadeOut(150);
		});
	});

	$( "PRE.bbcode_code" ).each( function( index )
	{
		$(this).attr( "data-language", WorkOutLanguage( $(this).text() ) );
	} );

}

function AdminThread(action, threadid, verify, reason)
{
	if (!reason) reason = $('#threadadmin_reason')[0].value;

	$.post( window.location.origin + '/ajax.php', {'do': 'postadmin', type: 'thread', action: action, threadid: threadid, reason: reason, verify: verify, securitytoken: SECURITYTOKEN}, function(data){
		$('#threadadmin_response')[0].innerHTML += data.getElementsByTagName('response')[0].firstChild.nodeValue + "<br />";
	});

	$('#threadadmin_response')[0].innerHTML += "<span style=\"color:green;\">&gt;&gt;" + action + "..</span><br />";

	return false;
}

function RatingsList(postid)
{
	if ($('#ratingslist_'+postid).length > 0)
	{
		$('#ratingslist_'+postid).slideToggle('fast');
		return false;
	}

	$.get( window.location.origin + '/ajax.php', {'do': 'rate_list', postid: postid}, function(data){
		var x = $('#rating_'+postid).offset().left;
		var y = $('#rating_'+postid).offset().top + $('#rating_'+postid).height() + 9;
		var div = CreateFloatingDiv(x, y, 'ratingslist_' + postid, 'ratingslist');
		//$(div).stop().hide();
		div.innerHTML = data.list;
		$(div).click(function(){
			$(this).slideUp('fast');
		});

		$(div).slideDown('fast');
	}, 'json');

	return false;
}

function UnreadThread(threadid, button)
{
	$(button).html( "<img height='9px' src='/images/misc/11x11progress.gif' />" );

	$.post( window.location.origin + '/ajax.php', {'do': 'unreadthread', threadid: threadid, securitytoken: SECURITYTOKEN}, function( data ) {
		$(button).remove();
		$( "#thread_" + threadid + " .newposts").remove();
	
		if ( window.location.href.indexOf("fp_read.php") == -1 ) return;

		$( "#thread_" + threadid + " > td").animate( {
			paddingTop: 0,
			paddingBottom: 0
		}, 200 );
		
		$( "#thread_" + threadid + " > td > *").slideUp( 200, function() {
			$( "#thread_" + threadid ).remove();
		} );
	});

	return false;
}

//
// GranPC - Highlight your own name in the RC
//
$(function()
{
	var prefixes = document.getElementsByClassName("prefix understate");
	var username = document.getElementById("navbar-login").lastChild.previousSibling.text;

	for(var i = 0; i < prefixes.length; i++)
	{
		var textElement = prefixes[i].children[0];
		if ( !textElement ) continue;
		var name = textElement.text || textElement.innerText || textElement.textContent || textElement.innerHTML;
		if ( name == username ) {
			prefixes[i].style.backgroundColor = "rgb(255, 133, 0)";
		}
	}
})

}

/*
     FILE ARCHIVED ON 19:15:21 Jul 18, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:13:43 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.352
  exclusion.robots: 0.037
  exclusion.robots.policy: 0.03
  esindex: 0.007
  cdx.remote: 17.229
  LoadShardBlock: 88.425 (3)
  PetaboxLoader3.datanode: 124.207 (5)
  load_resource: 43.548 (2)
*/