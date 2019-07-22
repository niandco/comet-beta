import { isString, isArray, isNode } from '../../utils/is.js';

export function round( x ){

	return Math.round( x );

}

export function strcolor( type, x ){

	switch( type ){
		case '#':
		case 'hex':
		return isString( x ) ? ( x.charAt(0) !== '#' ? '#' + x : x ) : '';

		case 'rgb':
		return isArray( x, 3 ) && x.length > 2 ? 'rgb(' + x[0] + ',' + x[1] + ',' + x[2] + ')' : '';

		case 'rgba':
		return isArray( x, 4 ) && x.length > 3 ? 'rgba(' + x[0] + ',' + x[1] + ',' + x[2] + ',' + x[3] + ')' : '';

		case 'hsl':
		return isArray( x, 3 ) && x.length > 2 ? 'hsl(' + x[0] + ',' + x[1] + ',' + x[2] + ')' : '';

		case 'hsla':
		return isArray( x, 4 ) && x.length > 3 ? 'hsla(' + x[0] + ',' + x[1] + ',' + x[2] + ',' + x[3] + ')' : '';

		default:
		return '';

	}

}

export function isPicker( currentNode, checkAgainst ){

	if( !isNode( currentNode ) || !isNode( checkAgainst ) ){
		return false;

	}
	return checkAgainst !== currentNode ? isPicker( currentNode.parentNode, checkAgainst ) : currentNode;

}