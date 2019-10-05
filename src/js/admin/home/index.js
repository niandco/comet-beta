import { isString, isObject, isNode } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { __class, __elt } from './classes.js';
import { escUrl } from '../../utils/fill.js';
import Node from '../../dom/element.js';

const DOCUMENT = document;

const CL_WIDGET = ClassName( __class.widget );

const EVENTS = {

	className: CL_WIDGET.modifier( 'slider__slide--active' ),

	back: function( ev, ui, data ){
		var sibling_id = data.id;

		sibling_id--;

		if( !isObject( data.slides[sibling_id] ) || !isNode( data.slides[sibling_id].ui ) ){
			return;

		}
		Node( data.slides[data.id].ui ).removeClass( EVENTS.className );
		Node( data.slides[sibling_id].ui ).addClass( EVENTS.className );

	},

	next: function( ev, ui, data ){
		var sibling_id = data.id;

		sibling_id++;

		if( !isObject( data.slides[sibling_id] ) || !isNode( data.slides[sibling_id].ui ) ){
			return;

		}
		Node( data.slides[data.id].ui ).removeClass( EVENTS.className );
		Node( data.slides[sibling_id].ui ).addClass( EVENTS.className );

	},

};

export default class Home {

	constructor( response ){

		this.response = response;

		this.layout = null;

	}

	render(){
		const FRAG = DOCUMENT.createDocumentFragment();
		const C = ClassName( __class.column );
		var o = '';

		this.layout = DOCUMENT.createElement( 'div' );

		FRAG.appendChild( this.layout );

		o += '<div class="' + C.combineWith( [ C.modifier( 'c1' ) ] ) + '"></div>';
		o += '<div class="' + C.combineWith( [ C.modifier( 'c2' ) ] ) + '"></div>';
		o += '<div class="' + C.combineWith( [ C.modifier( 'c3' ) ] ) + '"></div>';

		this.layout.className = __class.content;
		this.layout.innerHTML = o;

		this.widget( 'intro', 0, this.response.widgets.intro );
		this.widget( 'slider', 1, this.response.widgets.slider );
		this.widget( 'learn', 2, this.response.widgets.learn );
		this.widget( 'docs', 2, this.response.widgets.docs );

		return FRAG;

	}

	widget( slug, column, data ){
		const FRAG = DOCUMENT.createDocumentFragment();
		const LT = DOCUMENT.createElement( 'div' );

		FRAG.appendChild( LT );

		LT.className = CL_WIDGET.combineWith( [ CL_WIDGET.modifier( slug ) ] );
		LT.appendChild( this[slug]( data ) );

		this.layout.childNodes[column].appendChild( FRAG );

	}

	intro( data ){
		const FRAG = DOCUMENT.createDocumentFragment();
		const H2 = DOCUMENT.createElement( 'h2' );
		const P1 = DOCUMENT.createElement( 'p' );
		const P2 = DOCUMENT.createElement( 'p' );
		const A = DOCUMENT.createElement( 'a' );
		const C = ClassName( 'comet-button' );

		FRAG.appendChild( H2 );
		FRAG.appendChild( P1 );
		FRAG.appendChild( P2 );
		FRAG.appendChild( A );

		H2.innerHTML = data.h2;
		P1.innerHTML = data.p1;
		P2.innerHTML = data.p2;
		A.innerHTML = data.button.title;
		A.href = escUrl( data.button.url );
		A.target = '_blank';
		A.className = C.combineWith( [ C.modifier( 'rounded' ), CL_WIDGET.modifier( 'intro__button' ) ] );

		return FRAG;

	}

	slider( data ){
		const FRAG = DOCUMENT.createDocumentFragment();
		const SLIDES = data.slides;
		const TOTAL = SLIDES.length;
		const CL = {
			slide: CL_WIDGET.modifier( 'slider__slide' ),
			counter: CL_WIDGET.modifier( 'slider__slide__counter' ),
			content: CL_WIDGET.modifier( 'slider__slide__content' ),
			buttonset: CL_WIDGET.modifier( 'slider__slide__buttonset' ),
			button: CL_WIDGET.modifier( 'slider__slide__button' ),
			next: CL_WIDGET.modifier( 'slider__slide__button--next' ),
			prev: CL_WIDGET.modifier( 'slider__slide__button--prev' ),


		};
		var n = 0;
		var button, ui, slide, has_title, has_content, inner;

		for( n; n < TOTAL; n++ ){

			if( !( slide = SLIDES[n] ) ){
				continue;

			}
			has_title = isString( slide.title );
			has_content = isString( slide.content );

			if( !has_title && !has_content ){
				continue;

			}
			ui = DOCUMENT.createElement( 'div' );
			slide.ui = ui;

			FRAG.appendChild( ui );

			inner = '<div class="' + CL.counter + '">';
			inner += '<span>' + ( n + 1 ) +'/' + TOTAL + '</span>';
			inner += '</div>';
			inner += '<div class="' + CL.content + '">';

			if( has_title ){
				inner += '<h4>' + slide.title + '</h4>';

			}

			if( has_content ){
				inner += '<p>' + slide.content + '</p>';

			}
			inner += '</div>';
			inner += '<div class="' + CL.buttonset + '">';
			inner += '</div>';
			inner += '</div>';

			ui.className = ClassName( CL.slide ).combineWith( [ ClassName( CL.slide ).modifier( 's' + n ), ( n === 0 ? EVENTS.className : null ) ] );
			ui.innerHTML = inner;

			if( n > 0 ){
				button = DOCUMENT.createElement( 'button' );
				button.className = ClassName( CL.button ).combineWith( [ CL.prev ] );
				button.title = data.buttonset.back;
				button.innerHTML = '<span class="cico cico-arrow-left-alt"></span>';

				ui.lastChild.appendChild( button );

				Node( button ).on( 'click', EVENTS.back, { id: n, slides: SLIDES } );

			}

			if( n < ( TOTAL - 1 ) ){
				button = DOCUMENT.createElement( 'button' );
				button.className = ClassName( CL.button ).combineWith( [ CL.next ] );
				button.title = data.buttonset.next;
				button.innerHTML = '<span class="cico cico-arrow-right-alt"></span>';

				ui.lastChild.appendChild( button );

				Node( button ).on( 'click', EVENTS.next, { id: n, slides: SLIDES } );

			}

		}
		return FRAG;

	}

	learn( data ){
		const FRAG = DOCUMENT.createDocumentFragment();
		const CL = ClassName( CL_WIDGET.modifier( 'learn' ) );
		const C = {
			url: CL.element( 'url' ),
			title: CL.element( 'title' ),
			desc: CL.element( 'desc' )
		};
		var n = 0;
		var ui, inner;


		for( n; n < data.length; n++ ){
			ui = DOCUMENT.createElement( 'a' );
			inner = '';

			FRAG.appendChild( ui );

			if( isString( data[n].title ) ){
				inner += '<span class="' + C.title + '">' + data[n].title + '</span>';

			}

			if( isString( data[n].desc ) ){
				inner += '<span class="' + C.desc + '">' + data[n].desc + '</span>';
				
			}
			ui.className = C.url;
			ui.target = '_blank';
			ui.href = escUrl( data[n].url );
			ui.innerHTML = inner;

		}
		return FRAG;

	}

	docs( data ){
		const FRAG = DOCUMENT.createDocumentFragment();
		const A = DOCUMENT.createElement( 'a' );

		FRAG.appendChild( A );

		A.innerHTML = data.title;
		A.href = escUrl( data.url );
		A.target = '_blank';
		A.className = CL_WIDGET.modifier( 'docs__url' );

		return FRAG;

	}

}