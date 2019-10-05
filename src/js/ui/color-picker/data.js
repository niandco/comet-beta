import { isObject, isArray, isDefined } from '../../utils/is.js';
import { convertHSB_RGB, convertHSB_HEX } from './convert.js';
import { inArray } from '../../utils/fill.js';
import { parseValue } from './parse.js';
import node from '../../dom/element.js';
import { strcolor } from './utils.js';

const STORAGE = [];

const CORE = {

	reset: function(){
		STORAGE.length = 0;

		return STORAGE;

	},

	destroy: function(){
		var a;

		if( STORAGE.length < 1 ){
			return;

		}

		for( a = 0; a < STORAGE.length; a++ ){
			CORE.picker.destroy( a );

		}
		CORE.reset();

	},

	get: function(){
		return !isArray( STORAGE ) ? CORE.reset() : STORAGE;

	},

	picker: {

		exists: function( id ){
			const DATA = CORE.get();

			return isObject( DATA[id] );

		},

		get: function( id ){

			return CORE.picker.exists( id ) ? STORAGE[id] : false;

		},

		getObject: function( id ){
			const DATA = CORE.picker.get( id );

			return isObject( DATA ) ? DATA : false;

		},

		set: function( id, data ){
			const CURRENT = CORE.picker.get( id );

			if( !CURRENT ){
				id = STORAGE.length;

			}
			STORAGE[id] = data;

			return id;

		},

		setPickerPosition: function( id ){
			const CURRENT = CORE.picker.getObject( id );
			var preview, viewerRect, viewerHeight;

			if( !CURRENT || !isObject( CURRENT.cp ) ){
				return false;

			}
			preview = CURRENT.preview.node;
			viewerHeight = node( preview ).height();
			viewerRect = preview.getBoundingClientRect();

			if( !isObject( viewerRect ) || !( 'left' in viewerRect ) || !( 'top' in viewerRect ) ){
				return false;

			}
			CURRENT.cp.node.style.left = viewerRect.left + 'px';
			CURRENT.cp.node.style.top = ( viewerRect.top + viewerHeight ) + 'px';
			return true;

		},

		setColor: function( id ){
			const CURRENT = CORE.picker.getObject( id );
			var color, pickSatNode, width, height;

			if( !CURRENT ){
				return;

			}
			color = hsbToColor( CURRENT.color );
			pickSatNode = CURRENT.cp.saturation.parentNode;

			pickSatNode.style.backgroundColor = strcolor( 'hex', convertHSB_HEX( [ CURRENT.color.hsb[0], 1, 1 ] ) );

			if( ( width = node( pickSatNode ).width() ) && ( height = node( pickSatNode ).height() ) ){
				CURRENT.cp.saturation.style.left = ( CURRENT.color.hsb[1] * ( width - 1 ) ) + 'px';
				CURRENT.cp.saturation.style.top = -( ( CURRENT.color.hsb[2] - 1 ) * ( height - 1 ) ) + 'px';

			}

			CURRENT.cp.opacity.value = parseValue( ( CURRENT.color.hsb[3] || 0 ), 0, 1, 1, true );
			//node( CURRENT.cp.opacity ).trigger( 'setValue' );

			CURRENT.cp.hue.value = parseValue( ( CURRENT.color.hsb[0] || 0 ) * 360, 0, 360 );
			//node( CURRENT.cp.hue ).trigger( 'setValue' );

			CURRENT.cp.input.value = color;
			CURRENT.source.node.value = color;

			CURRENT.preview.node.style.backgroundColor = color;

			return color;

		},

		destroy: function( id ){

			if( !isObject( STORAGE[id] ) || !isObject( STORAGE[id].cp ) ){
				return;

			}
			node( STORAGE[id].cp.node ).remove();
			STORAGE[id] = null;

		}

	}

};

function hsbToColor( colorObject ){
	var alpha, x;

	if( !isObject( colorObject ) ){
		return '';

	}

	if( !isArray( colorObject.hsb ) || colorObject.hsb.length < 3 ){
		return '';

	}
	alpha = isDefined( colorObject.hsb[3] ) ? parseValue( colorObject.hsb[3], 0, 1, 1, true ) : 1;

	if( alpha === 1 ){
		x = convertHSB_HEX( [ colorObject.hsb[0], colorObject.hsb[1], colorObject.hsb[2] ] );
		return strcolor( 'hex', x );

	}
	x = convertHSB_RGB( [ colorObject.hsb[0], colorObject.hsb[1], colorObject.hsb[2] ] );
	return strcolor( 'rgba', [ x[0], x[1], x[2], alpha ] );

}

export function destroyPickers(){

	CORE.destroy();

}

export function LocalStorage( id ){

	return {

		exists: function(){
			return CORE.picker.exists( id );

		},

		set: function( data ){

			id = CORE.picker.set( id, data );

			return id;

		},

		get: function(){
			return CORE.picker.get( id );

		},

		getObject: function(){
			return CORE.picker.getObject( id );

		},

		setPickerPosition: function(){
			return CORE.picker.setPickerPosition( id );

		},

		setColor: function(){
			return CORE.picker.setColor( id );

		},

		destroy: function(){
			CORE.picker.destroy( id );
			
		}

	};

}