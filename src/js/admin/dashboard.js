import { isNode, isFunction } from '../utils/is.js';
import nodes from '../dom/elements.js';
import node from '../dom/element.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	sidebar: {

		target: DOCUMENT.getElementsByClassName( 'comet-page--dashboard__sidebar' ),

		toggle: DOCUMENT.getElementsByClassName( 'comet-page--dashboard__sidebar__toggle' ),

		isOpen: false,

		ontoggle: function( ev ){
			var a = 0;

			ev.preventDefault();

			for( a; a < CORE.sidebar.target.length; a++ ){

				if( !isNode( CORE.sidebar.target[a] ) ){
					continue;

				}

				if( CORE.sidebar.isOpen ){
					CORE.sidebar.isOpen = false;
					CORE.sidebar.target[a].style.display = 'none';
					continue;

				}
				CORE.sidebar.isOpen = true;
				CORE.sidebar.target[a].style.display = 'block';

			}

		},

		init: function(){

			if( CORE.sidebar.target.length < 1 || CORE.sidebar.toggle.length < 1 ){
				return;

			}
			nodes( CORE.sidebar.toggle ).on( 'click', CORE.sidebar.ontoggle );

		}

	},

	slider: {

		classes: {
			slide: 'comet-page--main__widget--slider__slide',
			next: 'comet-page--main__widget--slider__slide__button--next',
			prev: 'comet-page--main__widget--slider__slide__button--prev'

		},

		buttons: DOCUMENT.getElementsByClassName( 'comet-page--main__widget--slider__slide__button' ),

		onButton: function( ev, ui ){
			const slide = ui.parentNode.parentNode;
			const _ui = node( ui );
			var sibling = null;
			var s, slides;

			ev.preventDefault();

			if( _ui.hasClass( CORE.slider.classes.next ) && ( sibling = slide.nextElementSibling ) === null ){
				return;

			}

			if( _ui.hasClass( CORE.slider.classes.prev ) && ( sibling = slide.previousElementSibling ) === null ){
				return;

			}

			if( !isNode( sibling ) || slide.parentNode === null || ( slides = slide.parentNode.children ).length < 1 ){
				return;

			}

			for( s = 0; s < slides.length; s++ ){

				if( node( slides[s] ).hasClass( CORE.slider.classes.slide ) ){
					slides[s].style.display = 'none';

				}

			}
			sibling.style.display = 'flex';

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