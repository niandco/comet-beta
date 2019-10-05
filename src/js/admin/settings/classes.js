import { ClassName } from '../../utils/className.js';
import { __default } from '../interface/classes.js';

const elt = __default.modifier( 'settings' );

export const __elt = ClassName( elt );

export const __class = {
	section: __elt.element( 'section' ),
	meta: {
		wrap: __elt.element( 'meta' ),
		title: __elt.element( 'meta__title' ),
		desc: __elt.element( 'meta__desc' )
	},
	controls: __elt.element( 'controls' ),
	control: {
		wrap: __elt.element( 'control' ),
		label: __elt.element( 'control__label' ),
		desc: __elt.element( 'control__desc' ),
		field: __elt.element( 'field' ),
	},
	submit: __elt.element( 'submit' ),

};