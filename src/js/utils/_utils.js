import __global from './global.js';
import parse from './parse.js';

/* global window */

const utils = {};

utils.toObject = function( entry ){
	const obj = {};
	var i = 0;

	if( !utils.isArray( entry, 1 ) ){
		return obj;

	}

	for( i; i < entry.length; i++ ){
		obj[i] = entry[i];

	}
	return obj;

};

utils.getVideo = function( url, media ){
	const origin = url;
	var regex, tmp;

	switch( media ){
		case 'vimeo':
		case 'VIMEO':
		regex = /(https?)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/;
		tmp = regex.exec( url );

		if( utils.isString( tmp[5] ) ){
			return tmp[5];

		}
		break;

		case 'youtube':
		case 'YOUTUBE':
		regex = /(>|<)/gi;
		url = url.replace( /(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

		if( utils.isString( url[2] ) ){
			tmp = url[2].split(/[^0-9a-z\-_]/i);

			if( utils.isString( tmp[0] ) ){
				return tmp[0];

			}
		}
		break;

	}
	return origin;

};

utils.toClass = function( entry ){
	var o = '';
	var e;

	if( utils.isString( entry ) ){
		return entry.replace( /^[^a-z\-_]*/gi, '' ).replace( /[^a-z0-9\-_]*/gi, '' );

	}

	if( utils.isArray( entry, 1 ) ){

		for( e in entry ){
			o += utils.toClass( entry[e] ) + ' ';

		}
		return utils.trim( o );

	}

	return '';

};

utils.foreachItem = function( data, onitem ){
	var o = '';
	var ids, i;

	if( !utils.isObject( data ) || !utils.isObject( data.el ) || !utils.isObject( data.items ) || !utils.isFunction( onitem ) ){
		return false;

	}

	if( utils.isStringEmpty( data.el._items ) || !utils.isArray( ( ids = parse.ids( data.el._items, 'array' ) ), 1 ) ){
		return false;

	}

	for( i = 0; i < ids.length; i++ ){

		if( !utils.isObject( data.items[ids[i]] ) ){
			continue;

		}
		o += onitem( ids[i], data.items[ids[i]] );

	}
	return o;

};

utils.getAllowedTags = function( tag ){
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

};

export default utils;