import { isString, isEmpty, isObject } from '../is.js';
import { gradient as Gradient } from './gradient.js';
import { sanitizeColor } from '../sanitize.js';
import { renderProperty } from './render.js';

const CORE = {

	sanitizePosition: function( value ){

		if( !isString( value ) ){
			return 'center center';

		}

		switch( ( value.toLowerCase() ).trim() ){

			case 'lt':
			case 'leftop':
			case 'lefttop':
			case 'leftTop':
			return 'left top';

			case 'lc':
			case 'leftcenter':
			case 'leftCenter':
			return 'left center';

			case 'lb':
			case 'leftbottom':
			case 'leftBottom':
			return 'left bottom';

			case 'rt':
			case 'rightop':
			case 'righttop':
			case 'rightTop':
			return 'right top';

			case 'rc':
			case 'rightcenter':
			case 'rightCenter':
			return 'right center';

			case 'rb':
			case 'rightbottom':
			case 'rightBottom':
			return 'right bottom';

			case 'ct':
			case 'centertop':
			case 'centerTop':
			return 'center top';

			case 'cb':
			case 'centerbottom':
			case 'centerBottom':
			return 'center bottom';

			default:
			return 'center center';

		}

	},

	sanitizeRepeat: function( value ){

		if( !isString( value ) ){
			return 'repeat';

		}

		switch( ( value.toLowerCase() ).trim() ){
			case 'no':
			case 'nr':
			case 'no-repeat':
			case 'norepeat':
			case 'norep':
			return 'no-repeat';

			case 'x':
			case 'repeat-x':
			case 'repeatx':
			case 'repx':
			case 'rx':
			return 'repeat-x';

			case 'y':
			case 'repeat-y':
			case 'repeaty':
			case 'repy':
			case 'ry':
			return 'repeat-y';

			case 's':
			case 'space':
			case 'sp':
			return 'space';

			case 'rd':
			case 'round':
			return 'round';

			default:
			return 'repeat';

		}

	},

	sanitizeSize: function( value ){

		if( !isString( value ) ){
			return 'auto';

		}

		switch( ( value.toLowerCase() ).trim() ){

			case 'con':
			case 'contain':
			case 'container':
			return 'contain';

			case 'cov':
			case 'cover':
			return 'cover';

			default:
			return 'auto';

		}

	},

	sanitizeAttachment: function( value ){

		if( !isString( value ) ){
			return 'scroll';

		}

		switch( ( value.toLowerCase() ).trim() ){

			case 'fix':
			case 'fixed':
			return 'fixed';

			default:
			return 'scroll';

		}

	}

};

export function background( entry ){
	var _grad, image, color, o, og, ou, tmp;

	if( !isObject( entry ) ){
		return '';

	}
	_grad = image = color = false;
	o = og = ou = '';
	color = ( isString( entry.type ) && ( entry.type.trim() ).toLowerCase() === 'color' );

	if( !color && isObject( entry.gradient ) && 'type' in entry.gradient && 'gradient' in entry.gradient && 'angle' in entry.gradient ){
		og = Gradient( entry.gradient.type, entry.gradient.angle, entry.gradient.gradient );
		_grad = !isEmpty( og );

	}

	if( !isEmpty( tmp = sanitizeColor( entry.color ) ) && color ){
		o += tmp;

	}

	if( isString( entry.url ) && !isEmpty( entry.url ) ){
		image = true;
		ou = 'url(' + entry.url.trim() + ')';

	}

	if( _grad ){
		o += renderProperty( 'background-image', ou + ( image ? ', ' : ' ' ) + og );

	}else if( !_grad && image ){

		o += ' ' + ou;
	}

	if( 'repeat' in entry && image ){
		tmp = CORE.sanitizeRepeat( entry.repeat );
		o += !_grad ? ' ' + tmp : renderProperty( 'background-repeat', tmp );

	}

	if( 'position' in entry && image ){
		tmp = CORE.sanitizePosition( entry.position );
		o += !_grad ? ' ' + tmp : renderProperty( 'background-position', tmp );

	}

	if( !_grad ){
		o = renderProperty( 'background', o.trim() );
	}

	if( 'att' in entry && image ){
		o += renderProperty( 'background-attachment', CORE.sanitizeAttachment( entry.att ) );
	}

	if( 'size' in entry && image ){
		o += renderProperty( 'background-size', CORE.sanitizeSize( entry.size ) );

	}

	return o;

}