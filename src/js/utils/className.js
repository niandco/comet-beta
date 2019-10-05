import { isClassName, isArray } from './is.js';

const CORE = {

	element: function( root, name ){
		return root === null || !isClassName( name ) ? '' : root + '__' + name;

	},

	modifier: function( root, variant ){
		return root === null || !isClassName( variant ) ? '' : root + '--' + variant;

	},

	combineWith: function( root, array ){
		const sanitized = [];
		var a;

		if( !isArray( array ) || array.length < 1 ){
			return root === null ? '' : root;

		}

		if( root !== null ){
			sanitized[sanitized.length] = root;

		}

		for( a = 0; a < array.length; a++ ){

			if( !isClassName( array[a] ) ){
				continue;

			}
			sanitized[sanitized.length] = array[a];

		}
		return sanitized.join( ' ' );

	}

};


export function ClassName( root ){

	root = !isClassName( root ) ? null : root;

	return {

		element: function( name ){
			return CORE.element( root, name );

		},

		modifier: function( variant ){
			return CORE.modifier( root, variant );

		},

		combineWith: function( array ){
			return CORE.combineWith( root, array );

		}

	};

}