import { ClassName } from '../../utils/className.js';
import { __default } from '../interface/classes.js';

const elt = __default.modifier( 'home' );

export const __elt = ClassName( elt );

export const __class = {
	content: __elt.element( 'content' ),
	column: __elt.element( 'column' ),
	widget: __default.element( 'widget' ),

};