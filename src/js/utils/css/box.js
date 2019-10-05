import { isString, isArray, isEmpty, isNumber, isBool, isObject } from '../is.js';
import { sanitizeValueUnit, sanitizeColor, sanitizeNumber } from '../sanitize.js';
import { renderProperty, renderMuValues } from './render.js';
import { inArray } from '../fill.js';

const CORE = {

	isInset: function( value ){

		if( isString( value ) || isNumber( value ) || isBool( value ) ){
			value = ( ( value.toString() ).toLowerCase() ).trim();

		}
		return inArray( [ 'true', 'in', 'inset', '1' ], value );

	}

};

export function padding( top, right, bottom, left, vunit, hunit ){
	const MU = renderMuValues( top, right, bottom, left, vunit, hunit );
	return ( !isEmpty( MU ) ? renderProperty( 'padding', MU ) : '' );

}

export function margin( top, right, bottom, left, vunit, hunit ){
	const MU = renderMuValues( top, right, bottom, left, vunit, hunit );
	return ( !isEmpty( MU ) ? renderProperty( 'margin', MU ) : '' );
}

export function shadow( entry ){
	var w, o;

	if( !isObject( entry ) ){
		return '';

	}
	entry.blur = sanitizeNumber( { value: entry.blur, default: 0, min: 0 } );
	entry.spread = sanitizeNumber( { value: entry.spread, default: 0 } );
	entry.x = sanitizeNumber( { value: entry.x, default: 0 } );
	entry.y = sanitizeNumber( { value: entry.y, default: 0 } );

	if( ( entry.blur < 1 && entry.x === 0 && entry.y === 0 && entry.spread === 0 ) || ( entry.color = sanitizeColor( entry.color ) ) === '' ){
		return '';

	}
	w = sanitizeValueUnit( entry.x, 'px' );
	w += ' ' + sanitizeValueUnit( entry.y, 'px' );
	w += ' ' + sanitizeValueUnit( entry.blur, 'px' );
	w += ' ' + sanitizeValueUnit( entry.spread, 'px' );
	w += ' ' + entry.color;
	w += CORE.isInset( entry.inset ) ? ' inset' : '';

	o = renderProperty( 'box-shadow', w );
	o += renderProperty( '-moz-box-shadow', w );
	o += renderProperty( '-webkit-box-shadow', w );

	return o;

}