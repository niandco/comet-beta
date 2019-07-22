import { sanitizeUnit, sanitizeNumber, sanitizeValueUnit } from '../sanitize.js';
import { isString, isNumber, isEmpty } from '../is.js';
import { inArray, xtrim } from '../fill.js';

const CORE = {

	sanitizeAuto: function( entry ){
		const auto = [ 'auto', 'AUTO', 'aut', 'AUT' ];

		return ( isString( entry ) && inArray( auto, entry.trim() ) ? 'auto' : false );

	},

	sanitizeValue: function( entry ){

		return ( !CORE.sanitizeAuto( entry ) ? sanitizeNumber({ value: entry }) : 'auto' );

	}

};

export function renderMuValues( top, right, bottom, left, vunit, hunit ){
	var x = false;
	var y = false;
	var o;
	top = CORE.sanitizeValue( top );
	right = CORE.sanitizeValue( right );
	bottom = CORE.sanitizeValue( bottom );
	left = CORE.sanitizeValue( left );
	vunit = sanitizeUnit( vunit );
	hunit = sanitizeUnit( hunit );

	if( top === bottom ){
		y = top;

	}

	if( left === right ){
		x = left;

	}

	if( x === null ){
		x = 0;

	}

	if( y === null ){
		y = 0;

	}

	if( y === false ){
		top = top === null ? 0 : top;
		bottom = bottom === null ? 0 : bottom;

		if( top === bottom ){
			y = top;

		}

	}

	if( x === false ){
		right = right === null ? 0 : right;
		left = left === null ? 0 : left;

		if( right === left ){
			x = right;

		}

	}

	if( y === false || x ===  false ){
		o = sanitizeValueUnit( top, vunit );
		o += ' ';
		o += sanitizeValueUnit( right, hunit );
		o += ' ';
		o += sanitizeValueUnit( bottom, vunit );

		if( x === false ){
			o += ' ';
			o += sanitizeValueUnit( left, hunit );
		}

		return o;

	}

	if( y === x ){

		if( y === 0 ){
			return 0;

		}

		if( vunit === hunit ){
			return sanitizeValueUnit( y, vunit );

		}

	}
	o = sanitizeValueUnit( y, vunit );
	o += ' ';
	o += sanitizeValueUnit( x, hunit );
	return o;

}

export function renderRuleset( target, properties, device ){
	const devices = [ 'mobile', 'm', 'M', 'tablet', 't', 'T', 'TABLET' ];
	const index = isString( device ) ? devices.indexOf( device ) : -1;
	var classe;

	if( !isString( target ) || !isString( properties ) ){
		return '';

	}
	classe = ( index > -1 ? ( '.cpb-devicetype-' + ( index <= 2 ? 'mobile' : 'tablet' ) + ' ' ) : '' );
	classe += isString( target ) ? ' ' + target.trim() : '';

	return classe + '{' + properties.trim() + '}';

}

export function renderProperty( property, value ){

	if( !isString( property ) || isEmpty( property ) || ( !isNumber( value ) && ( !isString( value ) || isEmpty( value ) ) ) ){
		return '';

	}
	return xtrim( property, ':' ) + ':' + xtrim( value, ';' ) + ';';
	
}