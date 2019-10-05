import { isArray, isObject, isBool, isDefined, isNode } from '../../utils/is.js';
import { arrayMax, i18n_n } from '../../utils/fill.js';

const DOCUMENT = document;

const CORE = {

	collection: [],
	ui: {
		import: null,
		counter: null,
		list: null,

	}

};

export default class Templates {

	reset (){
		CORE.collection = [];
		CORE.ui.import = null;
		CORE.ui.counter = null;
		CORE.ui.list = null;

	}

	count(){
		return !isArray( CORE.collection ) ? 0 : CORE.collection.filter(String).length;

	}

	hasTemplates(){
		return this.count() > 0;

	}

	setTemplates( entry ){
		CORE.collection = !isArray( entry ) ? [] : entry;
		return this.getTemplates();

	}

	getTemplates(){
		return this.hasTemplates() ? CORE.collection : false;

	}

	setTemplate( index, args, force ){
		force = isBool( force ) ? force : false;

		if( !this.hasTemplates() ){
			CORE.collection = [];

		}

		if( !isObject( args ) ){
			return false;

		}

		if( index < 0 ){
			index = arrayMax( CORE.collection ) + 1;


		}

		if( !isDefined( CORE.collection[index] ) || force ){
			CORE.collection[index] = args;

		}
		return index;

	}

	getTemplate( index ){
		return !this.hasTemplates() || !isObject( CORE.collection[index] ) ? false : CORE.collection[index];

	}

	unsetTemplate( index ){

		if( !this.getTemplate( index ) ){
			return false;

		}
		delete CORE.collection[index];
		return true;

	}

	setUi( slug, node ){

		if( !isNode( node ) || !( slug in CORE.ui ) || CORE.ui[slug] !== null ){
			return false;

		}
		CORE.ui[slug] = node;
		return node;

	}

	getUi( slug ){

		return !isNode( CORE.ui[slug] ) ? false : CORE.ui[slug];

	}

	setCounter(){
		CORE.ui.counter.innerHTML = i18n_n( __cometi18n.ui.template.template, __cometi18n.ui.template.templates, this.count() );

	}

	appendTemplate( index, ui ){
		const data = this.getTemplate( index );
		const body = this.getUi( 'list' );

		if( !isObject( data ) || !body ){
			return false;

		}
		data.ui = ui;
		body.appendChild( data.ui );
		return true;

	}

}