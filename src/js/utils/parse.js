import { isString, isNode, isObject, isBool, isNumber, isArray } from './is.js';
import { inArray } from './fill.js';

/* global document */

const DOCUMENT = document;

export function parseDataset( ui, match ){
	var value = false;

	if( !isNode( ui ) || !isString( match ) ){
		return false;

	}

	if( !isObject( ui.dataset ) || !( ( match = match.trim() ) in ui.dataset ) ){
		return false;

	}
	value = ui.dataset[match];

	return isNumber( value ) || isString( value ) || isBool( value ) ? ui.dataset[match] : false;

}

export function parseType( type ){
	const types = [ 'sections', 'rows', 'columns', 'elements', 'items' ];

	return ( isString( type ) && inArray( types, ( type = ( type.trim() ).toLowerCase() ) ) ? type : false );

}

export function parseId( id ){
	return ( isNumber( id = parseInt( id ) ) && !isNaN( id ) ? id : false );

}

export function parseStyle( s_id ){
	const s = isString( s_id ) ? DOCUMENT.getElementById( s_id.trim() ) : false;

	return ( isNode( s ) && s.nodeName.toLowerCase() === 'style' ? s : false );

}

export function parseHtml( str ){
	var s;

	if( !isString( str ) ){
		return false;

	}
	s = DOCUMENT.createElement( 'div' );
	s.innerHTML = str;

	return s.children;

}

export function parseIds( str, type ){
	var ids, a, id, nids, n;

	if( !isString( str ) || !isArray( ids = str.split( ',' ) ) || ids.length < 1 ){
		return false;

	}
	nids = type === 'array' ? [] : {};
	n = 0;

	for( a = 0; a < ids.length; a++ ){

		if( !( id = parseId( ids[a] ) ) ){
			continue;

		}

		if( type === 'array' ){
			nids.push( id );
			continue;

		}
		nids[id] = id;
		n++;
		nids.length = n;

	}
	return !nids.length ? false : nids;

}

export function parseJson( str ){
	var j;

	try {
		j = JSON.parse( str );

	} catch( e ){
		return false;

	}
	return j;

}
