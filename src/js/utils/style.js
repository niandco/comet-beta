import { isNode, isString, isFunction } from './is.js';
import { capitalize, stripTags } from './fill.js';
import { parseId, parseType } from './parse.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	generateNodeId: function( id, type ){
		var s_id;

		if( !( id = parseId( id ) ) || !( type = parseType( type ) ) ){
			return false;

		}
		s_id = 'cpb-style';
		s_id += capitalize( type );
		s_id += id;

		return s_id;

	},

	getNode: function( s_id ){
		const s = isString( s_id ) ? DOCUMENT.getElementById( s_id.trim() ) : false;

		return ( isNode( s ) && s.nodeName.toLowerCase() === 'style' ? s : false );


	},

	add: function( s_id, css, onold ){
		const _style = CORE.create( s_id, css );
		var old = false;

		if( !_style ){
			return false;

		}

		if( !( old = CORE.getNode( _style.id ) ) ){
			DOCUMENT.head.appendChild( _style );
			return true;
		}

		if( isFunction( onold ) ){
			return onold( _style, old );

		}
		return false;

	},

	onInsert: function( style, old ){

		if( old.parentNode !== null ){
			old.parentNode.replaceChild( style, old );
			return true;
		}
		return false;

	},

	create: function( s_id, css ){
		var _style = null;

		css = isString( css ) ? ( stripTags( css ) ).trim() : null;

		if( !s_id || css === null ){
			return false;

		}
		_style = DOCUMENT.createElement( 'style' );
		_style.id = s_id;
		_style.className = 'cpb-style ' + s_id;
		_style.innerHTML = css;

		return _style;

	},

	remove: function( s_id ){
		const s = CORE.getNode( s_id );

		if( !s || s.parentNode === null ){
			return false;

		}
		s.parentNode.removeChild( s );
		return true;

	}

};

export default function( id, type ){

	const generatedId = CORE.generateNodeId( id, type );

	return {

		create: function( css ){
			return CORE.create( generatedId, css );

		},

		add: function( css ){
			return CORE.add( generatedId, css );

		},

		insert: function( css ){
			return CORE.add( generatedId, css, CORE.onInsert );
			
		},

		get: function(){
			return CORE.getNode( generatedId );

		},

		remove: function(){
			return CORE.remove( generatedId );

		}

	};

}