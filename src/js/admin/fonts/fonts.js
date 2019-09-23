import { isBool, isNode, isArray, isObject, isDefined, isString } from '../../utils/is.js';
import { inArray, arrayMax } from '../../utils/fill.js';
import node from '../../dom/element.js';
import __F from './fonts-private.js';
import CLASSES from './classes.js';

const DOCUMENT = document;

const CORE = {
	collection: [],
	counter: false,
	loadInfo: false,
	frame: null,
	fontsBox: null,
	modal: false,
	isImporting: false,
	isDeleting: false
};

export default class Fonts {

	setFrameUiOnce( entry ){
		return __F( CORE ).setDefault( 'frame', entry );

	}

	setCounterUiOnce( entry ){
		return __F( CORE ).setDefault( 'counter', entry );

	}

	setLoadInfoUiOnce( entry ){
		return __F( CORE ).setDefault( 'loadInfo', entry );

	}

	setFontsBoxUiOnce( entry ){
		return __F( CORE ).setDefault( 'fontsBox', entry );

	}

	emptyFontsBox(){
		CORE.fontsBox.innerHTML = '';

	}

	appendToFontsBox( entry ){
		CORE.fontsBox.appendChild( entry );

	}

	hasFonts(){
		return this.count() > 0;

	}

	getFonts(){
		return this.hasFonts() ? CORE.collection : false;

	}

	setFonts( entry ){
		CORE.collection = !isArray( entry ) ? [] : entry;
		return this.getFonts();

	}

	getFont( index ){
		return !this.hasFonts() || !isObject( CORE.collection[index] ) ? false : CORE.collection[index];

	}

	/* id, name */
	getFontBy( entry, value ){
		var a;

		if( !this.hasFonts() ){
			return false;
		}

		if( !isString( entry ) || !inArray( [ 'name', 'id' ], ( entry = ( entry.toLowerCase() ).trim() ) ) ){
			return false;

		}

		for( a = 0; a < CORE.collection.length; a++ ){

			if( !isObject( CORE.collection[a] ) ){
				continue;

			}

			if( entry === 'id' ){

				if( value === CORE.collection[a].id ){
					return {
						index: a,
						data: CORE.collection[a]
					};

				}
				continue;

			}

			if( value === CORE.collection[a].family ){
				return {
					index: a,
					data: CORE.collection[a]
				};

			}

		}
		return false;


	}

	setFont( index, args, force ){
		force = isBool( force ) ? force : false;

		if( !this.hasFonts() ){
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

	unsetFont( index ){

		if( !this.getFont( index ) ){
			return false;

		}
		delete CORE.collection[index];
		return true;

	}

	count(){
		return !isArray( CORE.collection ) ? 0 : CORE.collection.filter(String).length;

	}

	isImporting(){
		return isBool( CORE.isImporting ) ? CORE.isImporting : false;

	}

	setImport( value ){
		return __F( CORE ).setIsBoolean( 'isImporting', value );

	}

	isDeleting(){
		return isBool( CORE.isDeleting ) ? CORE.isDeleting : false;

	}

	setDelete( value ){
		return __F( CORE ).setIsBoolean( 'isDeleting', value );

	}

	getModal(){
		return isObject( CORE.modal ) ? CORE.modal : false;

	}

	setModal( modal ){
		CORE.modal = modal;
		return modal;

	}

	setCounter(){
		const c = this.count();
		CORE.counter.innerHTML = c + ' font ' + ( c === 1 ? 'family' : 'families' ); // TRANSLATE

	}

	setLoadTime(){
		const c = this.count();
		var state = 'Slow';
		var classes = CLASSES.gauge.main + ' ';

		if( c <= 2 ){
			state = 'Fast';
			classes += CLASSES.gauge.fast;


		}else if( c <= 4 ){
			state = 'Moderate';
			classes += CLASSES.gauge.moderate; 

		}else{
			state = 'Slow';
			classes += CLASSES.gauge.slow;

		}
		CORE.loadInfo.className = classes;
		CORE.loadInfo.innerHTML = 'Load time: ' + state;

	}

	setState( importing ){
		const button = CORE.modal.fontBoxUi.import;
		importing = this.setImport( importing );

		if( !isNode( button ) ){
			return false;

		}

		if( importing ){
			node( button ).addClass( 'comet-waitwhile' );
			button.innerHTML = '<span class="cico cico-spin"></span>';
			return true;

		}
		node( button ).removeClass( 'comet-waitwhile' );
		button.innerHTML = __cometi18n.ui.import;
		return true;

	}

}