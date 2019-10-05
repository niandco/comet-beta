import { isObject, isString, isArray } from './is.js';
import { stripTags } from './fill.js';

const WINDOW = window;

export function getParameters( url ){
	const oParametre = {};
	var aItKey, nKeyId, aCouples;

	if( !isString( url ) ){
		url = WINDOW.location;

	}

	if( url.search.length < 1 ){
		return {};

	}

	for( aItKey, nKeyId = 0, aCouples = url.search.substr(1).split('&'); nKeyId < aCouples.length; nKeyId++ ){
		aItKey = aCouples[nKeyId].split('=');
		oParametre[aItKey[0]] = aItKey.length > 1 ? aItKey[1] : '';

	}
	return oParametre;

}

export function addQueryArgs( args, url ){
	var cut = null;
	var key, value, n, _url, kv, ex, e, _ex, _e, __e, h, ioHash, ioQ;

	if( !isString( url ) ){
		return '';

	}
	url = ( stripTags( url ) ).trim();

	if( !isObject( args ) ){
		return url;

	}
	ioQ = url.indexOf( '?' );
	ioHash = url.indexOf( '#' );

	if( ioQ > ioHash ){
		
		if( ioHash > -1 ){
			kv = url.substr( ioHash );
			cut = ioHash;

		}else if( ioQ > -1 ){
			kv = url.substr( ioQ );
			cut = ioQ;

		}

	}else if( ioQ < ioHash ){

		if( ioQ > -1 ){
			kv = url.substr( ioQ );
			cut = ioQ;

		}else if( ioHash > -1 ){
			kv = url.substr( ioHash );
			cut = ioHash;

		}

	}
	_url = url;

	if( cut !== null ){
		_url = url.substr( 0, cut );

		if( isString( kv ) ){
			ex = kv.split( '?' );

			for( e = 0; e < ex.length; e++ ){

				if( ex[e].indexOf( '#' ) > -1 ){
					continue;

				}
				_ex = ex[e].split( '&' );

				if( !isArray( _ex ) || _ex.length < 1 ){
					continue;

				}

				for( _e = 0; _e < _ex.length; _e++ ){

					if( ( h = _ex[_e].indexOf( '=' ) ) < 0 ){
						continue;

					}
					__e = _ex[_e].substr( 0, h );
					args[__e] = _ex[_e].substr( ( h + 1 ) );
				}
			}
		}
	}
	n = 0;
	_url += '?';

	for( key in args ){
		value = args[key];

		if( n !== 0 ){
			_url += '&';

		}
		_url += encodeURI( key ) + '=' + encodeURI( value );
		n++;

	}
	return _url;

}