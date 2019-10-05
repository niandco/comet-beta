import { isObject, isFunction, isString, isEmpty, isTrueValue } from './is.js';

/* global __cometdata, XMLHttpRequest */

const CORE = {

	action: !isTrueValue( __cometdata.user ) ? 'cometnoprivactions' : 'cometprivactions',

	encode: function( obj ){
		var encoded = '';
		var key;

		for( key in obj ){
			encoded += ( encoded.length > 0 ? '&' : '' ) + encodeURI( key + '=' + obj[key] );

		}
		return encoded;

	}

};

export default function( data ){
	var xhr;

	const EVENTS = {

		done: function( todo ){

			if( !isFunction( todo ) || !isObject( xhr ) ){
				return;

			}

			xhr.onload = function(){
				const response = xhr.status === 200 ? xhr.responseText : false;
				todo( response );

			};

		}

	};

	if( !isObject( data ) || !isString( data.do ) || isEmpty( data.do ) ){
		return EVENTS;

	}
	data.do = data.do.trim();
	data.action = CORE.action;

	if( 'security' in __cometdata ){
		data.security = __cometdata.security;

	}
	xhr = new XMLHttpRequest();
	xhr.open( 'POST' , __cometdata.ajax_url, true );
	xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
	xhr.send( CORE.encode( data ) );

	return EVENTS;

}