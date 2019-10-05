import { on as bind, removeClass, addClass, remove as removeNode, trigger } from './default.js';
import { isString, isObject, isArray, isEmpty } from '../utils/is.js';
import sort from '../ui/sort/index.js';

const DOCUMENT = document;

export default function( entry ){
	var elements = entry;

	if( isString( entry ) ){
		elements = DOCUMENT.querySelectorAll( entry );

	}

	if( !isObject( elements ) || elements.length < 1 ){
		return false;

	}

	return {

		removeClass: function( className ){
			var a;

			for( a = 0; a < elements.length; a++ ){
				removeClass( elements[a], className );

			}

		},

		addClass: function( className ){
			var a;

			for( a = 0; a < elements.length; a++ ){
				addClass( elements[a], className );

			}

		},

		on: function( types, listener, data, mixed ){
			var a;

			for( a = 0; a < elements.length; a++ ){
				bind( elements[a], types, listener, data, mixed );

			}

		},

		remove: function(){
			var a;

			for( a = 0; a < elements.length; a++ ){
				removeNode( elements[a] );

			}


		},

		sort: function( options ){
			var a, _options;

			for( a = 0; a < elements.length; a++ ){
				_options = options;
				_options.handle = elements[a];
				sort( _options );

			}

		},

		trigger: function( eventName ){
			var a;

			for( a = 0; a < elements.length; a++ ){
				trigger( elements[a], eventName );

			}

		}

	};

}