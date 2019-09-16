import { isObject, isString, isArray } from '../../utils/is.js';
import { capitalize, decodeChars } from '../../utils/fill.js';
import Message from '../../utils/message.js';
import Dialog from '../../utils/dialog.js';
import node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';
import CLASSES from './classes.js';
import Fonts from './fonts.js';


const DOCUMENT = document;

function __Remove( self ){

	var DATA = {};

	var DIALOG = {};

	const CORE = {

		remove: function( ev, ui, data ){

			ev.preventDefault();

			if( self.isDeleting() ){
				return;

			}
			DATA = data;

			Dialog({
				message: __cometi18n.messages.warning.delete,
				ui: {
					done: __cometi18n.ui.delete
				},  
				confirm: CORE.confirm

			});

		},

		confirm: function( ev, ui, current ){
			var done;

			if( self.isDeleting() ){
				return;

			}
			DIALOG = current;
			self.setDelete( true );
			current.dialog.buttonset.cancel.style.display = 'none';
			current.dialog.buttonset.done.innerHTML = '<span class="cico cico-spin"></span>';
			node( current.dialog.buttonset.done ).addClass( 'comet-waitwhile' );

			Ajax({
				do: 'dtemplate',
				id: DATA.id

			}).done( CORE.done );

		},

		done: function( response ){
			var msg = __cometi18n.messages.error.delFont;
			var code = 400;
			var gdata;

			self.setDelete( false );
			DIALOG.dialog.buttonset.cancel.className = 'comet-button comet-button--primary comet-button--cancel';
			DIALOG.dialog.buttonset.cancel.style.display = 'inline-block';
			DIALOG.dialog.buttonset.cancel.innerHTML = __cometi18n.ui.done;
			node( DIALOG.dialog.buttonset.done ).remove();

			if( parseInt( response ) === 1 ){

				if( DATA.card.parentNode !== null ){
					DATA.card.parentNode.removeChild( DATA.card );

				}

				if( isObject( gdata = self.getFontBy( 'id', DATA.id ) ) ){
					self.unsetFont( gdata.index );

				}
				self.setCounter();
				self.setLoadTime();
				msg = __cometi18n.messages.success.delFont;
				code = 200;

			}
			Message( msg, code ).set( DIALOG.dialog.textbox );

		},

	};

	return { remove: CORE.remove };

}

export default class FontUi extends Fonts {

	constructor(){
		super();

	}

	html( data ){
		const fragment = DOCUMENT.createDocumentFragment();
		const card = DOCUMENT.createElement( 'div' );
		const name = isObject( data ) && isString( data.family ) ? data.family : false;
		var inner, c;

		if( !name ){
			return;

		}
		c = isArray( data.weight ) ? data.weight.length : ( isObject( data.weight ) ? Object.keys( data.weight ).length : 0 );
		fragment.appendChild( card );
		inner = '<div class="' + CLASSES.item.preview + '">';
		inner += '<p class="' + CLASSES.item.sample + '" style="font-family:' + name + ';">ABC acb 0123456789</p>';
		inner += '</div>';
		inner += '<div class="' + CLASSES.item.aside + '">';
		inner += '<div class="' + CLASSES.item.meta + '">';
		inner += '<span class="' + CLASSES.item.name + '">' + capitalize( name ) + '</span>';
		inner += '<span class="' + CLASSES.item.style + '">' + ( c === 1 ? '1 style' : c + ' styles' ) + '</span>';
		inner += '</div>';
		inner += '<div class="' + CLASSES.item.events + '">';
		inner += '<button class="comet-button comet-button--circle comet-button--has-icon ' + CLASSES.item.delete + '" title="' + __cometi18n.ui.delete + '"><span class="comet-button__icon cico cico-trash"></span></button>';
		inner += '</div>';
		inner += '</div>';
		card.className = CLASSES.item.main;
		card.innerHTML = inner;

		node( card.lastChild.lastChild.firstChild ).on( 'click', __Remove( this ).remove, { card, id: data.id } );

		if( ( this.count() - 1 ) <= 0 ){
			this.emptyFontsBox();

		}
		this.appendToFontsBox( fragment );

	}

	css( data ){
		var o, inner, i;

		if( !isObject( data ) || !isObject( data.weight ) ){
			return;

		}
		inner = '';

		for( i in data.weight ){

			if( isString( data.weight[i] ) ){
				inner += data.weight[i];

			}

		}
		o = DOCUMENT.createElement( 'style' );
		o.type = 'text/css';
		o.innerHTML = decodeChars( inner );
		DOCUMENT.head.appendChild( o );

	}

}