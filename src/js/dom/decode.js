import { isObject, isString, isBool, isArray, isEmpty } from '../utils/is.js';

export function decodeSelector( selector ){
	var hasClass = false;
	var hasId = false;
	var last, iid, iclass;

	const __core = {

		data: {
			id: null,
			classList: [],
			tagName: null
		},

		get: {

			id: function( str ){
				const id = str.search( /[^a-z0-9\-_]/gi );
				str = id > 0 ? str.slice( 0, id ) : str;

				return isEmpty( str ) ? null : str;

			},

			classes: function( str ){
				const id = str.search( /[^a-z0-9\-_\.]/gi );
				const classList = [];
				var array, a;

				str = id > 0 ? str.slice( 0, id ) : str;
				array = str.split( '.' );

				if( array.length < 1 ){
					return classList;

				}

				for( a = 0; a < array.length; a++ ){

					if( isString( array[a] ) && !isEmpty( array[a] ) ){
						classList[classList.length] = array[a];

					}

				}
				return classList;

			}

		}

	};

	if( !isString( selector ) || isEmpty( selector = selector.trim() ) ){
		return false;

	}

	if( ( last = selector.search( /[^a-z0-9\-_\.\#]/gi ) ) > 0 ){
		selector = selector.slice( 0, last );

	}
	iid = selector.indexOf( '#' );
	iclass = selector.indexOf( '.' );

	if( iid > -1 ){
		hasId = true;

		if( ( last = selector.indexOf( '#', iid + 1 ) ) > 0  ){
			selector = selector.slice( 0, last );

		}
		__core.data.id = __core.get.id( selector.slice( iid + 1 ) );

	}
	
	if( iclass > -1 ){
		hasClass = true;
		__core.data.classList = __core.get.classes( selector.slice( iclass ) );

	}

	if( hasClass && hasId ){
		last = iid > iclass ? iclass : iid;
		__core.data.tagName = ( selector.slice( 0, last ) ).toLowerCase();

	}

	if( !hasClass && !hasId ){
		__core.data.tagName = selector.toLowerCase();

	}
	return __core.data;

}

export function decodeSelectors( selectors ){
	const _selectors = [];
	var s, a, decoded;

	if( !isString( selectors ) || ( s = selectors.split( ' ' ) ).length < 1 ){
		return false;

	}

	for( a = 0; a < s.length; a++ ){

		if( s[a].length < 1 || !( decoded = decodeSelector( s[a] ) ) ){
			continue;

		}
		_selectors[_selectors.length] = decoded;

	}
	return _selectors;

}