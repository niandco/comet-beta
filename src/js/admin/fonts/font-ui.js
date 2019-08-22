import { isObject, isString, isArray } from '../../utils/is.js';
import { getFontData } from './helpers.js';
import Dialog from '../../utils/dialog.js';
import Ajax from '../../utils/ajax.js';
import Fonts from './fonts.js';

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
			DIALOG.dialog.buttonset.cancel.className = 'comet-button comet-buttonPrimary comet-cancel';
			DIALOG.dialog.buttonset.cancel.style.display = 'inline-block';
			DIALOG.dialog.buttonset.cancel.innerHTML = __cometi18n.ui.done;
			node( DIALOG.dialog.buttonset.done ).remove();

			if( parseInt( response ) === 1 ){

				if( DATA.card.parentNode !== null ){
					DATA.card.parentNode.removeChild( DATA.card );

				}

				if( isObject( gdata = getFontData( DATA.id ) ) ){
					__core.data.collection.splice( gdata.index, 1 );

				}
				self.setCounter();
				self.setLoadTime();
				msg = __cometi18n.messages.success.delFont;
				code = 200;

			}
			message( msg, code ).set( DIALOG.dialog.textbox );

		},

	};

	return { remove: CORE.remove };

}

export class FontUi extends Fonts {

	constructor(){
		super( this );

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
		inner = '<div class="comet-previewbox comet-sampletext">';
		inner += '<p class="comet-inner comet-text" style="font-family:' + name + ';">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>';
		inner += '</div>';
		inner += '<div class="comet-info comet-wrapper">';
		inner += '<div class="comet-fontinfo">';
		inner += '<span class="comet-fontname">' + capitalize( name ) + '</span>';
		inner += '<span class="comet-fontstyle">' + ( c === 1 ? '1 style' : c + ' styles' ) + '</span>';
		inner += '</div>';
		inner += '<div class="comet-actions comet-ui">';
		inner += '<button class="comet-button" title="' + __cometi18n.ui.delete + '"><span class="cico cico-trash"></span></button>';
		inner += '</div>';
		inner += '</div>';
		card.className = 'comet-font comet-wrapper comet-card';
		card.innerHTML = inner;

		node( card.lastChild.lastChild.firstChild ).on( 'click', __Remove( this ).remove, { card, id: data.id } );

		return fragment;

		/*if( !__core.data.hasFonts ){
			__core.data.fontsBox.innerHTML = '';
			__core.data.hasFonts = true;

		}
		__core.data.fontsBox.appendChild( card );*/


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
		o.innerHTML = inner;
		DOCUMENT.head.appendChild( o );

	}

}