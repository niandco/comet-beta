import { isArray, isNumber, isString, isObject, isNode, isBool } from './is.js';
import { parseId, parseIds } from './parse.js';
import { inArray, stripTags } from './fill.js';

// @TODO: utils.toClass

/* global document */

const DOCUMENT = document;

export function sanitizeNumber( entry ){
	var value;

	if( entry === null || !isObject( entry ) ){
		entry = {
			value: entry
		};

	}

	if( entry.value !== null && ( isString( entry.value ) || isNumber( entry.value ) ) ){
		value = isBool( entry.float ) && entry.float ? parseFloat( entry.value ) : parseInt( entry.value );

		if( isNumber( entry.min ) && value < entry.min ){
			return entry.min;

		}

		if( isNumber( entry.max ) && value > entry.max ){
			return entry.max;

		}

		if( !isNaN( value ) ){		
			return value;
		}

	}
	return ( isNumber( entry.default ) ? parseFloat( entry.default ) : null );

}

export function sanitizeValueUnit( value, unit ){
	const auto = [ 'auto', 'aut' ];

	if( isString( value ) ){

		if( inArray( auto, ( value.toLowerCase() ).trim() ) ){
			return 'auto';

		}

	}
	unit = isString( unit ) ? sanitizeUnit( unit ) : '';
	value = sanitizeNumber( { value: value, float: ( unit !== 'px' ) } );

	return ( value === null || value === 0 ? '0' : value + unit );

}

export function sanitizeUnit( unit ){

	unit = isString( unit ) ? ( unit.toLowerCase() ).trim() : unit;

	switch( unit ){
		case 'px':
		case 'pixel':
		case 'pix':
		case 'pxl':
		case 'pixels':
		return 'px';

		case 'em':
		case 'mul':
		case 'mu':
		case '*':
		return 'em';

		case '%':
		case 'percent':
		case 100:
		case '100':
		return '%';

		case 'pt':
		case 'points':
		case 'point':
		case 'pts':
		return 'pt';

		case 'cm':
		case 'centimeter':
		case 'centimeters':
		return 'cm';

		case 'mm':
		case 'millimeter':
		case 'millimeters':
		return 'mm';

		case 'in':
		case 'inches':
		case 'inch':
		return 'in';
		
		default:
		return '';
	}

}

export function sanitizeValue( entry, def ){
	const typeE = typeof entry;
	const typeD = typeof def;
	var output = '';

	if( typeE === 'number' ){
		output = sanitizeNumber( entry );

	}else if( typeE === 'string' ){
		output = entry.trim();
	}

	if( output === '' && def !== null ){
		if( typeD === 'number' ){
			output = sanitizeNumber( def );

		}else if( typeD === 'string' ){
			output = def.trim();
		}
	}

	return output;

}

export function sanitizeColor( str ){
	const regex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))$/i;

	return isString( str ) && regex.test( str = str.trim() ) ? str : '';

}

export function sanitizeData( data, id ){
	const d = {};
	var ids, idsa, a;

	if( !isObject( data )  || !isObject( data.elements ) || !( id = parseId( id ) ) || !isObject( data.elements[id] ) ){
		return d;

	}
	d.el = data.elements[id];

	if( isString( d.el._items ) && isObject( data.items ) && isArray( ids = parseIds( d.el._items, 'array' ) ) && ids.length > 0 ){
		d.items = {};

		for( a = 0; a < ids.length; a++ ){

			if( !( idsa = parseId( ids[a] ) ) || !isObject( data.items[idsa] ) ){
				continue;

			}
			d.items[idsa] = data.items[idsa];

		}

	}
	return d;

}

export function sanitizeContent(){
	const elements = DOCUMENT.getElementsByClassName( 'cpb-elementContent' );
	const __core = {

		map: {
			"'": '&#39;',
		},

		callback: function( m ){
			return __core.map[m];

		}

	};
	var o, e;

	if( elements.length < 1 ){
		return '';

	}
	o = '';

	for( e in elements ){

		if( !isNode( elements[e] ) ){
			continue;

		}
		o += stripTags( elements[e].innerHTML, '<br><img><p><a><u><strike><b><strong><i><ins><del><hr><caption><span><h1><h2><h3><h4><h5><h6><video><audio>' );

	}
	return o.replace(/[']/g, __core.callback );

}

export function sanitizePost( str ){
	const allowed = '<br><img><p><a><u><strike><b><strong><i><ins><del><hr><caption><span><h1><h2><h3><h4><h5><h6><sub><sup><title>';

	return ( isString( str ) ? stripTags( str, allowed ) : '' );

}

/*export function sanitizeClass( str, prefix ){

	return ( utils.toClass( isString( prefix ) ? prefix : '' ) + utils.toClass( str ) );

}*/

export function sanitizeAlignment( entry ){
	const c = 'cpb-align';
	entry = isString( entry ) ? ( entry.toLowerCase() ).trim() : entry;

	switch( entry ){
		case 'l':
		case 'left':
		case '<':
		return c + 'left';

		case 'r':
		case 'right':
		case '>':
		return c + 'right';

		case 'j':
		case 'justify':
		case '=':
		return c + 'justify';

		case 'm':
		case 'middle':
		return c + 'middle';

		case 't':
		case 'top':
		case '^':
		return c + 'top';

		case 'b':
		case 'bottom':
		case 'v':
		return c + 'bottom';

		default:
		return c + 'center';
	}

}