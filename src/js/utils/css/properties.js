import { isString, isEmpty, isNumber } from '../is.js';
import { renderRuleset } from './render.js';

export { renderRuleset as ruleset, renderProperty as property } from './render.js';

export { background } from './background.js';

export { border, borderRadius, borderWidth } from './border.js';

export { shadow as boxShadow, margin, padding } from './box.js';

export { gradient } from './gradient.js';

export { shadow as textShadow } from './text.js';

export function responsive( device, css ){
	const devices = [ 'mobile', 'm', 'M', 'tablet', 't', 'T', 'TABLET' ];
	var index;

	if( !isString( css ) || isEmpty( css ) || ( index = devices.indexOf( device ) ) < 0 ){
		return '';

	}
	return '@media only screen and (max-width:' + ( index <= 2 ? 400 : 800 ) + 'px){' + css + '}';

}

export function element( id, target, css, device ){
	var classe;

	if( !isNumber( id ) ){
		return '';

	}
	classe = '.cpb-element.cpb-elementNode' + id;
	classe += isString( target ) ? ' ' + target.trim() : '';

	return renderRuleset( classe, css, device );

}