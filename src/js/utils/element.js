import { inArray, stripTags, stripOnly, escUrl, capitalize, xtrim, arrayDiff, extend } from './fill.js';
import { getElement } from '../editor/components/stored.js';
import * as CSS from './css/properties.js';
import * as SANITIZE from './sanitize.js';
import * as HTML from './html/index.js';
import { parseId } from './parse.js';
import * as IS from './is.js';

const CORE = {

	/*toObject: function( initial, need ){
		const obj = {};
		var i;

		if( !IS.isObject( initial ) || !IS.isArray( need ) || need.length < 1 ){
			return {};

		}

		for( i in initial ){

			if( need.indexOf( i ) < 0 ){
				continue;

			}
			obj[i] = initial[i];

		}
		return obj;

	},*/

	toolkit: function( type ){
		const __SANITIZE = extend( {}, SANITIZE );
		const MAIN = { inArray, stripTags, stripOnly, escUrl, capitalize, xtrim, arrayDiff };
		//const sn = [ 'unit', 'valueUnit', 'number', 'value', 'color', 'alignment', 'class' ];
		//const un = [ 'toClass', 'getVideo','stripTags', 'escUrl', 'capitalize', 'isString', 'isStringEmpty', 'isNumber', 'isBool', 'isArray', 'isSet', 'trim', 'isObject', 'isFunction', 'foreachItem' ];
		//const _d = {};
		//_d.sanitize = CORE.toObject( sanitize, sn );
		//_d.utils = CORE.toObject( utils, un );

		delete __SANITIZE.sanitizeData;
		delete __SANITIZE.sanitizeContent;

		return extend( MAIN, IS, SANITIZE, ( type === 'css' ? CSS : HTML ) );





		/*switch( type ){

			case 'css':
			_d.css = _css;
			break;

			case 'html':
			_d.html = _html;
			break;

			default:
			break;

		}
		return _d;*/

	},

	boolForceJs: function( value ){

		if( IS.isString( value ) || IS.isBool( value ) || IS.isNumber( value ) ){
			value = ( ( value.toString() ).toLowerCase() ).trim();

		}

		return inArray( [ 'true', 'yes', '1' ], value );

	}

};

const TOOLKIT = {

	CSS: CORE.toolkit( 'css' ),

	HTML: CORE.toolkit( 'html' )

};

export default function( slug, id, data ){

	const element = getElement( slug );

	if( !( id = parseId( id ) ) || id < 0 || !element ){
		return false;

	}

	if( !IS.isObject( data ) ){
		data = {};

	}

	return {

		force_js: CORE.boolForceJs( element.force_js ),

		view: function( ui ){
			
			if( !IS.isString( element.render.view ) || !IS.isNode( ui ) ){
				return false;

			}
			return Function('"use strict";return (function( id, data, ui, toolkit ){ ' + element.render.view + '})')()( id, data, ui, TOOLKIT.HTML );

		},

		css: function(){
			
			if( !IS.isString( element.render.css ) ){
				return false;

			}
			return Function('"use strict";return (function( id, data, toolkit ){ ' + element.render.css + '})')()( id, data, TOOLKIT.CSS );

		}
	};

}