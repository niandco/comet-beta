import { isObject, isString, isFunction } from '../../utils/is.js';
import { escUrl, jsonDecode } from '../../utils/fill.js';
import { ClassName } from '../../utils/className.js';
import { getParameters } from '../../utils/url.js';
import { __class, __default } from './classes.js';
import Node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';
import Sidebar from './sidebar.js';

import mytemplates from '../templates/index.js';
import settings from '../settings/index.js';
import myfonts from '../fonts/index.js';
import home from '../home/index.js';

const DOCUMENT = document;

const WINDOW = window;

const PAGES = {
	home,
	settings,
	myfonts,
	mytemplates

};

export default class Interface extends Sidebar {

	constructor (){

		super();

		this.fragment = DOCUMENT.createDocumentFragment();

		this.ui = {
			sidebar: null,
			content: null,

		};
		this.pages = isObject( __cometdata.pages ) ? __cometdata.pages : false;

		this.page = 'error';

	}

	setPage ( slug, title ){
		DOCUMENT.body.className = __default.combineWith( [ __default.modifier( slug )] );
		DOCUMENT.title = 'Comet > ' + title;

	}

	load ( ev, ui, request ){
		var h;

		ev.preventDefault();

		request.self.renderLoading();

		if( request.self.page === request.page.slug ){
			request.self.renderError();
			return;

		}
		h = WINDOW.history;
		h.pushState( { rq: request.page.slug }, request.page.page_title, request.page.url );
		request.self.page = request.page.slug;
		request.self.renderPage( request.page );

	}

	renderPage ( data ){
		const self = this;

		if( !isObject( data ) || !( this.pageExists( data.slug ) ) ){
			this.renderError();
			return;

		}

		Ajax({
			do: 'page',
			id: data.slug
		})
		.done(function( response ){
			self.onDone( data, response );

		});

	}

	onDone ( data, response ){
		const C = {
			column: ClassName( __class.header.column ),
			item: ClassName( __class.header.item )
		};
		var a = 0;
		var P, frag, header, section, inner;


		if( !( response = jsonDecode( response ) ) || !( P = this.getPage( data.slug, response ) ) ){
			this.renderError();
			return;

		}
		frag = DOCUMENT.createDocumentFragment();
		header = DOCUMENT.createElement( 'header' );
		section = DOCUMENT.createElement( 'section' );

		frag.appendChild( header );
		frag.appendChild( section );

		inner = '<div class="' + C.column.combineWith( [ C.column.modifier( 'c1' ) ] ) + '">';
		inner += '<a href="#" class="' + C.item.combineWith( [ __class.sidebar.toggle, 'comet-button', 'comet-button--circle', 'comet-button--has-icon' ] ) + '">';
		inner += '<span class="comet-button__icon cico cico-comet"></span>';
		inner += '</a>';
		inner += '</div>';

		inner += '<div class="' + C.column.combineWith( [ C.column.modifier( 'c2' ) ] ) + '">';
		inner += '<h1 class="' + __class.header.item + '">' + data.page_title + '</h1>';
		inner += '</div>';

		inner += '<div class="' + C.column.combineWith( [ C.column.modifier( 'c3' ) ] ) + '">';
		inner += '<div class="' + ClassName( 'comet-tooltip' ).combineWith( [ __class.tooltip.default ] ) + '">';
		inner += '<a href="#" class="' + C.item.combineWith( [ 'comet-button', 'comet-button--circle', 'comet-button--has-icon' ] ) + '">';
		inner += '<span class="comet-button__icon cico cico-question"></span>';
		inner += '</a>';

		inner += '<div class="comet-tooltip__main comet-tooltip__main--right">'
		inner += '<h4 class="' + __class.tooltip.title + '">' + __cometdata.help.title + '</h4>';
		inner += '<p class="' + __class.tooltip.content + '"></p>';
		inner += '<div class="' + __class.tooltip.buttonset + '">';

		for( a; a < __cometdata.help.links.length; a++ ){
			inner += '<a class="' + __class.tooltip.button + '" href="' + escUrl( __cometdata.help.links[a].url ) + '" target="_blank">';
			inner += __cometdata.help.links[a].title;
			inner += '<span class="cico cico-arrow-right"></span>';
			inner += '</a>';

		}
		inner += '</div>';
		inner += '</div>';
		inner += '</div>';
		inner += '</div>';

		header.className = __class.header.default;
		header.innerHTML = inner;
		Node( header.firstChild.firstChild ).on( 'click', this.toggle, this );

		section.className = __class.main;
		section.innerHTML = '<div class="' + __class.content + '"></div>';
		section.firstChild.appendChild( P );
		this.setPage( data.slug, data.page_title );
		this.ui.content.innerHTML = '';
		this.ui.content.appendChild( frag );

	}

	renderError (){
		var inner;

		inner = '<div class="comet-dashboard--error__wrap">';
		inner += '<div class="comet-dashboard--error__content">';
		inner += '<h1>Error</h1>';
		inner += '<p>Page not found or another error occured.</p>';
		inner += '</div>';
		inner += '</div>';
		this.ui.content.innerHTML = inner;
		this.setPage( 'error', 'Error' );

	}

	renderLoading (){
		var inner;

		inner = '<div class="comet-dashboard--loading__wrap">';
		inner += '<div class="comet-dashboard--loading__content">';
		inner += '<figure class="comet-dashboard--loading__figure">';
		inner += '<span class="comet-dashboard--loading__spin cico cico-spin comet-spinner"></span>';
		inner += '</figure>';
		inner += '<h1 class="comet-dashboard--loading__aside">Please wait while loading.</h1>';
		inner += '</div>';
		inner += '</div>';
		this.ui.content.innerHTML = inner;
		this.setPage( 'loading', 'Loading' );

	}


	pageExists ( slug ){
		return PAGES.hasOwnProperty( slug );

	}

	getPage ( slug, data ){
		var Page;

		if( !this.pageExists( slug ) || !isFunction( PAGES[slug] ) ){
			return false;

		}

		if( !( Page = new PAGES[slug]( data ) ) || !( 'render' in Page ) ){
			return false;

		}
		return Page.render();

	}

	content (){
		this.ui.content = DOCUMENT.createElement( 'main' );
		this.ui.content.className = __default.element( 'wrap' );
		this.fragment.appendChild( this.ui.content );

		this.renderLoading();

	}

	init (){
		const current = getParameters();

		this.page = ( current.page !== 'comet' ? 'error' : ( isString( current.rq ) ? current.rq : 'home' ) );
		this.sidebar();
		this.content();
		this.renderPage( !this.pages ? 500 : ( isObject( this.pages[this.page] ) ? this.pages[this.page] : 404 ) );

		DOCUMENT.body.appendChild( this.fragment );

	}

}