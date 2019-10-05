import Global from '../../../utils/global.js';
import { isNode } from '../../../utils/is.js';
import node from '../../../dom/element.js';

const SLUG = 'frameset';

const DOCUMENT = document;

const BODY = DOCUMENT.body;

function getFrameset(){
	var _tmp, a;

	if( BODY.children.length < 1 ){
		return null;

	}

	for( a = 0; a < BODY.children.length; a++ ){

		if( !isNode( BODY.children[a] ) || !node( BODY.children[a] ).hasClass( 'comet-frameset' ) ){
			continue;

		}
		return BODY.children[a];

	}
	return null;

}

export function setFrameset(){

	const FRAMESET = getFrameset();

	const DATA = {

		target: FRAMESET,

		targetNode: node( FRAMESET ),

		append: function( child ){

			FRAMESET.appendChild( child );

		},

		remove: function( child ){

			FRAMESET.removeChild( child );

		},

		addClass: function( className ){

			node( FRAMESET ).addClass( className );

		},

		removeClass: function( className ){

			node( FRAMESET ).removeClass( className );

		},

		hasClass: function( className ){

			return node( FRAMESET ).hasClass( className );

		},

		destroy: function(){
			node( FRAMESET ).remove();
			Global().unset( SLUG );
			return true;

		}

	};

	if( FRAMESET === null ){
		return;

	}
	return Global().set( SLUG, DATA, true );

}