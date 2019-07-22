import { isString, isArray } from '../../utils/is.js';
import { round } from './utils.js';

export function convertHEX_RGB( x ){

	if( !isString( x ) || x.length !== 6 ){
		return null;

	}

	return [
	parseInt( x.substring( 0, 2 ), 16 ),
	parseInt( x.substring( 2, 4 ), 16 ),
	parseInt( x.substring( 4, 6 ), 16 )
	];

}

export function convertRGB_HEX( x ){
	var s;

	if( !isArray( x ) || x.length < 3 ){
		return '';

	}
	s = +x[2] | ( +x[1] << 8 ) | ( +x[0] << 16 );
	s = '000000' + s.toString( 16 );
	return s.slice( -6 );

}

export function convertRGB_HSB( x ){
	const r = +x[0];
	const g = +x[1];
	const b = +x[2];
	const max = Math.max( r, g, b );
	const min = Math.min( r, g, b );
	const d = max - min;
	const s = ( max === 0 ? 0 : d / max );
	const v = max / 255;
	var h;

	switch ( max ){
		case min:
		h = 0;
		break;

		case r:
		h = ( g - b ) + d * ( g < b ? 6 : 0 );
		h /= 6 * d;
		break;

		case g:
		h = ( b - r ) + d * 2;
		h /= 6 * d;
		break;

		case b:
		h = ( r - g ) + d * 4;
		h /= 6 * d;
		break;

	}
	return [h, s, v];

}

export function convertHSB_RGB( x ){
	var r, g, b;
	const h = +x[0];
	const s = +x[1];
	const v = +x[2];
	var i = Math.floor( h * 6 );
	const f = h * 6 - i;
	const p = v * ( 1 - s );
	var q = v * ( 1 - f * s );
	var t = v * ( 1 - ( 1 - f ) * s );

	r = g = b = 0;

	i = i || 0;
	q = q || 0;
	t = t || 0;

	switch ( i % 6 ){
		case 0:
		r = v, g = t, b = p;
		break;

		case 1:
		r = q, g = v, b = p;
		break;

		case 2:
		r = p, g = v, b = t;
		break;

		case 3:
		r = p, g = q, b = v;
		break;

		case 4:
		r = t, g = p, b = v;
		break;

		case 5:
		r = v, g = p, b = q;
		break;

	}
	return [ round(r * 255), round(g * 255), round(b * 255) ];

}

export function convertHEX_HSB( x ){
	return convertRGB_HSB( convertHEX_RGB( x ) );

}

export function convertHSB_HEX( x ){
	return convertRGB_HEX( convertHSB_RGB( x ) );

}