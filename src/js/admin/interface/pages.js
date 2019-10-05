import { isFunction } from '../../utils/is.js';
import mytemplates from '../templates/index.js';
import settings from '../settings/index.js';
import myfonts from '../fonts/index.js';
import home from '../home/index.js';


export default class Pages {

	constructor(){

		this.pages = {
			home,
			settings,
			myfonts,
			mytemplates

		};

	}

	pageExists ( slug ){
		return this.pages.hasOwnProperty( slug );

	}

	getPage ( slug, data ){
		var Page;

		if( !this.pageExists( slug ) || !isFunction( this.pages[slug] ) ){
			return false;

		}

		if( !( Page = new this.pages[slug]( data ) ) || !( 'render' in Page ) ){
			return false;

		}
		return Page.render();

	}

}