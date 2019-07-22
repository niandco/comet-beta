import { isString, isEmpty, isArray, isObject } from '../is.js';
import { sanitizeNumber, sanitizeColor } from '../sanitize.js';
import { inArray } from '../fill.js';

const CORE = {

	sanitizeAngle: function( value ){
		value = sanitizeNumber( { value, min: 0, max: 360, default: 0 } );

		switch( value ){
			case 0:
			case 360:
			return 'to top';

			case 180:
			return 'to bottom';

			case 270:
			return 'to left';

			case 90:
			return 'to right';

			case 45:
			return 'to top right';

			case 135:
			return 'to bottom right';

			case 225:
			return 'to bottom left';

			case 315:
			return 'to top left';

			default:
			return angle + 'deg';

		}

	}

};

export function encode( colors ){
	var color, a, c, o, p;

	if( !isArray( colors ) || colors.length < 2 ){
		return '';

	}
	o = '';

	for( a = 0; a < colors.length; a++ ){

		if( !isObject( color = colors[a] ) || !( 'color' in color ) || !( c  = sanitizeColor( color.color ) ) ){
			continue;

		}
		p = sanitizeNumber( { value: color.stop, min: 0, max: 100, default: 0, float: true } );
		o += ( o.length > 0 ? '+' : '' ) + p + 'z' + c;
		
	}
	return o;

}

export function decode( str ){
	const d1 = '+';
	const d2 = 'z';
	const o = [];
	var a, depth1, depth2, crt, c;

	if( !isString( str ) || isEmpty( str ) || !isArray( depth1 = ( str = str.trim() ).split( d1 ) ) || depth1.length < 2 ){
		return false;

	}

	for( a = 0; a < depth1.length; a++ ){

		if( !isString( crt = depth1[a] ) || isEmpty( crt ) || !isArray( depth2 = ( crt = crt.trim() ).split( d2 ) ) || depth2.length < 2 || !( c = sanitizeColor( depth2[1] ) ) ){
			continue;

		}
		o[o.length] = {
			stop: sanitizeNumber( { value: depth2[0], min: 0, max: 100, default: 0, float: true } ),
			color: c
		};

	}
	return o;

}

export function gradient( style, angle, colors ){
	var c, color, g;

	if( !isString( colors ) || isEmpty( colors ) || !isArray( colors = decode( colors ) ) || colors.length < 2 ){
		return '';

	}

	if( style === 'radial' ){
		angle = isString( angle ) && inArray( [ 'side', 's', 'sd' ], angle.trim() ) ? 'side' : 'corner';
		g = 'radial-gradient( farthest-' + angle;

	}else{
		angle = CORE.sanitizeAngle( angle );
		g = 'linear-gradient(' + angle;

	}
	colors.sort(function (a, b){ return a.stop - b.stop; });

	for( c = 0; c < colors.length; c++ ){
		color = colors[c];

		if( !( 'color' in color ) || !( 'stop' in color ) || isNaN( color.stop ) ){
			continue;

		}
		g += ',' + color.color + ' ' + color.stop + '%';

	}
	g += ')';
	return g;

}