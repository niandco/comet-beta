
const DOCUMENT = document;

const CORE = {

	collection: [],
	ui: {
		files: null,
		import: null,
		counter: null,
		list: null,

	},


};

export default class Templates {

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

	setCounter(){
		const c = this.count();
		CORE.ui.counter.innerHTML = c + ( c === 1 ? ' template' : ' templates' ); // TRANSLATE

	}

}