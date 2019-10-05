import { isNode, isString, isBool, isNumber } from './is.js';
import nodes from '../dom/elements.js';
import { stripTags } from './fill.js';
import node from '../dom/element.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	classes: {
		default: 'comet-message',
		error: 'comet-error',
		warning: 'comet-warning',
		success: 'comet-success',
		note: 'comet-note'

	},

	allowed: '<br><strong><u><i><em><strike><del><ins><a><b><code><ul><li><ol><s><sub><sup><small><span><mark>',

	getStatusCode: function( status ){

		if( isBool( status ) || isString( status ) || isNumber( status ) ){
			status = ( ( status.toString() ).toLowerCase() ).trim();

		}

		switch( status ){

			case '100':
			case 'note':
			return 100;

			case '200':
			case 'success':
			return 200;

			case '300':
			case 'warning':
			return 300;

			default:
			return 400;

		}

	},

	getClasses: function( status ){
		var classes = CORE.classes.default + ' ';

		switch( status ){

			case 100:
			classes += CORE.classes.note;
			break;

			case 200:
			classes += CORE.classes.success;
			break;

			case 300:
			classes += CORE.classes.warning;
			break;

			default:
			classes += CORE.classes.error;
			break;

		}
		return classes;

	},

	getMessages: function( from ){

		if( isNode( from ) ){
			return node( from ).children( CORE.classes.default );

		}

		if( from === DOCUMENT ){
			return from.getElementsByClassName( CORE.classes.default );

		}
		return [];

	}

};

export default function( message, status ){

	const MSG = DOCUMENT.createElement( 'div' );

	status = CORE.getStatusCode( status );
	message = isString( message ) ? stripTags( message, CORE.allowed ) : '';

	MSG.className = CORE.getClasses( status );
	MSG.innerHTML = '<p>' + message + '</p>';

	return {

		replace: function( old ){

			if( !isNode( old ) || old.parentNode === null ){
				return false;

			}
			old.parentNode.replaceChild( MSG, old );
			return true;

		},

		appendTo: function( to ){

			if( !isNode( to ) ){
				return false;

			}
			to.appendChild( MSG );
			return true;

		},

		set: function( nod_e ){

			if( !isNode( nod_e ) ){
				return false;

			}
			nod_e.innerHTML = '';
			nod_e.appendChild( MSG );
			return true;

		},

		get: function(){
			return MSG;

		},

		remove_existing: function( from ){
			var messages;

			if( ( messages = CORE.getMessages( from ) ).length < 1 ){
				return false;

			}
			return nodes( messages ).remove();

		}

	};
	
}