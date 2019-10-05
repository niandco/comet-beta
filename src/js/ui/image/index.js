import { isString, isNode } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import update from '../../editor/control/update.js';
import { stripTags } from '../../utils/fill.js';
import node from '../../dom/element.js';

/* global document, __cometi18n */
 
 const DOCUMENT = document;

 const I_CLASSNAME = ClassName( 'comet-media-uploader' );

 const CORE = {

 	classes: {
 		main: I_CLASSNAME.modifier( 'image' ),
 		button: I_CLASSNAME.element( 'button' ),
 		browse: I_CLASSNAME.element( 'browse' ),
 		remove: I_CLASSNAME.element( 'remove' ),
 		media: I_CLASSNAME.element( 'media' ),
 		image: I_CLASSNAME.element( 'media--image' )

 	},

 	onSelect: function( media, extData ){
 		const ATT = media.state().get( 'selection' ).first().toJSON();
 		var url;

 		extData.source.value = isString( url = ATT.url ) ? ( ( url = ( stripTags( url ) ).trim() ).length > 0 ? url : '' ) : '';

 		CORE.create( extData );
 		update( extData.source );

 	},

 	open: function( ev, ui, extData ){
 		var args, media;

 		ev.preventDefault();

 		if( media ){
 			media.open();
 			return;
 		}

 		args = {
 			frame: 'select',
 			title: __cometi18n.ui.selImage,
 			library: {
 				type: 'image'
 			},
 			button: {
 				text: __cometi18n.ui.select,
 			},
 			multiple: false,
 			editing:    true,
 			filterable: true,
 			searchable: true,
 			sortable: true

 		};

 		media = wp.media( args );

 		media.on( 'select', function(){
 			CORE.onSelect( media, extData );

 		});
 		media.open();

 	},

 	remove: function( ev, ui, extData ){
 		ev.preventDefault();

 		extData.source.value = '';
 		CORE.create( extData );
 		update( extData.source );

 	},

 	create: function( extData ){
 		const VALUE = extData.source.value;
 		var inner;

 		extData.wrapper.innerHTML = '';

 		if( !isString( VALUE ) || VALUE.length < 1 ){
 			extData.wrapper.innerHTML = '<button class="' + CORE.classes.button + '">' + __cometi18n.ui.browse + '</button>';
 			node( extData.wrapper.firstChild ).on( 'click', CORE.open, extData );
 			return;

 		}
 		inner = '<img class="' + ClassName( CORE.classes.media ).combineWith( [ CORE.classes.image ] ) + '" src="' + VALUE + '" title="' + __cometi18n.ui.browse + '" />';
 		inner += '<button class="' + CORE.classes.remove + '" title="' + __cometi18n.ui.remove + '">';
 		inner += '<span class="cico cico-x"></span>';
 		inner += '</button>';

 		extData.wrapper.innerHTML = inner;

 		node( extData.wrapper.firstChild ).on( 'click', CORE.open, extData );
 		node( extData.wrapper.lastChild ).on( 'click', CORE.remove, extData );

 	}

 };

 export default function( source, data ){

 	const FRAGMENT = DOCUMENT.createDocumentFragment();

 	const WRAPPER = DOCUMENT.createElement( 'div' );

 	if( !isNode( source ) ){
 		return false;

 	}
 	FRAGMENT.appendChild( WRAPPER );
 	WRAPPER.className = I_CLASSNAME.combineWith( [ CORE.classes.main ] );
 	CORE.create( { source, wrapper: WRAPPER, data } );
 	source.parentNode.appendChild( FRAGMENT );

 }