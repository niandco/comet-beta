import { isString, isEmpty, isObject, isNode } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import { frameset as getFrameset } from '../stored.js';
import node from '../../../dom/element.js';
import initElements from './elements.js';
import initButtons from './buttons.js';
import initMenu from './menu.js';

const DOCUMENT = document;

const BASE = 'comet-cockpit';

const I_CLASSNAME = ClassName( BASE );

const CORE = {

	data: {
		target: null,
		elements: [],
		open: false
	},

	classes: {
		main: BASE,
		open: I_CLASSNAME.modifier( 'open' ),
		expand: I_CLASSNAME.element( 'expand' ),
		header: {
			main: I_CLASSNAME.element( 'header' ),
			collapse: {
				main: I_CLASSNAME.element( 'header__switch' ),
				icon: I_CLASSNAME.element( 'header__switch__icon' ),
				tooltip: I_CLASSNAME.element( 'header__switch__tooltip' )

			}

		},
		elements: {
			main: I_CLASSNAME.element( 'elements' ),
			searchbox: I_CLASSNAME.element( 'elements__searchbox' ),
			searchbar: I_CLASSNAME.element( 'elements__searchbox__bar' ),
			searchicon: I_CLASSNAME.element( 'elements__searchbox__icon' ),
			list: I_CLASSNAME.element( 'elements__list' ),
			hidden: I_CLASSNAME.element( 'elements__list__element--hidden' )

		},
		menu: {
			main: I_CLASSNAME.element( 'exmenu' )

		},
		footer: {
			main: I_CLASSNAME.element( 'footer' )

		}

	},

	search: function( ev, ui ){
		const value = isString( ui.value ) ? ui.value.trim() : '';
		const empty = isEmpty( value );
		var a, element, regex, title;

		ev.preventDefault();

		if( CORE.data.elements.length < 1 ){
			return;

		}
		regex = new RegExp( value, 'i' );

		for( a = 0; a < CORE.data.elements.length; a++ ){

			if( !isNode( element = CORE.data.elements[a] ) ){
				continue;

			}

			if( !isString( title = element.getAttribute( 'aria-label' ) ) ){
				continue;

			}

			if( !empty && title.search( regex ) === -1 ){
				node( element ).addClass( CORE.classes.elements.hidden );
				continue;

			}
			node( element ).removeClass( CORE.classes.elements.hidden );

		}


	},

	toggle: function( ev ){
		var n_cockpit;

		if( isObject( ev ) ){
			ev.preventDefault();

		}

		if( !isNode( CORE.data.target ) ){
			return false;

		}
		n_cockpit = node( CORE.data.target );

		if( n_cockpit.hasClass( CORE.classes.open ) && CORE.data.open ){
			n_cockpit.removeClass( CORE.classes.open );
			CORE.data.open = false;
			return;

		}
		n_cockpit.addClass( CORE.classes.open );
		CORE.data.open = true;

	},

	destroy: function(){
		const COCKPIT = CORE.data.target;

		if( COCKPIT === null || COCKPIT.parentNode === null ){
			return false;

		}
		COCKPIT.parentNode.removeChild( COCKPIT );
		return true;

	}

};

export default function(){

	const FRAMESET = getFrameset();

	const FRAGMENT = DOCUMENT.createDocumentFragment();

	const COCKPIT = DOCUMENT.createElement( 'div' );

	const SECTION = {
		header: null,
		elements: null,
		menu: null,
		footer: null

	};

	var inner;

	FRAGMENT.appendChild( COCKPIT );

	CORE.data.target = COCKPIT;

	inner = '<header class="' + CORE.classes.header.main + '">';
	inner += '<button class="' + CORE.classes.header.collapse.main + '">';
	inner += '<span class="' +CORE.classes.header.collapse.icon + ' cico cico-comet"></span>';
	inner += '<span class="' + CORE.classes.header.collapse.tooltip + '"><span>' + __cometi18n.ui.collapse + '</span></span>';
	inner += '</button>';
	inner += '<h4 class="' + CORE.classes.expand + '">' + __cometi18n.ui.cockpit + '</h4>';
	inner += '</header>';

	inner += '<section class="' + CORE.classes.elements.main + '">';
	inner += '<div class="' + CORE.classes.elements.searchbox + ' ' + CORE.classes.expand + '">';
	inner += '<input type="text" class="' + CORE.classes.elements.searchbar + '" value="" placeholder="' + __cometi18n.ui.search + '" />';
	inner += '<span class="' + CORE.classes.elements.searchicon + ' cico cico-search"></span>';
	inner += '</div>';
	inner += '<div class="' + CORE.classes.elements.list + '"></div>';
	inner += '</section>';

	inner += '<section class="' + CORE.classes.menu.main + ' ' + CORE.classes.expand + '"></section>';

	inner += '<footer class="' + CORE.classes.footer.main + '"></footer>';

	COCKPIT.className = CORE.classes.main;
	COCKPIT.innerHTML = inner;

	SECTION.header = COCKPIT.children[0];
	SECTION.elements = COCKPIT.children[1];
	SECTION.menu = COCKPIT.children[2];
	SECTION.footer = COCKPIT.children[3];

	CORE.data.elements = initElements( SECTION.elements.lastChild );

	initMenu( SECTION.menu );
	initButtons( SECTION.footer );

	node( SECTION.header.firstChild ).on( 'click', CORE.toggle );
	node( SECTION.elements.firstChild.firstChild ).on( 'input', CORE.search );

	if( FRAMESET ){
		FRAMESET.append( FRAGMENT );

	}

	return {
		target: CORE.data.target,
		destroy: CORE.destroy,
		toggle: CORE.toggle

	};

}