/* Comet - Copyright (c) 2019 Blacklead */
import { isArray, isObject, isString, isEmpty } from '../utils/is.js';
import { createFrame } from './components/frameset/frame.js';
import { parseId, parseJson } from '../utils/parse.js';
import { components } from './components/index.js';
import { getParameters } from '../utils/url.js';
import Global from '../utils/global.js';
import layout from '../utils/layout.js';
import post_elements from './post.js';
import node from '../dom/element.js';
import AJAX from '../utils/ajax.js';
import { DATA } from './data.js';

/* global document, window, Comet, alert, __cometi18n, __cometdata, setInterval, clearInterval */

'use strict';

const DOCUMENT = document;

const CORE = {

    stopPreload: function(){
        const preload = DOCUMENT.getElementById( 'comet-preloader' );
        var op = 1;
        var int = setInterval( function(){

            if( op <= 0 ){
                preload.parentNode.removeChild( preload );
                clearInterval( int );
                return;

            }
            op = Number( op - 0.1 ).toFixed( 1 );
            preload.style.opacity = op;

        }, 50 );

    },

    setPost: function( content ){
        var tmp, tmpe, items, elements, i, x;

        if( !( tmp = DATA.create( 'sections', 0, 'last' ) ) ){
            return false;

        }

        if( !( tmp = DATA.create( 'rows', tmp, 'last' ) ) ){
            return false;

        }

        if( !( tmp = DATA.create( 'columns', tmp, 'last' ) ) ){
            return false;

        }

        if( !( elements = post_elements( content ) ) || !isArray( elements ) || elements.length < 1 ){
            return false;

        }

        for( i = 0; i < elements.length; i++ ){

            if( !( '_type' in elements[i] ) ){
                continue;

            }
            items = false;

            if( '_items' in elements[i] ){
                items = elements[i]._items;
                delete elements[i]._items;

            }
            tmpe = DATA.create( elements[i]._type, tmp, 'last', elements[i] );

            if( !tmpe || !isArray( items ) || items.length < 1 ){
                continue;

            }

            for( x = 0; x < items.length; x++ ){
                DATA.create( 'items', tmpe, 'last', items[x] );

            }

        }
        return true;

    },

    initialize: function( response ){
        const _default = [ 'post', 'settings', 'svgSets' ];
        const data = parseJson( response );
        var n = 0;
        var i, slug, tmp, post, metaData, frame;

        if( !data || !isObject( data ) ){
            alert( __cometi18n.messages.error.failed );
            throw new Error( __cometi18n.messages.error.failed );

        }

        for( i in _default ){

            if( !( ( slug = _default[i] ) in data ) ){
                continue;

            }
            tmp = Global().set( slug, data[slug], true );

            if( slug === 'post' ){
                post = tmp;

            }
            n++;

        }

        if( n < 3 ){
            alert( __cometi18n.messages.error.failed );
            throw new Error( __cometi18n.messages.error.failed );

        }
        metaData = DATA.setData( isObject( post ) ? ( isObject( post.meta ) && !Array.isArray( post.meta ) ? post.meta : {} ) : {} );
        frame = createFrame();

        if( !isString( metaData._sections ) || isEmpty( metaData._sections ) ){
            CORE.setPost( post.post_content );

        }
        layout( DATA.getData() ).init( frame.target, null );
        components.initialize();
        CORE.stopPreload();

    }

}; 

(function( cometEditor ) {

    cometEditor( window, document);

}(function( WINDOW, DOCUMENT ){

    var get, id1, id2;

    WINDOW.Comet = Comet || {};

    if( !( get = getParameters() ) || !( 'post' in get ) || !( 'action' in get ) || !( 'comet' in get ) ){
        alert( __cometi18n.messages.error.failed );
        return false;

    }

    if( get.action !== 'edit' || !isObject( __cometdata ) || !( 'post_id' in __cometdata ) ){
        alert( __cometi18n.messages.error.failed );
        return false;

    }

    if( !( id1 = parseId( get.post ) ) || !( id2 = parseId( __cometdata.post_id ) ) || id1 !== id2 ){
        alert( __cometi18n.messages.error.failed );
        return false;

    }

    AJAX( {
        do: 'data',
        id: __cometdata.post_id,
        public: false,

    } ).done( CORE.initialize );

}));