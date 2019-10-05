import { ClassName } from '../../utils/className.js';
import { escUrl, extend } from '../../utils/fill.js';
import { isNode, isBool } from '../../utils/is.js';
import { __class } from './classes.js';
import Node from '../../dom/element.js';

const DOCUMENT = document;

var OPEN = true;

export default class Sidebar {

	constructor (){

		this.menu = null;

	}

	toggle( ev, ui, self ){

		ev.preventDefault();

		if( OPEN ){
			OPEN = false;
			self.ui.sidebar.style.display = 'none';
			return;

		}
		OPEN = true;
		self.ui.sidebar.style.display = 'block';

	}

	sidebar (){
		this.ui.sidebar = DOCUMENT.createElement( 'nav' );

		this.fragment.appendChild( this.ui.sidebar );

		this.ui.sidebar.className = __class.sidebar.default;

		this.__menu();
		this.__cards();

	}

	__menu(){
		var slug, pages;

		this.menu = DOCUMENT.createElement( 'ul' );

		this.ui.sidebar.appendChild( this.menu );

		this.menu.className = __class.sidebar.menu;

		if( !this.pages ){
			return;

		}

		for( slug in this.pages ){
			this.pages[slug].slug = slug;
			this.menu.appendChild( this.__menuItem( this.pages[slug] ) );

		}

	}

	__menuItem( data ){
		const self = this;
		const ITEM = DOCUMENT.createElement( 'li' );
		const MClass = ClassName( __class.sidebar.item );
		const AClass = ClassName( __class.sidebar.url );

		ITEM.className = MClass.combineWith( [ MClass.modifier( data.slug ) ] );
		ITEM.innerHTML = '<a class="' + AClass.combineWith( [ AClass.modifier( data.slug ) ] ) + '" href="' + data.url + '" aria-label="' + data.menu_title + '">' + data.menu_title + '</a>';

		if( !isBool( data.reload ) || !data.reload ){
			Node( ITEM.firstChild ).on( 'click', this.load, { self, page: data } );

		}

		return ITEM;

	}

	__cards() {
		var o = '';
		var i = 1;
		var c, cards, oEm;

		if( !( 'cards' in __cometdata ) ){
			return;

		}

		for( c in ( cards = __cometdata.cards ) ){
			o += this.__card( i, cards[c].url, cards[c].icon, cards[c].title );
			i++;

		}
		oEm = DOCUMENT.createElement( 'div' );

		this.ui.sidebar.appendChild( oEm );

		oEm.className = __class.sidebar.cards;
		oEm.innerHTML = o;

	}

	__card( id, url, icon, title ){
		const C = ClassName( __class.sidebar.card );
		var o = '';

		o += '<a class="' + C.combineWith( C.modifier( 'c' + id ) ) + '" href="' + escUrl( url ) + '" target="_blank">';
		o += '<figure><span class="cico cico-' + icon + '"></span></figure>';
		o += '<aside>' + title + '</aside>';
		o += '</a>';

		return o;

	}

}