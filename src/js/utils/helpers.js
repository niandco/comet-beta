import { isFunction, isArray, isString, isObject, isClassName } from './is.js';
import { parseIds } from './parse.js';

/* global window */

const utils = {};

export function toObject( entry ){
	const obj = {};
	var i = 0;

	if( !isArray( entry ) || entry.length < 1 ){
		return obj;

	}

	for( i; i < entry.length; i++ ){
		obj[i] = entry[i];

	}
	return obj;

}

export function getVideo( url, media ){
	const origin = url;
	var regex, tmp;

	switch( media ){
		case 'vimeo':
		case 'VIMEO':
		regex = /(https?)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/;
		tmp = regex.exec( url );

		if( isString( tmp[5] ) ){
			return tmp[5];

		}
		break;

		case 'youtube':
		case 'YOUTUBE':
		regex = /(>|<)/gi;
		url = url.replace( /(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

		if( isString( url[2] ) ){
			tmp = url[2].split(/[^0-9a-z\-_]/i);

			if( isString( tmp[0] ) ){
				return tmp[0];

			}
		}
		break;

	}
	return origin;

}

export function joinClasses( array ){
	var output = '';
	var i = 0;

	if( !isArray( array ) || array.length < 1 ){
		return '';

	}
	for( i; i < array.length; i++ ){

		if( !isClassName( array[i] ) ){
			continue;

		}
		output += array[i] + ' ';

	}
	return output.trim();

}

export function foreachItem( data, onitem ){
	var o = '';
	var ids, i;

	if( !isObject( data ) || !isObject( data.el ) || !isObject( data.items ) || !isFunction( onitem ) ){
		return false;

	}

	if( !isString( data.el._items ) || !isArray( ids = parseIds( data.el._items, 'array' ) ) || ids.length < 1 ){
		return false;

	}

	for( i = 0; i < ids.length; i++ ){

		if( !isObject( data.items[ids[i]] ) ){
			continue;

		}
		o += onitem( ids[i], data.items[ids[i]] );

	}
	return o;

}

/*export function getAllowedTags( tag ){
	const _a_ = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'caption' ];
	const _b_ = [ 'code', 'pre', 'blockquote' ];
	const _c_ = [ 'legend', 'label' ];
	const tags = '<br><sub><sup><span><b><strong><i><em><u><ins><del><a><strike>';

	if( _a_.indexOf( tag ) > -1 ){
		return tags;

	}

	if( _b_.indexOf( tag ) > -1 ){
		return tags + '<p><h1><h2><h3><h4><h5><h6><code><pre>';

	}

	if( _c_.indexOf( tag ) > -1 ){
		return '';

	}
	return tags + '<div><article><section><caption><img><figure><aside><svg><g><symbol>';

}*/