import { isObject, isString, isFunction, isEmpty, isNode, isWindow, isDocument } from '../utils/is.js';
import { arrayDiff } from '../utils/fill.js';
import { decodeSelector } from './decode.js';

const DOCUMENT = document;

function getSize( object, type, depth ){
	var isWidth;

	if( !isString( type ) || isEmpty( type ) || [ 'width', 'height' ].indexOf( type = type.toLowerCase() ) < 0 ){
		return false;

	}
	isWidth = ( type === 'width' );

	switch( depth ){
		case -2:
		case '-2':
		case 'real':
		case 'REAL':
		depth = -2;
		break;
		case -1:
		case '-1':
		case 'padding':
		case 'PADDING':
		depth = -1;
		break;
		case 1:
		case '1':
		case true:
		case 'true':
		case 'margin':
		case 'MARGIN':
		depth = 1;
		break;
		default:
		depth = 0;

	}

	if( isWindow( object ) ){

		if( depth === 0 ){
			return isWidth ? object.outerWidth : object.outerHeight;

		}
		return isWidth ? object.innerWidth : object.innerHeight;

	}

	if( isNode( object ) ){

		if( depth === 0 ){
			return isWidth ? object.offsetWidth : object.offsetHeight;

		}
		return isWidth ? object.clientWidth : object.clientHeight;

	}
	return false;

}

function insertTo( object, position, entry ){

	const positions = [ 'beforebegin', 'afterbegin', 'beforeend', 'afterend' ];

	if( !isNode( object ) || !isString( position ) || positions.indexOf( position = position.toLowerCase() ) < 0 ){
		return;

	}

	if( typeof entry === 'string' ){
		node.insertAdjacentHTML( position, entry );
		return;

	}
	object.insertAdjacentElement( position, entry );

}

export function children( object, query ){
	const aChildren = [];
	var hasOnChildFunction = false;
	var selector, all, a, classes;

	if( !isNode( object ) || !isObject( query ) || isEmpty( all = object.children ) ){
		return aChildren;

	}
	hasOnChildFunction = isFunction( query.onMatch );

	if( !( selector = decodeSelector( query.selector ) ) ){
		return all;

	}

	if( selector.tagName === null && selector.classList.length < 1 ){
		return all;

	}

	for( a = 0; a < all.length; a++ ){

		if( !isNode( all[a] ) ){
			continue;

		}

		if( selector.tagName !== null ){

			if( all[a].tagName.toLowerCase() !== selector.tagName ){
				continue;

			}

		}

		if( selector.classList.length > 0 && ( classes = classList( all[a] ) ).length > 0 ){

			if( arrayDiff( classes, selector.classList ).length > 0 ){
				continue;

			}

		}
		aChildren[aChildren.length] = all[a];

		if( hasOnChildFunction ){
			query.onMatch( all[a] );
			
		}

	}
	return aChildren;

}

export function child( object, selector  ){

	return !isNode( object ) && !isDocument( object ) ? null : object.querySelector( selector );

}

export function classList( object ){

	return isNode( object ) && isString( object.className ) ? object.className.split( ' ' ) : [];

}

export function hasClass( object, classe ){
	const classes = classList( object );

	return classes.length > 0 && isString( classe ) && classes.indexOf( classe ) > -1;

}

export function hasClasses( object, classes ){
	const _classList = classList( object );
	var c;

	if( _classList.length < 1 || !isObject( classes ) || !( 'length' in classes ) || classes.length < 1 ){
		return false;

	}

	for( c = 0; c < classes.length; c++ ){

		if( !isString( classes[c] ) ){
			continue;

		}

		if( _classList.indexOf( classes[c] ) < 0 ){
			return false;

		}

	}
	return true;

}

export function removeClass( object, classe ){
	const newClasses = [];
	var classes, a;

	if( !hasClass( object, classe ) ){
		return;

	}
	classes = classList( object );

	for( a = 0; a < classes.length; a++ ){

		if( classes[a] === classe ){
			continue;

		}
		newClasses[newClasses.length] = classes[a];

	}
	object.className = newClasses.join( ' ' );

}

export function addClass( object, classe ){

	if( hasClass( object, classe ) ){
		return;

	}
	object.className = object.className + ' ' + classe;
}

export function toggleClass( object, classe ){

	if( !isNode( object ) || !isString( classe ) ){
		return;

	}

	if( hasClass( object, classe ) ){
		removeClass( object, classe );
		return;

	}
	addClass( object, classe );

}

export function before( object, entry ){
	return insertTo( object, 'beforebegin', entry );

}

export function after( object, entry ){
	return insertTo( object, 'afterend', entry );

}

export function append( object, entry ){
	return insertTo( object, 'beforeend', entry );

}

export function prepend( object, entry ){
	return insertTo( object, 'afterbegin', entry );

}

export function remove( object ){

	if( !isNode( object ) || object.parentNode === null ){
		return;

	}
	object.parentNode.removeChild( object );

}

export function height( object, depth ){
	return getSize( object, 'height', depth );

}

export function width( object, depth ){
	return getSize( object, 'width', depth );

}

