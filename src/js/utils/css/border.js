import { sanitizeValueUnit, sanitizeColor, sanitizeNumber } from '../sanitize.js';
import { renderProperty, renderMuValues } from './render.js';
import { isObject, isString, isEmpty } from '../is.js';

const CORE = {

	sanitizeBorderStyle: function( value ){

		if( !isString( value ) ){
			return 'none';

		}

		switch( ( value.toLowerCase() ).trim() ){
			case 's':
			case 'sld':
			case 'solid':
			return 'solid';

			case 'dot':
			case 'dtd':
			case 'dotted':
			return 'dotted';

			case 'das':
			case 'dhd':
			case 'dashed':
			return 'dashed';

			case 'dbe':
			case 'dble':
			case 'double':
			return 'double';

			case 'in':
			case 'ins':
			case 'inner':
			case 'inset':
			return 'inset';

			case 'ou':
			case 'out':
			case 'outset':
			case 'outside':
			return 'outset';

			default:
			return 'none';

		}

	}

};


export function border( entry ){
	const numb = { value: 0, min: 0, default: 0 };
	var t, r, b , l, x, y, o, w;

	if( !isObject( entry ) || ( entry.style = CORE.sanitizeBorderStyle( entry.style ) ) === 'none' || ( entry.color = sanitizeColor( entry.color ) ) === '' ){
		return '';

	}
	t = r = b = l = 0;
	x = y = null;

	numb.value = entry.top;
	t = sanitizeNumber( numb );

	numb.value = entry.right;
	r = sanitizeNumber( numb );

	numb.value = entry.bottom;
	b = sanitizeNumber( numb );

	numb.value = entry.left;
	l = sanitizeNumber( numb );

	if( t === b ){
		y = t;

	}

	if( r === l ){
		x = r;

	}

	if( x !== null && y !== null ){

		if( x === y ){

			if( x === 0 ){
				return '';

			}
			o = sanitizeValueUnit( y, 'px' );
			o += ' ' + entry.style;
			o += ' ' + entry.color;
			return renderProperty( 'border', o );

		}
		o = renderProperty( 'border-width', sanitizeValueUnit( y, 'px' ) + ' ' + sanitizeValueUnit( x, 'px' ) );
		o += renderProperty( 'border-style', entry.style );
		o += renderProperty( 'border-color', entry.color );
		return o;

	}

	w = sanitizeValueUnit( t, 'px' );
	w += ' ' + sanitizeValueUnit( r, 'px' );
	w += ' ' + sanitizeValueUnit( b, 'px' );

	if( x === null ){
		w += ' ' + sanitizeValueUnit( l, 'px' );

	}

	o = renderProperty( 'border-width', w );
	o += renderProperty( 'border-style', entry.style );
	o += renderProperty( 'border-color', entry.color );
	return o;

}

export function borderWidth( top, right, bottom, left ){
	const MU = renderMuValues( top, right, bottom, left, 'px', 'px' );
	return ( !isEmpty( MU ) ? renderProperty( 'border-width', MU ) : '' );
}

export function borderRadius( top, right, bottom, left ){
	const MU = renderMuValues( top, right, bottom, left, 'px', 'px' );
	var o;

	if( !isEmpty( MU ) ){
		o = renderProperty( 'border-radius', MU );
		o += renderProperty( '-webkit-border-radius', MU );
		o += renderProperty( '-moz-border-radius', MU );
		return o;

	}
	return '';

}