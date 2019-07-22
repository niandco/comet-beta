import { isString, isObject, isFunction, isClassName, isNode, isArray, isDocument } from '../../utils/is.js';
import nodes from '../../dom/elements.js';
import node from '../../dom/element.js';

/* global document, setInterval, clearInterval */

const DOCUMENT = document;

const PREFIX = 'comet';

const SLUG = 'sort';

const DFLT = {

	className: {

		main: function(){
			return PREFIX + '-' + SLUG;

		},

		new: function( str ){

			return this.main() + '-' + str;

		}


	}

};

export default function ( options ){

	const DATA = {
		dragging: false,
		current: null,
		placeholder: null,
		options: {},
		className: {}

	};

	const CORE = {

		set: {

			containment: function( entry ){
				var containment = null;

				switch( entry ){

					case 'parent':
					containment = DATA.options.handle.parentNode;
					break;

					case 'body':
					containment = DOCUMENT.body;
					break;

					default:

					if( !isString( entry ) ){
						containment = null;
						break;

					}
					containment = DOCUMENT.querySelector( entry );

				}

				if( containment === null ){
					containment = DOCUMENT.documentElement;

				}
				DATA.options.containment = containment;
				return containment;

			},

			cursor: function( e ){
				const tcur = isNode( cursor );

				if( e === 'destroy' && tcur ){
					node( cursor ).remove();
					cursor = null;
					return;
				}

				if( !isObject( e ) ){
					return;

				}

				if( !tcur ){
					cursor = DOCUMENT.createElement( 'div' );
					cursor.id = 'comet-uiCursor';

					if( isClassName( options.cursor ) ){
						cursor.className = options.cursor;

					}

					cursor.innerHTML = '<span class="cico cico-move"></span>';
					node( DOCUMENT.body ).append( cursor );
				}

				if( tcur ){
					e.preventDefault();
					cursor.style.left = e.pageX + 'px';
					cursor.style.top = e.pageY + 'px';
				}

			},

			pointer: function(){

				clearInterval( interval );

				top = win.prop().scrollTop;
				height = win.height( 0 );

				if( isNaN( top ) || isNaN( height ) || isNaN( y ) ){
					return;
				}

				if( top > 0 && y < 10 ){
					win.prop().scrollTop = top - 1;
					interval = setInterval( CORE.set.pointer, 1 );
					return;

				}
				if( ( y + 5 ) > height ){
					win.prop().scrollTop = top + 1;
					interval = setInterval( CORE.set.pointer, 1 );
				}
			},

			starting: function( selector, itemsName ){
				var items;

				if( !isNode( selector ) && !isDocument( selector ) ){
					return;

				}
				items = isString( itemsName ) ? selector.querySelectorAll( itemsName ) : [];

				node( selector ).on( 'mouseenter mouseleave', CORE.events.connectWith, { items: items.length > 0, selector: itemsName } );

					if( items.length > 0 ){
						nodes( items ).on( 'mouseover', CORE.events.items );

					}

			}

		},

		events: {

			connectWith: function( ev, ui, cwData ){

				if( !DATA.dragging || ev.type === 'mouseleave' ){

					if( DATA.placeholder.parentNode !== null ){
						DATA.placeholder.parentNode.removeChild( DATA.placeholder );

					}
					return;

				}

				if( !cwData.items || !ui.querySelectorAll( cwData.selector ).length < 1 ){
					ui.appendChild( DATA.placeholder );

				}

			},

			items: function( ev, ui ){
				const uiNode = node( ui );
				var h, my, offset, y, w, mx, x;

				if( !DATA.dragging ){
					return;

				}
				offset = uiNode.offset();
				h = uiNode.height();
				my = h / 2;
				y = ev.pageY - offset.top;

				w = uiNode.width();
				mx = w / 4;
				x = ev.pageX - offset.left;

				if( x <= mx || ( y <= my && ( x >= mx && x <= ( w - mx ) ) ) ){
					uiNode.before( DATA.placeholder );
					return;

				}

				if( x >= ( w - mx ) || ( y <= h && y > my ) ){
					uiNode.after( DATA.placeholder );

				}

			},

			start: function( ev, ui ){

				const connect = DATA.options.connectWith;
				var r, a, b, selector;

				ev.preventDefault();

				DATA.dragging = true;
				DATA.current = ui;
				node( DOCUMENT.body ).addClass( DATA.className.sorting );

				if( isFunction( DATA.options.start ) ){
					r = DATA.options.start( ev, ui );

				}

				if( isNode( r ) ){
					DATA.current = r;

				}

				for( a = 0; a < connect.length; a++ ){

					if( !isObject( connect[a] ) ){
						continue;

					}

					if( isNode( connect[a].selector ) ){
						CORE.set.starting( connect[a].selector, connect[a].items );
						continue;

					}

					if( isString( connect[a].selector ) ){
						selector = DOCUMENT.querySelectorAll( connect[a].selector );

						if( selector.length < 1 ){
							continue;

						}

						for( b = 0; b < selector.length; b++ ){
							CORE.set.starting( selector[b], connect[a].items );
						}

					}


				}

			},

			stop: function( ev ){

				ev.preventDefault();

				clearInterval( DATA.interval );

				if( !DATA.dragging ){
					return;

				}

				if( isFunction( DATA.options.stop ) && DATA.current !== null && DATA.placeholder !== null && DATA.placeholder.parentNode !== null ){
					DATA.options.stop( ev, DATA.placeholder, DATA.current );

					if( DATA.placeholder.parentNode !== null ){
						DATA.placeholder.parentNode.removeChild( DATA.placeholder );

					}

				}
				DATA.current = null;
				DATA.dragging = false;
				node( DOCUMENT.body ).removeClass( DATA.className.sorting );

			},

			dragging: function( ev, ui ){
				var top = ui.scrollTop;
				const height = ui.clientHeight;
				const rect = ui.getBoundingClientRect();
				const y = ev.pageY;

				clearInterval( DATA.interval );

				if( !DATA.dragging || isNaN( top ) || isNaN( height ) || isNaN( y ) ){
					return;
				}

				DATA.interval = setInterval( function(){

					if( y <= rect.y + 10 ){
						top--;

						if( top < 0 ){
							top = 0;
						}
						ui.scrollTop = top;
						return;

					}

					if( y >= ( rect.y + height ) - 10 ){
						top++;
						ui.scrollTop = top;

					}

				}, 1 );

			}

		}

	};

	var placeholder;

	options = !isObject( options ) ? {} : options;

	if( !isNode( options.handle ) || options.parentNode === null || !isNode( options.containment = CORE.set.containment( options.containment ) ) ){
		return false;

	}

	if( !isArray( options.connectWith ) || options.connectWith.length < 1 ){
		options.connectWith = [{
			selector: 'ul',
			items: 'li'
		}];
	}
	DATA.className.sorting = DFLT.className.new( '-sorting' );

	placeholder = DOCUMENT.createElement( 'div' );
	placeholder.className = DFLT.className.new( '-placeholder' ) + ( isClassName( options.placeholder ) ? ' ' + options.placeholder : '' );

	DATA.placeholder = placeholder;
	DATA.options = options;

	node( options.handle ).on( 'mousedown', CORE.events.start );
	node( options.containment ).on( 'mousemove', CORE.events.dragging );
	node( DOCUMENT.documentElement ).on( 'mouseup', CORE.events.stop );

}