export function offset( object ){
	var rect, win;

	if( !isNode( object ) ){
		return false;

	}
	rect = object.getBoundingClientRect();
	win = object.ownerDocument.defaultView;

	return {
		top: rect.top + win.pageYOffset,
		left: rect.left + win.pageXOffset
	};

}

export function next( object, query ){
	var nextSibling = null;
	var selector, classes;

	if( !isNode( object ) || ( nextSibling = object.nextSibling ) === null ){
		return false;

	}

	if( !isObject( query ) || !( selector = decodeSelector( query.selector ) ) ){
		return nextSibling;

	}

	if( selector.tagName === null && selector.classList.length < 1 && selector.id === null ){
		return nextSibling;

	}

	while( nextSibling !== null ){

		if( selector.tagName !== null ){

			if( nextSibling.tagName.toLowerCase() !== selector.tagName ){
				nextSibling = nextSibling.nextSibling;
				continue;

			}

		}

		if( selector.id !== null ){

			if( nextSibling.id !== selector.id ){
				nextSibling = nextSibling.nextSibling;
				continue;

			}

		}

		if( selector.classList.length > 0 && ( classes = classList( nextSibling ) ).length > 0 ){

			if( arrayDiff( classes, selector.classList ).length > 0 ){
				nextSibling = nextSibling.nextSibling;
				continue;

			}

		}
		return nextSibling;

	}
	return false;

}

export function prev( object, query ){
	var previousSibling = null;
	var selector, classes;

	if( !isNode( object ) || ( previousSibling = object.previousSibling ) === null ){
		return false;

	}

	if( !isObject( query ) || !( selector = decodeSelector( query.selector ) ) ){
		return previousSibling;

	}

	if( selector.tagName === null && selector.classList.length < 1 && selector.id === null ){
		return previousSibling;

	}

	while( previousSibling !== null ){

		if( selector.tagName !== null ){

			if( previousSibling.tagName.toLowerCase() !== selector.tagName ){
				previousSibling = previousSibling.previousSibling;
				continue;

			}

		}

		if( selector.id !== null ){

			if( previousSibling.id !== selector.id ){
				previousSibling = previousSibling.previousSibling;
				continue;

			}

		}

		if( selector.classList.length > 0 && ( classes = classList( previousSibling ) ).length > 0 ){

			if( arrayDiff( classes, selector.classList ).length > 0 ){
				previousSibling = previousSibling.previousSibling;
				continue;

			}

		}
		return previousSibling;

	}
	return false;

}

export function closest( object, query ){
	var tmp;

	if( !isNode( object ) ){
		return false;

	}

	if( ( tmp = next( object, query ) ) ){
		return tmp;

	}

	if( ( tmp = prev( object, query ) ) ){
		return tmp;

	}
	return false;

}

/*export function toggle( duration ){

	if( node.style.display !== 'none' ){
		prop.slideUp( duration );
		return;

	}
	prop.slideDown( duration );

};

export function slideUp( object, duration ){
	var tmp, height, counter, timer;

	if( !isNode( object) || object.style.display === 'none' ){
		return;

	}
	object.style.overflow = 'hidden';
	duration = duration <= 0 ? 500 : duration;
	height = height( object );
	counter = height;
	tmp = height / 10;

	timer = setInterval( function(){
		counter -= tmp;

		if( counter > 0 ){
			object.style.height = counter + 'px';

		}else{
			clearInterval(timer);

		}
	}, duration);

};

export function slideDown( duration ){
	var tmp, height, counter, timer;


	if( !isNode( object) || object.style.display === 'none' ){
		return;

	}
	object.style.overflow = 'hidden';
	object.style.height = '0px';
	duration = duration <= 0 ? 500 : duration;
	height = height( object );
	counter = height;
	tmp = height / 10;

	timer = setInterval( function (){
		counter += tmp;

		if( counter < height ){
			node.style.height = counter + 'px';

		}else{
			node.style.removeProperty( 'overflow' );
			node.style.removeProperty( 'height' );
			clearInterval(timer);

		}

	}, duration);

}*/

export function trigger( object, eventName ){
	var event;

	if( !isNode( object ) && !isDocument( object ) && !isWindow( object ) ){
		return;

	}
	event = DOCUMENT.createEvent( 'HTMLEvents' );
	event.initEvent( eventName, false, true );
	object.dispatchEvent( event );

}

export function on( object, types, listener, data, mixed ){
	var e = 0;
	var events;

	if( !isNode( object ) && !isDocument( object ) && !isWindow( object ) ){
		return;

	}

	if( !isString( types ) || !isFunction( listener ) || ( events = types.split( ' ' ) ).length < 1 ){
		return;

	}

	while( e < events.length ){

		if( events[e].length < 1 ){
			e++;
			continue;

		}
		object.addEventListener( events[e], function( event ){
			listener( event, this, data );

		}, mixed );
		e++;

	}

}

export function load( object, url, callback ){
	var request;

	if( !isString( url ) || isEmpty( url ) || !isNode( object ) ){
		return false;

	}
	request = new XMLHttpRequest();
	request.open( 'GET', url, true );
	request.onload = function() {
		var response = '';

		if( request.status >= 200 && request.status < 400 ){
			response = request.responseText;
			object.innerHTML = response;

		}

		if( isFunction( callback ) ){
			callback( response, request.status );

		}

	};
	request.send();

}