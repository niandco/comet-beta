import { isNode, isObject, isFunction } from '../../../utils/is.js';
import __global from '../../../utils/global.js';
import range from '../../../utils/ui/range.js';
import update from '../../update.js';

const DOCUMENT = document;


export default function(){

	var fi = 0;

	const _global = __global();

	const globalList = _global.get( 'panelFields' );

	const __core = {

		range: function( ui ){

			range( ui, { 
				buttons: true,
				change: function(){
					update( ui );

				}

			} );

		}

	};

	if( globalList.length < 1 ){
		return;

	}

	for( fi; fi < globalList.length; fi++ ){

		if( !isObject( globalList[fi] ) ){
			continue;

		}

		if( !( 'type' in globalList[fi] ) || !isFunction( __core[globalList[fi].type] ) ){
			continue;

		}

		if( !( 'node' in globalList[fi] ) || !isNode( globalList[fi].node ) ){
			continue;

		}
		__core[globalList[fi].type]( globalList[fi].node );

	}


}