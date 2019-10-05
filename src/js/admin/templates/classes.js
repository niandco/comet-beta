import { ClassName } from '../../utils/className.js';
import { __default } from '../interface/classes.js';

const elt = __default.modifier( 'mytemplates' );

export const __elt = ClassName( elt );

export const __class = {
	header: __elt.element( 'header' ),
	hColumn: __elt.element( 'header__column' ),
	counter: __elt.element( 'counter' ),
	button: __elt.element( 'new' ),
	import: {
		main: __elt.element( 'import' ),
		files: __elt.element( 'import__files' ),
		select: __elt.element( 'import__select' ),

	},
	list: __elt.element( 'list' ),
	item: {
		main: __elt.element( 'item' ),
		events: __elt.element( 'item__events' ),
		event: __elt.element( 'item__event' ),
		meta: __elt.element( 'item__meta' ),
		title: __elt.element( 'item__title' ),
		date: __elt.element( 'item__date' ),
	},

};