import { isObject, isString, isArray, isFunction, isClassName } from './is.js';
import { ClassName } from './className.js';
import node from '../dom/element.js';
import { extend } from './fill.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const CLASSNAME = 'comet-modal';

const BASE = ClassName( CLASSNAME );

const CORE = {

	classes: {
		default: CLASSNAME,
		close: BASE.element( 'close' ),
		frame: BASE.element( 'frame' ),
		header: BASE.element( 'header' ),
		body: BASE.element( 'body' )
	},

	destroy: function( ev, ui, data ){
		ev.preventDefault();

		if( isFunction( data.done ) ){

			if( data.done( ev, ui, data.target ) === 1 ){
				return false;

			}

		}

		if( data.target && data.target.parentNode !== null ){
			data.target.parentNode.removeChild( data.target );

		}

	}

};

export default function ( options ){

	const FRAGMENT = DOCUMENT.createDocumentFragment();
	const MODAL = DOCUMENT.createElement( 'div' );
	var classes = extend( CORE.classes );
	var modClass, MOD;

	if( isClassName( options.slug ) ) {
		modClass = BASE.modifier( options.slug );
		MOD = ClassName( modClass );

		classes.default += ' ' + modClass;
		classes.close += ' ' + MOD.element( 'close' );
		classes.frame += ' ' + MOD.element( 'frame' );
		classes.header += ' ' + MOD.element( 'header' );
		classes.body += ' ' + MOD.element( 'body' );

	}

	FRAGMENT.appendChild( MODAL );

	var inner, header, button, body;

	if( !isObject( options ) ){
		options = {};

	}
	options.close = isObject( options.close ) ? options.close : {};
	options.close.title = isString( options.close.title ) ? options.close.title.trim() : __cometi18n.ui.close;
	options.close.icon = isString( options.close.icon ) ? options.close.icon.trim() : '<span class="cico cico-x"></span>';

	inner = '<button class="' + classes.close + '" title="' + options.close.title + '">';
	inner += options.close.icon;
	inner += '</button>';

	inner += '<div class="' + classes.frame + '">';
	inner += '<header class="' + classes.header + '"></header>';
	inner += '<section class="' + classes.body + '"></section>';
	inner += '</div>';

	/*if( isString( options.classes ) && isClassName( options.classes ) ){
		classes += ' ' + options.classes;

	}else if( isArray( options.classes ) ){
		classes += ' ' + options.classes.join( ' ' );

	}*/

	MODAL.innerHTML = inner;
	MODAL.className = classes.default;

	button = MODAL.firstChild;
	header = MODAL.lastChild.firstChild;
	body = MODAL.lastChild.lastChild;

	if( isString( options.header ) ){
		header.innerHTML = options.header;

	}else{
		header.appendChild( options.header );

	}

	if( isString( options.content ) ){
		body.innerHTML = options.content;

	}else{
		body.appendChild( options.content );

	}

	node( button ).on( 'click', CORE.destroy, { target: MODAL, done: options.done } );

	DOCUMENT.body.appendChild( FRAGMENT );

	return {
		target: MODAL,
		modal: MODAL.lastChild,
		header: header,
		body: body,
		destroy: function(){

			if( MODAL && MODAL.parentNode !== null ){
				MODAL.parentNode.removeChild( MODAL );

			}

		}
	};
	
}