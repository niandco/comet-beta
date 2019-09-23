import { ClassName } from '../../utils/className.js';

const CLASSNAME = ClassName( 'comet-page' ).modifier( 'mytemplates' );

const BASE = ClassName( CLASSNAME );

export default {
	header: BASE.element( 'header' ),
	hColumn: BASE.element( 'header__column' ),
	counter: BASE.element( 'counter' ),
	button: BASE.element( 'new' ),
	import: {
		main: BASE.element( 'import' ),
		files: BASE.element( 'import__files' ),
		select: BASE.element( 'import__select' ),

	},
	list: BASE.element( 'list' ),
	item: {
		main: BASE.element( 'item' ),
		events: BASE.element( 'item__events' ),
		edit: BASE.element( 'item__edit' ),
		preview: BASE.element( 'item__preview' ),
		export: BASE.element( 'item__export' ),
		delete: BASE.element( 'item__delete' ),
		meta: BASE.element( 'item__meta' ),
		desc: BASE.element( 'item__desc' ),
		name: BASE.element( 'item__name' ),
		author: BASE.element( 'item__author' ),
		date: BASE.element( 'item__date' ),
	},

};