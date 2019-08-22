import { isObject, isNode, isBool, isFunction } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { LocalStorage } from './data.js';
import { parseColor } from './parse.js';
import * as ACTIONS from './actions.js';
import node from '../../dom/element.js';
import { isPicker } from './utils.js';

const DOCUMENT = document;

const WINDOW = window;

const BASE = 'comet-color-picker';

const CPCLASSNAME = ClassName( BASE );

const CORE = {

	classes: {
		clear: CPCLASSNAME.element( 'clear' ),
		preview: CPCLASSNAME.element( 'preview' ),
		cp: CPCLASSNAME.element( 'cp' ),
		hidden: CPCLASSNAME.element( 'cp--hidden' ),
		saturation: CPCLASSNAME.element( 'saturation' ),
		dragger: CPCLASSNAME.element( 'saturation__dragger' ),
		tools: CPCLASSNAME.element( 'tools' ),
		hue: CPCLASSNAME.element( 'hue' ),
		ihue: CPCLASSNAME.element( 'hue__input' ),
		opacity: CPCLASSNAME.element( 'opacity' ),
		iopacity: CPCLASSNAME.element( 'opacity__input' ),
		input: CPCLASSNAME.element( 'value' ),
		iinput: CPCLASSNAME.element( 'value__input' ),

	},

	mouseup: function( ev, ui, id ){
		const CURRENT = LocalStorage( id ).getObject();

		if( !CURRENT || !isObject( CURRENT.cp ) ){
			return;

		}

		if( CURRENT.cp.isDragging ){
			CURRENT.cp.isDragging = false;
			return;

		}

		if( CURRENT.cp.isOpen && !isPicker( ev.target, CURRENT.cp.node ) ){
			CURRENT.cp.isOpen = false;
			CURRENT.cp.isDragging = false;
			node( CURRENT.cp.node ).addClass( CORE.classes.hidden );

		}

	},

	toggle: function( ev, ui, id ){
		const DATA = LocalStorage( id );
		const CURRENT = DATA.getObject();
		var inner;
		var color, picker, sat, dragger, wrap, whue, hue, wopacity, opacity, winput, input;

		if( !CURRENT ){
			return;

		}

		if( isObject( CURRENT.cp ) ){

			if( CURRENT.cp.isOpen ){
				CURRENT.cp.isOpen = false;
				node( CURRENT.cp.node ).addClass( CORE.classes.hidden );
				return;

			}
			CURRENT.cp.isOpen = true;
			node( CURRENT.cp.node ).removeClass( CORE.classes.hidden );
			DATA.setPickerPosition();
			return;

		}
		picker = DOCUMENT.createElement( 'div' );

		inner = '<div class="' + CORE.classes.saturation + '">';
		inner += '<button class="' + CORE.classes.dragger + '"></button>';
		inner += '</div>';

		inner += '<div class="' + CORE.classes.tools + '">';
		inner += '<div class="' + CORE.classes.hue + '">';
		inner += '<input type="hidden" class="' + CORE.classes.ihue + '" step="1" min="0" max="360" />';
		inner += '</div>';
		inner += '<div class="' + CORE.classes.opacity + '">';
		inner += '<input type="hidden" class="' + CORE.classes.iopacity + '" step="0.01" min="0" max="1" />';
		inner += '</div>';
		inner += '<div class="' + CORE.classes.input + '">';
		inner += '<input type="text" class="' + CORE.classes.iinput + '" value="" />';
		inner += '</div>';
		inner += '</div>';

		picker.className = CORE.classes.cp;
		picker.innerHTML = inner;

		DOCUMENT.body.appendChild( picker );

		CURRENT.cp = {
			node: picker,
			saturation: picker.firstChild.firstChild,
			hue: picker.lastChild.children[0].firstChild,
			opacity: picker.lastChild.children[1].firstChild,
			input: picker.lastChild.children[2].firstChild,
			isOpen: true,
			isDragging: false
			
		};
		DATA.setColor();
		DATA.setPickerPosition();
		ACTIONS.onSaturation( CURRENT.cp.saturation.parentNode, id );
		ACTIONS.onHue( CURRENT.cp.hue, id );
		ACTIONS.onOpacity( CURRENT.cp.opacity, id );
		ACTIONS.onInput( CURRENT.cp.input, id );

	},

	clear: function( ev, ui, id ){
		const CURRENT = LocalStorage( id ).getObject();

		ev.preventDefault();

		if( !CURRENT ){
			return;

		}
		CURRENT.source.node.value = '';
		CURRENT.preview.node.style.backgroundColor = '';

		if( isFunction( CURRENT.onchange ) ){
			CURRENT.onchange( CURRENT.source.node, '' );

		}

	}

};

export default function( source, options ){

	const DATA = {};

	var inner = '';

	var id, wrapper, fragment, hasClear, color, lsData;

	if( !isNode( source ) || source.parentNode === null ){
		return false;

	}

	if( !isObject( options ) ){
		options = {};

	}

	fragment = DOCUMENT.createDocumentFragment();
	wrapper = DOCUMENT.createElement( 'div' );

	fragment.appendChild( wrapper );


	color = parseColor( source.value );

	if( ( hasClear = isBool( options.clear ) && options.clear ) ){
		inner += '<button class="' + CORE.classes.clear + '">Clear color</button>';

	}
	inner += '<button class="' + CORE.classes.preview + '" style="background-color:' + color.value + ';">Preview</button>';
	wrapper.className = BASE;
	wrapper.innerHTML = inner;
	source.type = 'hidden';

	DATA.color = color;

	DATA.source = {
		node: source

	}; 

	DATA.preview = {
		node: wrapper.lastChild

	};

	if( hasClear ){
		DATA.clear = {
			node: wrapper.firstChild

		};

	}

	if( isFunction( options.onchange ) ){
		DATA.onchange = options.onchange;

	}
	lsData = LocalStorage();
	id = lsData.set( DATA );

	if( hasClear ){
		node( wrapper.firstChild ).on( 'click', CORE.clear, id );

	}
	node( wrapper.lastChild ).on( 'click', CORE.toggle, id );
	node( DOCUMENT.documentElement ).on( 'mouseup', CORE.mouseup, id );
	node( WINDOW ).on( 'scroll', lsData.setPickerPosition, true, true );

	source.parentNode.appendChild( fragment );

	return {
		id,
		destroy: lsData.destroy
	};

}