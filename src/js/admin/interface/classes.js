import { ClassName } from '../../utils/className.js';

const DEFAULT = 'comet-dashboard'; 

export const __default = ClassName( DEFAULT );

export const __class = {
	default: DEFAULT,

	header: {
		default: __default.element( 'header' ),
		column: __default.element( 'header__column' ),
		item: __default.element( 'header__item' )
	},

	main: __default.element( 'main' ),

	content: __default.element( 'content' ),

	sidebar: {
		default: __default.element( 'sidebar' ),
		toggle: __default.element( 'sidebar__toggle' ),
		menu: __default.element( 'sidebar__menu' ),
		item: __default.element( 'sidebar__menu__item' ),
		url: __default.element( 'sidebar__menu__item__url' ),
		cards: __default.element( 'sidebar__cards' ),
		card: __default.element( 'sidebar__card' ),


	},

	tooltip: {
		default: __default.element( 'tooltip' ),
		main: __default.element( 'tooltip__main' ),
		title: __default.element( 'tooltip__title' ),
		content: __default.element( 'tooltip__content' ),
		buttonset: __default.element( 'tooltip__buttonset'),
		button: __default.element( 'tooltip__button'),
	}

};