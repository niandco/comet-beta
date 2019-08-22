

const DOCUMENT = document;

export default function(){

	const source = DOCUMENT.getElementById( 'comet-sourceframe8679171600336466' );
	var fragment, header, h_inner, b_inner, body, i;

	if( source === null || source.parentNode === null ){
		return;

	}
	__core.data.collection = isArray( __cometdata.fonts ) ? __cometdata.fonts : [];
	fragment = DOCUMENT.createDocumentFragment();
	header = DOCUMENT.createElement( 'div' );
	header.className = 'comet-header comet-top comet-wrapper';

	h_inner = '<div class="comet-column">';
	h_inner += '<h4></h4>';
	h_inner += '<span class="comet-gauge comet-indicator is-slow"></span>';
	h_inner += '</div>';
	h_inner += '<div class="comet-column">';
	h_inner += '<button class="comet-button comet-buttonPrimary" title="' + __cometi18n.ui.addFont + '"><span class="cico cico-plus"></span></button>';
	h_inner += '</div>';

	header.innerHTML = h_inner;

	body = DOCUMENT.createElement( 'div' );
	body.className = 'comet-body comet-fontslist comet-wrapper';

	fragment.appendChild( header );
	fragment.appendChild( body );

	node( header.lastChild.firstChild ).on( 'click', __core.actions.add );

	__core.data.counter = header.firstChild.firstChild;
	__core.data.loadInfo = header.firstChild.lastChild;
	__core.data.fontsBox = body;

	if( __core.data.collection.length > 0 ){
		__core.data.hasFonts = true;

		for( i = 0; i < __core.data.collection.length; i++ ){
			__core.actions.addCard( __core.data.collection[i] );
			__core.actions.addCss( __core.data.collection[i] );

		}

	}else{
		__core.data.hasFonts = false;
		b_inner = '<div class="comet-introduction comet-tutorial">';
		b_inner += '<h2>' + __cometi18n.messages.error.noFonts + '</h2>';
		b_inner += '<p>' + __cometi18n.messages.selFonts1 + '<br>' + __cometi18n.messages.selFonts2 + '</p>';
		b_inner += '<div class="comet-row">';
		b_inner += '<div class="comet-column">';
		b_inner += '<figure>' + __core.actions.svg( 'heart' ) + '</figure>';
		b_inner += '<h4>Browsering</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt1 + '</p>';
		b_inner += '</div>';
		b_inner += '<div class="comet-column">';
		b_inner += '<figure>' + __core.actions.svg( 'add' ) + '</figure>';
		b_inner += '<h4>Importing</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt2 + '</p>';
		b_inner += '</div>';
		b_inner += '<div class="comet-column">';
		b_inner += '<figure>' + __core.actions.svg( 'check' ) + '</figure>';
		b_inner += '<h4>Using</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt3 + '</p>';
		b_inner += '</div>';
		b_inner += '</div>';
		b_inner += '</div>';
		body.innerHTML = b_inner;

	}
	source.parentNode.replaceChild( fragment, source );
	__core.actions.set.loadTime();
	__core.actions.set.counter();

}

/**/

import { isString, isObject, isArray, isNode, isBool } from '../utils/is.js';
import { capitalize, jsonEncode } from '../utils/fill.js';
import message from '../utils/message.js';
import dialog from '../utils/dialog.js';
import modal from '../utils/modal.js';
import ajax from '../utils/ajax.js';
import node from '../dom/element.js';

/* global document, __cometi18n, __cometdata, XMLHttpRequest */

/**
* @TODO: Rewrite
*
*/

const DOCUMENT = document;

