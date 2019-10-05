import { isString, isObject, isEmpty } from '../utils/is.js';
import { parseId } from '../utils/parse.js';
import { inArray } from '../utils/fill.js';
import Global from '../utils/global.js';

const SLUG = 'target';

const CORE = {

	properties: [ 'id', 'type', 'node', 'state', 'item' ],

	isTarget: function( data ){
		var key;

		if( !isObject( data ) ){
			return false;

		}

		for( key in data ){

			if( !inArray( CORE.properties, key ) ){
				return false;

			}

		}
		return true;

	},

	default: function(){
		const DATA = {};
		var a = 0;

		for( a; a < CORE.properties.length; a++ ){
			DATA[CORE.properties[a]] = null;

		}
		return DATA;

	}

};

export const TARGET = {

	set: function( data ){
		const target = TARGET.get();

		if( !isObject( data ) ){
			return false;

		}

		if( 'id' in data ){
			target.id = data.id;

		}

		if( 'type' in data ){
			target.type = data.type;

		}

		if( 'item' in data ){
			target.item = data.item;

		}

		if( 'node' in data ){
			target.node = data.node;

		}

		if( 'state' in data ){
			target.state = data.state;

		}
		return Global().set( SLUG, target, true );

	},

	get: function(){
		const data = Global().get( SLUG );

		return !CORE.isTarget( data ) ? TARGET.reset() : data;

	},

	reset: function(){

		return Global().set( SLUG, CORE.default(), true );

	},

	id: function(){
		const target = TARGET.get();
		var id;

		return ( !( id = parseId( target.id ) ) || id < 0 ? false : id );

	},

	node: function(){
		const target = TARGET.get();

		return ( !isObject( target.node ) ? false : target.node );


	},

	type: function(){
		const target = TARGET.get();

		return ( !isString( target.type ) || isEmpty( target.type ) ? false : target.type.trim() );

	},

	item: function(){
		const target = TARGET.get();
		var id;

		return ( !( id = parseId( target.item ) ) || id < 0 ? false : id );

	},

	state: function(){
		const target = TARGET.get();

		return ( !isString( target.state ) || isEmpty( target.state ) ? false : target.state.trim() );

	}

};