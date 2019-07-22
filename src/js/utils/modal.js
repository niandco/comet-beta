import { isObject, isString, isArray, isFunction } from './is.js';
import node from '../dom/element.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const CORE = {

	classes: {
		default: 'comet-modal',
		close: 'comet-modal__close',
		frame: 'comet-modal__frame',
		header: 'comet-modal__header',
		body: 'comet-modal__body'
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

	FRAGMENT.appendChild( MODAL );

	var inner, header, button, body;

	if( !isObject( options ) ){
		options = {};

	}
	options.close = isObject( options.close ) ? options.close : {};
	options.close.title = isString( options.close.title ) ? options.close.title.trim() : __cometi18n.ui.close;
	options.close.icon = isString( options.close.icon ) ? options.close.icon.trim() : '<span class="cico cico-x"></span>';


	inner = '<button class="' + CORE.classes.close + '" title="' + options.close.title + '">';
	inner += options.close.icon;
	inner += '</button>';


	inner += '<div class="' + CORE.classes.frame + '">';
	inner += '<div class="' + CORE.classes.header + '"></div>';
	inner += '<div class="' + CORE.classes.body + '"></div>';
	inner += '</div>';

	MODAL.innerHTML = inner;
	MODAL.className = CORE.classes.default + ( isString( options.classes ) ? ' ' + options.classes.trim() : ( isArray( options.classes ) ? ' ' + ( options.classes ).join( ' ' ) : '' ) );

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