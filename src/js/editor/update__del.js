import { isString, isNode, isObject, isEmpty } from '../utils/is.js';
import sanitize from '../utils/sanitize.js';
import layout from '../utils/layout.js';
import parse from '../utils/parse.js';
import utils from '../utils/utils.js';

import node from '../dom/element.js';
import { TARGET } from './target.js';
import { DATA } from './data.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	nodeNames: [ 'select', 'textarea', 'input' ],

	isTrueValue: function( value ){

		return ( isString( value ) && ( value.toLowerCase() ).trim() === 'true' );

	},

	isNodeName: function( value, index ){
		var i;

		isNodeName = ( isString( value ) && ( i = nodeNames.indexOf( ( value.toLowerCase() ).trim() ) ) > -1 );

		return isBool( index ) && index ? i : isNodeName;

	},

	background: {

		remove: function( ui ){

			if( ui.parentNode === null ){
				return;

			}
			ui.parentNode.removeChild( ui );

		},

		create: function( content ){
			const bgClassName = 'cpb-backgroundComponents';
			var inner = '';
			var background;

			if( !isNode( content ) ){
				return;

			}
			node( content ).children( '.' + bgClassName, CORE.background.remove );

			background = DOCUMENT.createElement( 'div' );
			background.className = bgClassName;

			if( 'vid' in uidata && CORE.isTrue( uidata.vid ) && isString( uidata.vurl ) ){
				inner += '<video class="cpb-backgroundVideo" src="' + ( utils.stripTags( uidata.vurl ) ).trim() + '" loop autoplay muted preload="auto"></video>';

			}

			if( 'ov' in uidata && CORE.isTrue( uidata.ov ) && isString( uidata.ovc ) ){
				inner += '<div class="cpb-backgroundOverlay"></div>';

			}
			background.innerHTML = inner;

			content.appendChild( background );

		}

	},


};

export default function( ui ){

	var uidata = false;

	var _id, _i_id, index, _type, re, slug, cvalue;

	const data = {};

	const target_ = __target();

	const targetNode = target_.node();

	const __core = {

		is_true: function( value ){
			const true_ = [ 'true', 'TRUE', true ];

			return ( true_.indexOf( value ) > -1 );

		},

		resizeColumns: function(){

		}



	};

	if( !isNode( ui ) || !( _id = parse.id( TARGET.id() ) ) || !( _type = parse.type( TARGET.type() ) ) || !targetNode ){
		return false;

	}

	if( ( index = CORE.isNodeName( ui.nodeName, true ) ) < 0 ){
		return false;

	}

	if( !isString( ui.name ) || isEmpty( slug = ( utils.stripTags( ui.name ) ).trim() ) ){
		return false;

	}
	uidata = isObject( uidata = DATA.get( _id, _type ) ) ? uidata : {};
	data[slug] = utils.encode_chars( utils.stripOnly( ui.value, '<script><link><body><html><meta>' ) );

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

	switch( _type ){

		case 'sections':
		DATA.set( _id, 'sections', data );
		CORE.background.create( node( targetNode ).child( 'cpb-sectionContent' ) );
		layout( DATA.getData(), 'css' ).section( _id );
		return;

		case 'rows':
		DATA.set( _id, 'rows', data );
		CORE.background.create( node( targetNode ).child( 'cpb-rowContent' ) );
		layout( DATA.getData(), 'css' ).row( _id );
		return;

		case 'columns':

		if( !( cvalue = CORE.columns.resize( targetNode, 'columns' ) ) ){
			return;

		}
		data[slug] = cvalue;
		DATA.set( _id, 'columns', data );
		CORE.background.create( node( targetNode ).child( 'cpb-columnContent' ) );
		layout( DATA.getData(), 'css' ).column( _id );
		return;

		case 'elements':

		if( [ 'ITEMS', 'items' ].indexOf( TARGET.state() ) > -1 && ( _i_id = parse.id( TARGET.item() ) ) ){
			DATA.set( _i_id, 'items', data );

		}else{
			DATA.set( _id, 'elements', data );

		}

		if( !( re = layout( DATA.getData() ).element( _id, true ) ) ){
			return false;

		}
		targetNode.parentNode.replaceChild( re, targetNode );
		return true;

		default:
		return false;

	}
	
}