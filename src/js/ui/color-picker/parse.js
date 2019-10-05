import { convertHEX_HSB, convertRGB_HSB } from './convert.js';
import { isString, isNumber } from '../../utils/is.js';
import { strcolor } from './utils.js';

export function parseValue( x, min, max, dft, float ){

	if( isString( x ) || isNumber( x ) ){
		x = float ? parseFloat( x ) : parseInt( x );

		if( x >= min && x <= max ){
			return x;

		}

	}
	return dft;

}

export function parseColor( x ){
	var value = parseRGB( x );

	if( !value ){
		value = parseHEX( x );

		if( !value ){
			
			return {
				type: 'hex',
				value: '#FFFFFF',
				data: [ '#', 'FFFFFF' ],
				hsb: [ 0, 0, 1 ],
				alpha: 1

			};

		}

	}
	return value;

}

export function parseHEX( x ){
	const regex = /([0-9a-f]{6}|[0-9a-f]{3})/i;
	var match, value, last, a;

	if( !isString( x ) ){
		return false;

	}

	if( ( match = x.match( regex ) ) !== null && isString( match[1] ) ){
		value = match[1];

		if( value.length === 3 ){
			last = value.charAt(2);

			for( a = 0; a < 3; a++ ){
				value += last;

			}

		}

		return {
			type: 'hex',
			value: strcolor( 'hex', value ),
			data: [ '#', value ],
			hsb: convertHEX_HSB( value ),
			alpha: 1
		};

	}
	return false;

}

export function parseRGB( x ){
	const regex = /(rgba?)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0?\.\d*)|\d?)\s*)?\)/i;
	var match, type, r, g, b, a;

	if( !isString( x ) ){
		return false;

	}

	if( ( match = x.match( regex ) ) !== null && isString( match[1] ) && ( ( type = match[1].toLowerCase() ) === 'rgba' || type === 'rgb' ) ){

		r = parseValue( match[2], 0, 255, 0 );
		g = parseValue( match[3], 0, 255, 0 );
		b = parseValue( match[4], 0, 255, 0 );
		a = parseValue( match[6], 0, 1, 1, true );

		return {
			type,
			value: strcolor( type, [ r, g, b, a ] ),
			data: [ type, r, g, b, a ],
			hsb: convertRGB_HSB( [ r, g, b ] ),
			alpha: a
		};

	}
	return false;

}