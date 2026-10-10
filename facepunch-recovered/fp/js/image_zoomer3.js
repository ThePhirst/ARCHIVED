var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");

// This is ugly
function imageZoomer_fixify( img ) {
	if ( img.naturalWidth == $(img).width() ) return;

	if ( img.processed_fixed ) return;
	img.processed_fixed = true;

	if ( img.parentElement.nodeName.toLocaleLowerCase().localeCompare( "a" ) != 0 ) { // Only do this for [img] tags that are not wrapped in <a> tag
		var link = $( "<a></a>" );
		link.attr( "href", $(img).attr( "src" ) );

		$(img).replaceWith( link );
		link.html( $(img) );

		// We recreated the img tag, reattach the hook.
		imageZoomer_attachClickHook( img );
	}

	$(img).css( "border", "1px dotted rgba( 0, 0, 0, 0.5 )" );
	$(img).css( "padding", "0px" );
}

function imageZoomer_attachClickHook( img ) {
	if ( img.processed_hooked ) return;
	img.processed_hooked = true;

	$(img).click( function( e ) {

		// Middle click, let them open in a new window
		if ( e.which == 2 || e.metaKey || e.ctrlKey || e.shiftKey ) return true;

		// Enlarging won't do jack shit.
		if ( img.naturalWidth == $(img).width() ) return false;

		$( ".PopupImage" ).remove();

		var SmallW = $(img).width();
		var SmallH = $(img).height();

		var scrollTop = $(window).scrollTop();
		var scrollLeft = $(window).scrollLeft();

		var background = $( "<div></div>" );
		background.css( "background-color", "rgba( 0, 0, 0, 0.5 )" );
		background.css( "position", "fixed" );
		background.css( "width", "100%" );
		background.css( "height", "100%" );
		background.css( "top", "0" );
		background.css( "left", "0" );
		background.css( "z-index", "1000" );
		background.hide().fadeIn( 200 );

		var image = new Image();
		image.src = $(img).attr( "src" );
		$(image).addClass( "PopupImage" );
		$(image).css( "position", "absolute" );
		$(image).css( "max-height", "100%" );
		$(image).css( "max-width", "100%" );
		$(image).css( "-webkit-transform", "translate(-50%, -50%)" );
		$(image).css( "-moz-transform", "translate(-50%, -50%)" );
		$(image).css( "-ms-transform", "translate(-50%, -50%)" );
		$(image).css( "transform", "translate(-50%, -50%)" );
		$(image).css( "display", "none" );

		background.append( image );
		$("BODY").append( background );

		var progress = new Image();
		progress.src = "images/misc/13x13progress.gif";
		$(progress).css( "position", "absolute" );
		$(progress).css( "top", $(img).offset().top - scrollTop + SmallH / 2 );
		$(progress).css( "left", $(img).offset().left - scrollLeft + SmallW / 2 );
		background.append( progress );

		$(image).load( function() {
			var targetH = $(image).height();
			var targetW = $(image).width();

			$(progress).remove()

			$(image).css( "display", "block" );

			$(image).css( "max-height", "" );
			$(image).css( "max-width", "" );

			// The animation will not work due to me using percents
			$(image).css( "top", $(img).offset().top - scrollTop + SmallH / 2 );
			$(image).css( "left", $(img).offset().left - scrollLeft + SmallW / 2 );
			$(image).css( "width", SmallW );
			$(image).css( "height", SmallH );

			//console.log("Clicked: " + ( $(img).offset().top - scrollTop + SmallH / 2 ) + " " + ($(img).offset().left - scrollLeft + SmallW / 2) + " " + SmallW + "x" + SmallH + " -> " + (background.height() / 2) + " " + (background.width() / 2) + " " + targetW + "x" + targetH )

			$(image).animate( {
				top: background.height() / 2,
				left: background.width() / 2,
				width: targetW,
				height: targetH,
			}, 400, function() {
				$(this).css( "top", "50%" ).css( "left", "50%" ).css( "height", "auto" ).css( "width", "auto" ).css( "max-height", "100%" ).css( "max-width", "100%" );
			} )

		} );

		$(background).click( function() {
			$(this).fadeOut( 200, function() {
				$(this).remove();
			} )
		});

		return false;
	} );
}

function imageZoomer_processImage( img ) {
	//if ( img.naturalWidth == $(img).width() || img.processed ) return;
	if ( img.processed ) return;
	img.processed = true;

	// Do these only after image has loaded
	$(img).load( function() {
		imageZoomer_fixify( img );
	} );
	// What's that? Image is already loaded and above hook didn't fire? FUCK ME.
	if ( img.naturalWidth !== undefined && img.naturalWidth ) imageZoomer_fixify( img );

	imageZoomer_attachClickHook( img );
}


var done = false;

// This is only here so that we maybe can attach onto images a bit faster than the $( function() {} ) below
window.addEventListener( "DOMSubtreeModified", function() {
	if ( /*!document.body ||*/ done ) { return; }

	$( ".postcontent IMG" ).each( function( index ) {
		imageZoomer_processImage( this );
	} )
} );

$( function() {
	done = true;

	$( ".postcontent IMG" ).each( function( index ) {

		/*
		// This is needed in case the image loaded too slow
		$( this ).load( function() {
			imageZoomer_processImage( this );
		} );

		// Image is not loaded yet
		if ( this.naturalWidth === undefined || !this.naturalWidth ) return;*/

		imageZoomer_processImage( this );
	} )
})

}

/*
     FILE ARCHIVED ON 19:15:22 Jul 18, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:13:44 Oct 10, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.428
  exclusion.robots: 0.038
  exclusion.robots.policy: 0.032
  esindex: 0.007
  cdx.remote: 4.779
  LoadShardBlock: 278.418 (6)
  PetaboxLoader3.resolve: 325.975 (6)
  PetaboxLoader3.datanode: 157.724 (8)
  load_resource: 223.117 (2)
*/