export default function(){

	const __core = {

		data: {
			collection: [],
			counter: false,
			loadInfo: false,
			fontsBox: false,
			modal: false,
			isImporting: false,
			isDeleting: false,
			hasFonts: false,

		},

		actions: {

			add: function( ev ){
				const fragment = DOCUMENT.createDocumentFragment();
				const wrapper = DOCUMENT.createElement( 'div' );
				var inner, wfields;

				ev.preventDefault();

				wrapper.className = 'comet-savebox comet-wrapper';

				fragment.appendChild( wrapper );

				inner = '<div class="comet-messages comet-wrapper"></div>';

				inner += '<div class="comet-saveform">';
				inner += '<label>';
				inner += '<p>' + __cometi18n.ui.resource + '</p>';
				inner += '<select class="comet-input comet-capture" name="resource">';
				inner += '<option value="google">Google Fonts</option>';
				inner += '<option value="typeKit">TypeKit</option>';
				inner += '<option value="typography">Typography.com (H&Co)</option>';
				//inner += '<option value="custom">' + __cometi18n.ui.custom + '</option>';
				inner += '</select>';
				inner += '</label>';

				inner += '<label>';
				inner += '<p>' + __cometi18n.ui.embed + '</p>';
				inner += '<textarea class="comet-input comet-capture" name="embed"></textarea>';
				inner += '</label>';

				inner += '<button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.import + '">' + __cometi18n.ui.import + '</button>';
				inner += '</div>';
				wrapper.innerHTML = inner;

				wfields = wrapper.lastChild.children;

				node( wrapper.lastChild.lastChild ).on(
					'click',
					__core.actions.import,
					{
						resource: wfields[0].lastChild,
						embed: wfields[1].lastChild
					}
					);

				__core.data.modal = modal({
					classes: 'comet-fontbox',
					header: '<h4>' + __cometi18n.ui.addFont + '</h4>',
					content: fragment,
					done: function(){

						if( __core.data.isImporting ){
							return 1;

						}
						__core.data.modal = false;

					}

				});

				__core.data.modal.fontBoxUi = {
					box: wrapper,
					import: wrapper.lastChild.lastChild,
					messagesBox: wrapper.firstChild

				};


			},

			import: function( ev, ui, _data ){

				ev.preventDefault();

				if( __core.data.isImporting ){
					return;

				}
				__core.actions.set.state( true );

				if( !__core.utils.is_resource( _data.resource.value ) ){
					//@TODO: error
					return;

				}

				if( !isString( _data.embed.value ) ){
					//@TODO: error
					return;

				}
				__core.file( _data.embed.value );

			},

		}

	};

	(function(){
		const source = DOCUMENT.getElementById( 'comet-sourceframe8679171600336466' );
		var fragment, header, h_inner, b_inner, body, i;

		if( source === null || source.parentNode === null ){
			return;

		}
		__core.data.collection = isArray( __cometdata.fonts ) ? __cometdata.fonts : [];
		fragment = DOCUMENT.createDocumentFragment();
		header = DOCUMENT.createElement( 'div' );
		header.className = 'comet-header comet-top comet-wrapper';

		h_inner = '<div class="comet-column">';
		h_inner += '<h4></h4>';
		h_inner += '<span class="comet-gauge comet-indicator is-slow"></span>';
		h_inner += '</div>';
		h_inner += '<div class="comet-column">';
		h_inner += '<button class="comet-button comet-buttonPrimary" title="' + __cometi18n.ui.addFont + '"><span class="cico cico-plus"></span></button>';
		h_inner += '</div>';

		header.innerHTML = h_inner;

		body = DOCUMENT.createElement( 'div' );
		body.className = 'comet-body comet-fontslist comet-wrapper';

		fragment.appendChild( header );
		fragment.appendChild( body );

		node( header.lastChild.firstChild ).on( 'click', __core.actions.add );

		__core.data.counter = header.firstChild.firstChild;
		__core.data.loadInfo = header.firstChild.lastChild;
		__core.data.fontsBox = body;

		if( __core.data.collection.length > 0 ){
			__core.data.hasFonts = true;

			for( i = 0; i < __core.data.collection.length; i++ ){
				__core.actions.addCard( __core.data.collection[i] );
				__core.actions.addCss( __core.data.collection[i] );

			}

		}else{
			__core.data.hasFonts = false;
			b_inner = '<div class="comet-introduction comet-tutorial">';
			b_inner += '<h2>' + __cometi18n.messages.error.noFonts + '</h2>';
			b_inner += '<p>' + __cometi18n.messages.selFonts1 + '<br>' + __cometi18n.messages.selFonts2 + '</p>';
			b_inner += '<div class="comet-row">';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'heart' ) + '</figure>';
			b_inner += '<h4>Browsering</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt1 + '</p>';
			b_inner += '</div>';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'add' ) + '</figure>';
			b_inner += '<h4>Importing</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt2 + '</p>';
			b_inner += '</div>';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'check' ) + '</figure>';
			b_inner += '<h4>Using</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt3 + '</p>';
			b_inner += '</div>';
			b_inner += '</div>';
			b_inner += '</div>';
			body.innerHTML = b_inner;

		}
		source.parentNode.replaceChild( fragment, source );
		__core.actions.set.loadTime();
		__core.actions.set.counter();


	})();

}