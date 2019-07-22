import { isString, isNode, isObject, isEmpty, isNodeName, isDefined } from '../../utils/is.js';
import { inArray, stripTags, stripOnly, encodeChars } from '../../utils/fill.js';
import { parseId, parseType } from '../../utils/parse.js';
import createBackground from './background.js';
import layout from '../../utils/layout.js';
import resizeColumns from './columns.js';
import node from '../../dom/element.js';
import { TARGET } from '../target.js';
import { DATA } from '../data.js';

export default function( ui ){

	var uidata = false;

	var _i_id, index, re, slug, cvalue, vrData;

	const data = {};

	const CURRENT_ID = parseId( TARGET.id() );

	const CURRENT_TYPE = parseType( TARGET.type() );

	const CURRENT_NODE = TARGET.node();

	if( !isNode( ui ) || !isNode( CURRENT_NODE ) || !CURRENT_ID || !CURRENT_TYPE ){
		return false;

	}

	if( ( index = isNodeName( [ 'select', 'textarea', 'input' ], ui.nodeName, true ) ) < 0 ){
		return false;

	}

	if( !isString( ui.name ) || isEmpty( slug = ( stripTags( ui.name ) ).trim() ) ){
		return false;

	}
	uidata = isObject( uidata = DATA.get( CURRENT_ID, CURRENT_TYPE ) ) ? uidata : {};
	data[slug] = encodeChars( stripOnly( ui.value, '<script><link><body><html><meta>' ) );

	if( index === 2 && ui.type ){

		switch( ui.type.toLowerCase() ){

			case 'checkbox':
			data[slug] = ui.checked ? 'true' : 'false';
			break;

			case 'number':
			data[slug] = parseFloat( data[slug] );
			break;

			default:
			break;

		}
		
	}

	switch( CURRENT_TYPE ){

		case 'sections':
		vrData = DATA.set( CURRENT_ID, 'sections', data );
		createBackground( node( CURRENT_NODE ).child( '.cpb-sectionContent' ), vrData );
		layout( DATA.getData(), 'css' ).section( CURRENT_ID );
		return;

		case 'rows':
		vrData = DATA.set( CURRENT_ID, 'rows', data );
		createBackground( node( CURRENT_NODE ).child( '.cpb-rowContent' ), vrData );
		layout( DATA.getData(), 'css' ).row( CURRENT_ID );
		return;

		case 'columns':

		if( !isDefined( cvalue = resizeColumns( { target: CURRENT_NODE, value: data[slug], slug } ) ) ){
			return;

		}
		data[slug] = cvalue;
		ui.value = cvalue;
		vrData = DATA.set( CURRENT_ID, 'columns', data );
		createBackground( node( CURRENT_NODE ).child( '.cpb-columnContent' ), vrData );
		layout( DATA.getData(), 'css' ).column( CURRENT_ID );
		return;

		case 'elements':

		if( inArray( [ 'ITEMS', 'items' ], TARGET.state() ) && ( _i_id = parseId( TARGET.item() ) ) ){
			DATA.set( _i_id, 'items', data );

		}else{
			DATA.set( CURRENT_ID, 'elements', data );

		}

		if( !( re = layout( DATA.getData() ).element( CURRENT_ID, true ) ) ){
			return false;

		}
		CURRENT_NODE.parentNode.replaceChild( re, CURRENT_NODE );
		return true;

		default:
		return false;

	}
	
}