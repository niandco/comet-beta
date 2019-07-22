/* Comet - Copyright (c) 2019 Blacklead */

import { parseId, parseDataset, parseJson } from './parse.js';
import { isObject, isBool } from './is.js';
import Global from './global.js';
import layout from './layout.js';
import AJAX from './ajax.js';

/* global document, window, Comet, __cometdata */

'use strict';

const CORE = {

	document: null,

	window: null,

	capture: function( className ){

		return CORE.document.getElementsByClassName( className );

	},

	parser: function( data, nodes, type ){
		const isElement = ( type === 'element' );
		var i, id, a, _layout;

		if( !nodes || nodes.length < 1 ){
			return;

		}

		if( isElement ){
			_layout = layout( data, false );

		}else{
			_layout = layout( data, true );

		}

		for( i = 0; i < nodes.length; i++ ){

			if( !( id = parseDataset( nodes[i], 'id' ) ) || !( id = parseId( id ) ) ){
				continue;

			}

			if( isElement ){
				a = _layout.element( id, 'view' );

				if( !isBool( a ) ){
					nodes[i].parentNode.replaceChild( a, nodes[i] );

				}
				continue;

			}
			a = _layout[type]( id );

		}
	},

	initialize: function( response ){
		const GLOBAL = GLOBAL();
		const DATATYPES = [ 'post', 'settings', 'svgSets' ];
		const DATA = parseJson( response );
		var n = 0;
		var i, slug, post, metadata;

		if( !isObject( DATA ) ){
			return;

		}

		for( i = 0; i < DATATYPES.length; i++ ){

			if( !( ( slug = DATATYPES[i] ) in DATA ) ){
				continue;

			}
			GLOBAL.set( slug, DATA[slug], true );
			n++;

		}

		if( n < 3 ){
			return;

		}
		post = GLOBAL.get( 'post' );
		metadata = isObject( post ) && isObject( post.meta ) ? post.meta : {};
		CORE.parser( metadata, CORE.capture( 'cpb-section' ), 'section' );
		CORE.parser( metadata, CORE.capture( 'cpb-row' ), 'row' );
		CORE.parser( metadata, CORE.capture( 'cpb-column' ), 'column' );
		CORE.parser( metadata, CORE.capture( 'cpb-element' ), 'element' );

	}

};

(function( cometView ) {

	cometView( window, document );

}(function( WINDOW, DOCUMENT ){

	var id = null;

	CORE.document = DOCUMENT;
	CORE.window = WINDOW;

	if( !isObject( __cometdata ) || !( id = parseId( __cometdata.id ) ) ){
		return false;

	}
	WINDOW.Comet = Comet || {};

	AJAX( {
		do: 'data',
		id,
		public: 'true'

	} ).done( CORE.initialize );

}));