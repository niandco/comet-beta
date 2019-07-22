const DOCUMENT = document;

const WINDOW = window;

export function isNode( entry ){
	
	return isObject( entry ) && 'nodeType' in entry && ( entry.nodeType === Node.ELEMENT_NODE || entry.nodeType === 1 );

}

export function isNodeName( nodeNames, value, index ){
	var i;

	if( !isArray( nodeNames ) || nodeNames.length < 0 || !isString( value ) || ( i = nodeNames.indexOf( ( value.toLowerCase() ).trim() ) ) < 0 ){
		return false;

	}
	return ( isBool( index ) && index ? i : true );

}

export function isDocument( entry ){

	return entry === DOCUMENT;

}

export function isWindow( entry ){

	return entry === WINDOW;

}

export function isString( entry ){

	return typeof entry === 'string';

}

export function isObject( entry ){

	return typeof entry === 'object' && entry !== null;

}

export function isNumber( entry ){

	return typeof entry === 'number';

}

export function isBool( entry ){

	return typeof entry === 'boolean';

}

export function isFunction( entry ){

	return typeof entry === 'function';

}

export function isDefined( entry ){

	return typeof entry !== 'undefined';

}

export function isArray( entry ){

	return isObject( entry ) && 'length' in entry;

}

export function isEmpty( entry ){

	switch( entry ){

		case '':
		case 'undefined':
		case 'null':
		case 'NaN':
		case undefined:
		case NaN:
		case false:
		case null:
		return true;

		default:
		return !isDefined( entry ) || ( ( isArray( entry ) || isString( entry ) ) && entry.length < 1 );

	}

}

export function isTrueValue( value ){

	return ( isString( value ) && ( value.toLowerCase() ).trim() === 'true' );

}

export function isClassName( entry ){

	return isString( entry ) && entry.search( /(^[^a-z]|[^a-z0-9\-_])/gi ) < 0;

}