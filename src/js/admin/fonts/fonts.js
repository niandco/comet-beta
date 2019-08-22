import { isBool, isNode, isArray, isObject } from '../../utils/is.js';
import __F from './fonts-private.js';

const DOCUMENT = document;

const WINDOW = window;

export class Fonts {

	constructor(){
		var frame;

		if( typeof __cometfontsdata === 'object' ){

			if( isNode( __cometfontsdata.frame ) ){
				this.frame = __cometfontsdata.frame;
				this.data = __cometfontsdata;
				return;
			}

		}

		if( ( frame = DOCUMENT.getElementById( 'comet-sourceframe8679171600336466' ) ) === null ){
			return;

		}
		WINDOW.__cometfontsdata = {
			collection: [],
			counter: false,
			loadInfo: false,
			frame,
			fontsBox: null,
			modal: false,
			isImporting: false,
			isDeleting: false,
			hasFonts: false

		};
		this.frame = __cometfontsdata.frame;
		this.data = __cometfontsdata;

	}

	setCounterOnce( entry ){
		return __F( this ).setDefault( 'counter', entry );

	}

	setLoadInfoOnce( entry ){
		return __F( this ).setDefault( 'LoadInfo', entry );

	}

	setfontsBoxOnce( entry ){
		return __F( this ).setDefault( 'fontsBox', entry );

	}

	hasFonts(){
		this.data.hasFonts = isArray( this.data.collection ) && this.data.collection.length > 0;
		return this.data.hasFonts;

	}

	getFonts(){
		return this.hasFonts() ? this.data.collection : false;

	}

	getFont( id ){
		return !this.hasFonts() || !isObject( this.data.collection[id] ) ? false : this.data.collection[id];

	}

	setFont( id, args, force ){
		var fonts = this.getFonts();
		force = isBool( force ) ? force : false;

		if( !fonts ){
			this.data.collection = [];
			fonts = this.data.collection;

		}

		if( id < 0 || !isObject( args ) ){
			return false;

		}

		if( !isDefined( fonts[id] ) || force ){
			fonts[id] = args;

		}
		return fonts[id];

	}

	count(){
		const F = this.getFonts();
		return !F ? 0 : F.length;

	}

	isImporting(){
		return isBool( this.data.isImporting ) ? this.data.isImporting : false;

	}

	setImport( value ){
		return __F( this ).setIsBoolean( 'isImporting', value );

	}

	isDeleting(){
		return isBool( this.data.isDeleting ) ? this.data.isDeleting : false;

	}

	setDelete( value ){
		return __F( this ).setIsBoolean( 'isDeleting', value );

	}

	getModal(){
		return isObject( this.data.modal ) ? this.data.modal : false;

	}

	setModal( modal ){
		this.data.modal = modal;
		return modal;

	}

	setCounter(){
		const c = this.count();
		this.data.counter.innerHTML = c + ' font ' + ( c === 1 ? 'family' : 'families' );

	}

	setLoadTime(){
		const c = this.count();
		var state = 'Slow';
		var classes = 'comet-gauge comet-indicator';

		if( c <= 2 ){
			state = 'Fast';
			classes += ' is-fast';


		}else if( c <= 4 ){
			state = 'Moderate';
			classes += ' is-moderate'; 

		}else{
			state = 'Slow';
			classes += ' is-slow';

		}
		this.data.loadInfo.className = classes;
		this.data.loadInfo.innerHTML = 'Load time: ' + state;

	}

	setState( importing ){
		const button = this.data.modal.fontBoxUi.import;
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