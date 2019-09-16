import { ClassName } from '../../utils/className.js';

const CLASSNAME = ClassName( 'comet-page' ).modifier( 'fonts' );

const BASE = ClassName( CLASSNAME );

export default {
	header: BASE.element( 'header' ),
	hColumn: BASE.element( 'header__column' ),
	gauge: {
		main: BASE.element( 'gauge' ),
		slow: BASE.element( 'gauge--slow' ),
		moderate: BASE.element( 'gauge--moderate' ),
		fast: BASE.element( 'gauge--fast' )
	},
	counter: BASE.element( 'counter' ),
	button: BASE.element( 'new' ),
	tutorial: {
		main: BASE.element( 'tutorial' ),
		row: BASE.element( 'tutorial__row' ),
		column: BASE.element( 'tutorial__column' ),

	},
	list: BASE.element( 'list' ),
	item: {
		main: BASE.element( 'item' ),
		preview: BASE.element( 'item__preview' ),
		sample: BASE.element( 'item__sampletext' ),
		aside: BASE.element( 'item__aside' ),
		meta: BASE.element( 'item__meta' ),
		name: BASE.element( 'item__name' ),
		style: BASE.element( 'item__style' ),
		events: BASE.element( 'item__events' ),
		delete: BASE.element( 'item__delete' )
	},

};

