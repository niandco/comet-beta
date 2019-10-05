import { inArray, stripTags, stripOnly, escUrl, capitalize, xtrim, arrayDiff, extend } from './fill.js';
import { getElement } from '../editor/components/stored.js';
import * as CSS from './css/properties.js';
import * as SANITIZE from './sanitize.js';
import * as HELPERS from './helpers.js';
import * as HTML from './html/index.js';
import { parseId } from './parse.js';
import * as IS from './is.js';

const CORE = {

	toolkit: function( type ){
		const __SANITIZE = extend( {}, SANITIZE );
		const FILL = { inArray, stripTags, stripOnly, escUrl, capitalize, xtrim, arrayDiff };

		delete __SANITIZE.sanitizeData;
		delete __SANITIZE.sanitizeContent;

		return extend( { helpers: extend( FILL, IS, __SANITIZE, HELPERS ) }, ( type === 'css' ? { css: CSS } : { html: HTML } ) );

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
			return Function('"use strict";return (function( id, data, ui, comet ){ ' + element.render.view + '})')()( id, data, ui, TOOLKIT.HTML );

		},

		css: function(){
			
			if( !IS.isString( element.render.css ) ){
				return false;

			}
			return Function('"use strict";return (function( id, data, comet ){ ' + element.render.css + '})')()( id, data, TOOLKIT.CSS );

		}
	};

}