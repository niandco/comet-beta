import { isNode, isFunction } from '../utils/is.js';
import nodes from '../dom/elements.js';
import node from '../dom/element.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	sidebar: {

		target: DOCUMENT.getElementById( 'comet-dashboardSidebar' ),

		open: DOCUMENT.getElementById( 'comet-doSidebarOpen' ),

		close: DOCUMENT.getElementById( 'comet-doSidebarClose' ),

		onOpen: function( ev ){
			ev.preventDefault();
			CORE.sidebar.target.style.display = 'block';

		},

		onClose: function( ev ){
			ev.preventDefault();
			CORE.sidebar.target.style.display = 'none';

		},

		init: function(){

			if( !isNode( CORE.sidebar.target ) ){
				return;

			}

			if( isNode( CORE.sidebar.open ) ){
				node( CORE.sidebar.open ).on( 'click', CORE.sidebar.onOpen );

			}

			if( isNode( CORE.sidebar.close ) ){
				node( CORE.sidebar.close ).on( 'click', CORE.sidebar.onClose );

			}

		}

	},

	help: {

		tooltip: DOCUMENT.getElementsByClassName( 'comet-tooltip' ),

		onTooltip: function( ev, ui ){
			node( ui ).toggleClass( 'comet-active' );

		},

		init: function(){
			const NTOOLTIP = nodes( CORE.help.tooltip );

			if( !NTOOLTIP ){
				return;

			}
			NTOOLTIP.on( 'click', CORE.help.onTooltip );

		}

	},

	slider: {

		buttons: DOCUMENT.getElementsByClassName( 'comet-dashboardSlideButton' ),

		onButton: function( ev, ui ){
			const slide = ui.parentNode.parentNode;
			const _ui = node( ui );
			const sc = 'comet-dashboardSlide';
			var sibling = null;
			var s, slides;

			ev.preventDefault();

			if( _ui.hasClass( 'comet-next' ) && ( sibling = slide.nextSibling ) === null ){
				return;

			}

			if( _ui.hasClass( 'comet-prev' ) && ( sibling = slide.previousSibling ) === null ){
				return;

			}

			if( !isNode( sibling ) || slide.parentNode === null || ( slides = slide.parentNode.children ).length < 1 ){
				return;

			}

			for( s = 0; s < slides.length; s++ ){

				if( node( slides[s] ).hasClass( sc ) ){
					slides[s].style.display = 'none';

				}

			}
			sibling.style.display = 'block';

		},

		init: function(){
			const NBTN = nodes( CORE.slider.buttons );

			if( !NBTN ){
				return;

			}
			NBTN.on( 'click', CORE.slider.onButton );

		}

	}

};

export default function(){
	var a;

	for( a in CORE ){

		if( isFunction( CORE[a].init ) ){
			CORE[a].init();

		}

	}
	
}