import { isFunction, isNode } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import node from '../../../dom/element.js';
import library from './library.js';

const DOCUMENT = document;

const BASE = ClassName( 'comet-cockpit' ).element( 'exmenu__button' );

const C_CLASSNAME = ClassName( BASE );

const CORE = {

	classes: {
		icon: C_CLASSNAME.element( 'icon' ),
		title: C_CLASSNAME.element( 'title' )
	},

	createButton: function( id, title, icon ){
		const BUTTON = DOCUMENT.createElement( 'button' );
		const ITEM_CLASSNAME = C_CLASSNAME.modifier( id );

		BUTTON.className = C_CLASSNAME.combineWith( [ ITEM_CLASSNAME ] );
		BUTTON.setAttribute( 'aria-label', title );
		BUTTON.innerHTML = '<span class="' + CORE.classes.icon + ' cico ' + icon + '"></span><span class="' + CORE.classes.title + '">' + title + '</span>';

		return BUTTON;

	}

};

export default function( parentNode ){

	const BUTTONS = {

		templates: {
			icon: 'cico-directory',
			title: __cometi18n.ui.templates,
			event: library
		}

	};

	var b, tmp;

	if( !isNode( parentNode ) ){
		return false;

	}

	for( b in BUTTONS ){
		tmp = CORE.createButton( b, BUTTONS[b].title.trim(), BUTTONS[b].icon.trim() );
		parentNode.appendChild( tmp );

		if( isFunction( BUTTONS[b].event ) ){
			node( tmp ).on( 'click', BUTTONS[b].event );

		}

	}

	return {

		target: parentNode,

		destroy: function(){
			parentNode.innerHTML = '';

		}

	};

}