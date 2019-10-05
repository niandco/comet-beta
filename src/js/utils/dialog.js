import { isFunction, isObject, isNode, isString, isEmpty } from './is.js';
import { stripTags } from './fill.js';
import node from '../dom/element.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const ID = 'comet-confirm-box';

const CORE = {

	cancel: function( ev, ui, data ){
		ev.preventDefault();

		if( isFunction( data.cancel ) ){
			data.cancel( ev, ui, data.node );

		}
		node( data.node ).remove();

	},

	confirm: function( ev, ui, data ){
		ev.preventDefault();
		data.function( ev, ui, data.data );

	}

};

export default function( options ){
	var fragment = DOCUMENT.createDocumentFragment();
	var confirm = DOCUMENT.getElementById( ID );
	var hasCancel = true;
	var inner, buttonset;

	if( !isObject( options ) ){
		options = {};

	}
	
	if( !isObject( options.ui ) ){
		options.ui = {};

	}
	hasCancel = options.hasCancel !== false;

	options.ui.cancel = !isString( options.ui.cancel ) || isEmpty( options.ui.cancel ) ? __cometi18n.ui.cancel : options.ui.cancel.trim();
	options.ui.done = !isString( options.ui.done ) || isEmpty( options.ui.done ) ? __cometi18n.ui.done : options.ui.done.trim();
	options.message = isString( options.message ) ? stripTags( options.message, '<strong><i><b><a><ins><u><sup><sub>' ) : '';

	if( !isNode( confirm ) ){
		confirm = DOCUMENT.createElement( 'div' );

	}
	fragment.appendChild( confirm );

	inner = '<div class="comet-inner">';
	inner += '<div class="comet-textbox"><p>' + options.message + '</p></div>';
	inner += '<div class="comet-buttonset">';

	if( hasCancel ){
		inner += '<button class="comet-button comet-cancel">' + options.ui.cancel + '</button>';
		
	}
	inner += '<button class="comet-button comet-buttonPrimary comet-done">' + options.ui.done + '</button>';
	inner += '</div>';
	inner += '</div>';

	confirm.id = ID;
	confirm.className = 'comet-dialog comet-wrapper comet-alertbox';
	confirm.innerHTML = inner;

	buttonset = confirm.firstChild.lastChild;

	if( hasCancel ){
		node( buttonset.firstChild ).on( 'click', CORE.cancel, { cancel: options.cancel, node: confirm } );

	}

	if( isFunction( options.confirm ) ){

		options.data = isObject( options.data ) ? options.data : { value: options.data };
		options.data.dialog = {
			buttonset: {
				cancel: buttonset.firstChild,
				done: buttonset.lastChild
			},
			textbox: confirm.firstChild.firstChild,
			target: confirm,
			destroy: function(){
				node( confirm ).remove();

			}
		};

		node( buttonset.lastChild ).on( 'click', CORE.confirm, { function: options.confirm, data: options.data } );

	}
	DOCUMENT.body.appendChild( fragment );

	return {
		buttonset: {
			cancel: buttonset.firstChild,
			done: buttonset.lastChild
		},
		textbox: confirm.firstChild.firstChild,
		target: confirm,
		destroy: function(){
			node( confirm ).remove();

		}

	};

}