import { escUrl, extend, jsonDecode } from '../../utils/fill.js';
import { isObject, isString } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { getParameters } from '../../utils/url.js';
import { __class, __default } from './classes.js';
import Node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';
import Sidebar from './sidebar.js';
import Pages from './pages.js';

const DOCUMENT = document;

const WINDOW = window;

const PAGES = new Pages();

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

	load ( ev, ui, request ){
		var h;

		ev.preventDefault();

		if( request.self.page === request.page.slug ){
			return;

		}
		h = WINDOW.history;
		h.pushState( { rq: request.page.slug }, request.page.page_title, request.page.url );
		request.self.page = request.page.slug;
		request.self.render( request.page );

	}

	render ( data ){
		const H = WINDOW.history;
		const FRAGMENT = DOCUMENT.createDocumentFragment();
		const HEADER = DOCUMENT.createElement( 'header' );
		const SECTION = DOCUMENT.createElement( 'section' );
		const C = {
			column: ClassName( __class.header.column ),
			item: ClassName( __class.header.item )
		};
		var title = 'Comet > ';
		var error = false;
		var a = 0;
		var in__h, in__s;

		FRAGMENT.appendChild( HEADER );
		FRAGMENT.appendChild( SECTION );

		if( !isObject( data ) ){
			error = data;

			data = {
				slug: 'error',
				page_title: 'Error ' + error, // translate
			};

		}
		in__h = '<div class="' + C.column.combineWith( [ C.column.modifier( 'c1' ) ] ) + '">';
		in__h += '<a href="#" class="' + C.item.combineWith( [ __class.sidebar.toggle, 'comet-button', 'comet-button--circle', 'comet-button--has-icon' ] ) + '">';
		in__h += '<span class="comet-button__icon cico cico-comet"></span>';
		in__h += '</a>';
		in__h += '</div>';

		in__h += '<div class="' + C.column.combineWith( [ C.column.modifier( 'c2' ) ] ) + '">';
		in__h += '<h1 class="' + __class.header.item + '">' + data.page_title + '</h1>';
		in__h += '</div>';

		in__h += '<div class="' + C.column.combineWith( [ C.column.modifier( 'c3' ) ] ) + '">';
		in__h += '<div class="' + ClassName( 'comet-tooltip' ).combineWith( [ __class.tooltip.default ] ) + '">';
		in__h += '<a href="#" class="' + C.item.combineWith( [ 'comet-button', 'comet-button--circle', 'comet-button--has-icon' ] ) + '">';
		in__h += '<span class="comet-button__icon cico cico-question"></span>';
		in__h += '</a>';

		in__h += '<div class="comet-tooltip__main comet-tooltip__main--right">'
		in__h += '<h4 class="' + __class.tooltip.title + '">' + __cometdata.help.title + '</h4>';
		in__h += '<p class="' + __class.tooltip.content + '"></p>';
		in__h += '<div class="' + __class.tooltip.buttonset + '">';

		for( a; a < __cometdata.help.links.length; a++ ){
			in__h += '<a class="' + __class.tooltip.button + '" href="' + escUrl( __cometdata.help.links[a].url ) + '" target="_blank">';
			in__h += __cometdata.help.links[a].title;
			in__h += '<span class="cico cico-arrow-right"></span>';
			in__h += '</a>';

		}
		in__h += '</div>';
		in__h += '</div>';
		in__h += '</div>';
		in__h += '</div>';

		DOCUMENT.body.className = __default.combineWith( [ __default.modifier( this.page )] );
		DOCUMENT.title = title + data.page_title;

		HEADER.className = __class.header.default;
		HEADER.innerHTML = in__h;
		Node( HEADER.firstChild.firstChild ).on( 'click', this.toggle, this );

		SECTION.className = __class.main;
		SECTION.innerHTML = '<div class="' + __class.content + '"></div>';

		const self = this;

		if( !error ){
			Ajax({
				do: 'page',
				id: data.slug
			})
			.done(function( response ){

				if( !( response = jsonDecode( response ) ) ){
					return;

				}
				SECTION.firstChild.appendChild( PAGES.getPage( data.slug, response ) );
				self.setInnerContent( FRAGMENT );

			});
			return;

		}
		SECTION.firstChild.innerHTML = '<div>Error ' + error + '</div>';
		this.setInnerContent( FRAGMENT );

	}

	setInnerContent ( fragment ){
		this.ui.content.innerHTML = '';
		this.ui.content.appendChild( fragment );

	}

	content (){
		var o = '';

		const WRAP = DOCUMENT.createElement( 'main' );

		this.fragment.appendChild( WRAP );
		this.ui.content = WRAP;

		WRAP.className = __default.element( 'wrap' );
		WRAP.innerHTML = 'Please wait while loading';

	}

	init (){
		const current = getParameters();

		this.page = ( current.page !== 'comet' ? 'error' : ( isString( current.rq ) ? current.rq : 'home' ) );
		this.sidebar();
		this.content();
		this.render( !this.pages ? 500 : ( isObject( this.pages[this.page] ) ? this.pages[this.page] : 404 ) );

		DOCUMENT.body.appendChild( this.fragment );

	}

}