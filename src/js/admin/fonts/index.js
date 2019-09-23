import { isString, isArray } from '../../utils/is.js';
import { isResource } from './helpers.js';
import Modal from '../../utils/modal.js';
import node from '../../dom/element.js';
import CLASSES from './classes.js';
import Fontui from './font-ui.js';
import Fonts from './fonts.js';
import File from './file.js';
import svg from './svg.js';

/* global document, __cometi18n, __cometdata, XMLHttpRequest */

const DOCUMENT = document;

const FONTSJS = new Fonts();

const FONTUI = new Fontui();

const EVENTS = {

	add: function( ev ){
		const fragment = DOCUMENT.createDocumentFragment();
		const wrapper = DOCUMENT.createElement( 'div' );
		var inner, wfields, m;

		ev.preventDefault();

		wrapper.className = 'comet-modal--fonts__body__wrapper';

		fragment.appendChild( wrapper );

		inner = '<div class="comet-modal--fonts__body__messages"></div>';

		inner += '<div class="comet-modal--fonts__body__form">';
		inner += '<div class="comet-modal--fonts__body__form__control">';
		inner += '<label class="comet-modal--fonts__body__form__label">' + __cometi18n.ui.resource + '</label>';
		inner += '<select class="comet-input" name="resource">';
		inner += '<option value="google">Google Fonts</option>';
		inner += '<option value="typeKit">TypeKit</option>';
		inner += '<option value="typography">Typography.com (H&Co)</option>';
		//inner += '<option value="custom">' + __cometi18n.ui.custom + '</option>';
		inner += '</select>';
		inner += '</div>';

		inner += '<div class="comet-modal--fonts__body__form__control">';
		inner += '<label class="comet-modal--fonts__body__form__label">' + __cometi18n.ui.embed + '</label>';
		inner += '<textarea class="comet-input" name="embed"></textarea>';
		inner += '</div>';

		inner += '<button class="comet-button comet-button--primary comet-button--rounded" aria-label="' + __cometi18n.ui.import + '">' + __cometi18n.ui.import + '</button>';
		inner += '</div>';
		wrapper.innerHTML = inner;

		wfields = wrapper.lastChild.children;

		node( wrapper.lastChild.lastChild ).on( 'click', EVENTS.import, {
			resource: wfields[0].lastChild,
			embed: wfields[1].lastChild

		} );

		m = Modal({
			slug: 'fonts',
			header: '<h4>' + __cometi18n.ui.addFont + '</h4>',
			content: fragment,
			done: function(){

				if( FONTSJS.isImporting() ){
					return 1;

				}
				FONTSJS.setModal( false );

			}

		});

		m.fontBoxUi = {
			box: wrapper,
			import: wrapper.lastChild.lastChild,
			messagesBox: wrapper.firstChild

		};

		FONTSJS.setModal( m );


	},

	import: function( ev, ui, data ){

		ev.preventDefault();

		if( FONTSJS.isImporting() ){
			return;

		}
		FONTSJS.setState( true );

		if( !isResource( data.resource.value ) ){
			//@TODO: error
			return;

		}

		if( !isString( data.embed.value ) ){
			//@TODO: error
			return;

		}
		File( data.embed.value );

	}

}; 

export default function(){

	const source = DOCUMENT.getElementById( 'comet-tempframe__fonts' );
	var fragment, header, h_inner, b_inner, body, i, collection;

	if( source === null || source.parentNode === null ){
		return;

	}
	fragment = DOCUMENT.createDocumentFragment();
	header = DOCUMENT.createElement( 'div' );
	header.className = CLASSES.header;

	h_inner = '<div class="' + CLASSES.hColumn + '">';
	h_inner += '<h4 class="' + CLASSES.counter + '"></h4>';
	h_inner += '<span class="' + CLASSES.gauge.main + ' ' + CLASSES.gauge.slow + '"></span>';
	h_inner += '</div>';
	h_inner += '<div class="' + CLASSES.hColumn + '">';
	h_inner += '<button class="comet-button comet-button--primary comet-button--circle comet-button--has-icon ' + CLASSES.button + '" title="' + __cometi18n.ui.addFont + '">';
	h_inner += '<span class="comet-button__icon cico cico-plus"></span>';
	h_inner += '</button>';
	h_inner += '</div>';

	header.innerHTML = h_inner;

	body = DOCUMENT.createElement( 'div' );
	body.className = CLASSES.list;

	fragment.appendChild( header );
	fragment.appendChild( body );

	node( header.lastChild.firstChild ).on( 'click', EVENTS.add );

	collection = FONTSJS.setFonts( __cometdata.fonts );
	FONTSJS.setFrameUiOnce( source );
	FONTSJS.setCounterUiOnce( header.firstChild.firstChild );
	FONTSJS.setLoadInfoUiOnce( header.firstChild.lastChild );
	FONTSJS.setFontsBoxUiOnce( body );

	if( isArray( collection ) && collection.length > 0 ){

		for( i = 0; i < collection.length; i++ ){
			FONTUI.html( collection[i] );
			FONTUI.css( collection[i] );

		}

	}else{
		b_inner = '<div class="' + CLASSES.tutorial.main + '">';
		b_inner += '<h2>' + __cometi18n.messages.error.noFonts + '</h2>';
		b_inner += '<p>' + __cometi18n.messages.selFonts1 + '<br>' + __cometi18n.messages.selFonts2 + '</p>';
		b_inner += '<div class="' + CLASSES.tutorial.row + '">';
		b_inner += '<div class="' + CLASSES.tutorial.column + ' ' + CLASSES.tutorial.column + '--c1">';
		b_inner += '<figure>' + svg( 'heart' ) + '</figure>';
		b_inner += '<h4>Browsering</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt1 + '</p>';
		b_inner += '</div>';
		b_inner += '<div class="' + CLASSES.tutorial.column + ' ' + CLASSES.tutorial.column + '--c2">';
		b_inner += '<figure>' + svg( 'add' ) + '</figure>';
		b_inner += '<h4>Importing</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt2 + '</p>';
		b_inner += '</div>';
		b_inner += '<div class="' + CLASSES.tutorial.column + ' ' + CLASSES.tutorial.column + '--c3">';
		b_inner += '<figure>' + svg( 'check' ) + '</figure>';
		b_inner += '<h4>Using</h4>';
		b_inner += '<p>' + __cometi18n.messages.fontSt3 + '</p>';
		b_inner += '</div>';
		b_inner += '</div>';
		b_inner += '</div>';
		body.innerHTML = b_inner;

	}
	source.parentNode.replaceChild( fragment, source );
	FONTSJS.setLoadTime();
	FONTSJS.setCounter();

}