var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");

var g_NumUnityDogs = 0;
var g_SceneLoadedCallback = null;

var unityDog =
{
	Setup: function ( element )
	{
		var webURL = element.attr( "src" );
		var defWidth = element.attr( "width" );
		var defHeight = element.attr( "height" );
		var gameURL = element.attr( "game" );

		if ( typeof gameURL === "undefined" ) gameURL = null;

		var unityelement = jQuery( "<div class=\"unitydog standard\"></div>" );

		if ( defWidth ) unityelement.css( "width", defWidth + "px" );
		if ( defHeight ) unityelement.css( "height", defHeight + "px" );

		// Add the controls
		var controls = jQuery( '<div class="controls"></div>' );

		var ctrl = jQuery( '<a class="make_fullscreen" ><img src="' + unitydogsettings.fullscreen + '"></a>' );
		ctrl.click( function () { unityelement.addClass( 'fullscreen' ); unityelement.removeClass( 'standard' ); jQuery( 'BODY' ).addClass( 'unitydog_fullscreen' ); } );
		controls.append( ctrl );

		var ctrl = jQuery( '<a class="make_normal" ><img src="' + unitydogsettings.restore + '"></a>' );
		ctrl.click( function () { unityelement.removeClass( 'fullscreen' ); unityelement.addClass( 'standard' ); jQuery( 'BODY' ).removeClass( 'unitydog_fullscreen' ); } );
		controls.append( ctrl );

		var playbutton = jQuery( '<div class="playbutton">&nbsp;</div>' );
		playbutton.click( function () { unityDog.Play( unityelement, webURL, gameURL ); } );

		unityelement.prepend( playbutton );
		unityelement.append( controls );

		element.replaceWith( unityelement );
	},

	Play: function ( unityelement, webURL, gameURL )
	{
		var player = new UnityObject2( {
			width: "100%", height: "100%",
			params: { disableExternalCall: gameURL == null, disableContextMenu: gameURL != null, disableFullscreen: false }
		} );

		// Stop all other instances
		unityDog.StopAll();

		if ( gameURL != null )
		{
			// Set the callback that instructs the player to load an arcade game
			g_SceneLoadedCallback = function ()
			{
				player.getUnity().SendMessage( "Emulator", "LoadGameFromURL", gameURL );
			};
		}

		// hide our play button
		unityelement.find( '.playbutton' ).hide();

		player.observeProgress( function ( progress )
		{
			switch ( progress.pluginStatus )
			{
				case "broken":
					console.log( "Unity Player broken!" );
					return;
					break;
				case "missing":
					console.log( "Unity Player missing!" );
					return;
					break;
				case "installed":
					break;
				case "first":
					break;
			}

		} );

		var plyelement = jQuery( '<div class="player"></div>' );
		unityelement.prepend( plyelement );

		player.initPlugin( plyelement[0], webURL );
	},

	StopAll: function ()
	{
		jQuery( "DIV.unitydog .player" ).remove();
		jQuery( "DIV.unitydog .playbutton" ).show();
	}
}

jQuery( function ()
{
	jQuery( 'unitydog' ).each( function ( idx, element )
	{
		unityDog.Setup( jQuery( element ) );
	} )
} );
}

/*
     FILE ARCHIVED ON 18:35:20 Jul 12, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:15:00 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.395
  exclusion.robots: 0.037
  exclusion.robots.policy: 0.03
  esindex: 0.008
  cdx.remote: 5.914
  LoadShardBlock: 54.976 (3)
  PetaboxLoader3.datanode: 51.98 (4)
  load_resource: 53.877
  PetaboxLoader3.resolve: 49.482
*/