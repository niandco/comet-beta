import { sanitizeValueUnit, sanitizeColor, sanitizeNumber } from '../sanitize.js';
import { renderProperty } from './render.js';
import { isObject } from '../is.js';

export function shadow( entry ){
	var w;

	if( !isObject( entry ) ){
		return '';

	}
	entry.blur = sanitizeNumber( { value: entry.blur, default: 0, min: 0 } );
	entry.x = sanitizeNumber( { value: entry.x, default: 0 } );
	entry.y = sanitizeNumber( { value: entry.y, default: 0 } );

	if( ( entry.blur < 1 && entry.x === 0 && entry.y === 0 ) || ( entry.color = sanitizeColor( entry.color ) ) === '' ){
		return '';

	}
	w = sanitizeValueUnit( entry.x, 'px' );
	w += ' ' + sanitizeValueUnit( entry.y, 'px' );
	w += ' ' + sanitizeValueUnit( entry.blur, 'px' );
	w += ' ' + entry.color;

	return renderProperty( 'text-shadow', w );

}