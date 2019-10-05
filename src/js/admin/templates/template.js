import { jsonDecode, stripTags, encodeChars, escUrl, timeSince, inArray, capitalize } from '../../utils/fill.js';
import { isBool, isNode, isString, isObject, isFunction } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { addQueryArgs } from '../../utils/url.js';
import { parseId } from '../../utils/parse.js';
import message from '../../utils/message.js';
import Dialog from '../../utils/dialog.js';
import Modal from '../../utils/modal.js';
import Node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';
import { __class } from './classes.js';
import Templates from './templates.js';

/* global document, window, __cometi18n, Blob */


const DOCUMENT = document;

const WINDOW = window;

const TEMPLATESJS = new Templates();

const CORE = {

	saving: false,

	deleting: false,

	delete: function( ev, ui, data ){
		ev.preventDefault();

		if( CORE.deleting || !isObject( data ) || ( isBool( data.error ) && data.error ) ){
			return;

		}
		CORE.deleting = true;
		data.dialog.destroy();

		Ajax({
			do: 'dtemplate',
			id: data.id

		}).done(function( r ){
			CORE.deleting = false;

			if( inArray( r, [ 'false', 'FALSE', '0' ] ) ){
				return;

			}
			Node( data.node ).remove();

		});

	},

	toggle: function( button, state ){
		const waitwhile = 'comet-waitwhile';

		if( !isNode( button ) ){
			return;

		}

		if( isBool( state ) && state ){
			Node( button ).addClass( waitwhile );
			button.innerHTML = '<span class="cico cico-spin"></span>';
			return;

		}
		Node( button ).removeClass( waitwhile );
		button.innerHTML = state;

	},

	export: function( ev, ui, edata ){
		var name, pp, _message;

		ev.preventDefault();

		if( CORE.saving || !isNode( edata.input ) || edata.input.parentNode === null || ( pp = edata.input.parentNode.parentNode ) === null ){
			return;

		}
		CORE.saving = true;
		CORE.toggle( ui, true );

		if( !isString( name = edata.input.value ) || ( name = ( stripTags( name ) ).trim() ).length < 1 ){
			_message = message( __cometi18n.messages.error.title, 400 );
			_message.remove_existing( pp );
			_message.appendTo( pp );
			CORE.saving = false;
			CORE.toggle( ui, __cometi18n.ui.export );
			return;

		}

		Ajax({
			do: 'get',
			meta: true,
			id: edata.id,

		}).done(function( r ){
			var data, blob, msg, filename, json_data;

			CORE.saving = false;
			CORE.toggle( ui, __cometi18n.ui.export );

			if( !( data = jsonDecode( r ) ) || !isString( data.post_content ) || !isObject( data.meta ) ){
				_message = message( __cometi18n.messages.error.export, 400 );
				_message.remove_existing( pp );
				_message.appendTo( pp );
				return;

			}
			filename = 'comet-mytemplate.json';
			json_data = {
				post_title: encodeChars( name ),
				post_content: data.post_content,
				meta: data.meta
			};
			blob = new Blob( [ JSON.stringify( json_data ) ], { type: 'application/json' } );
			msg = __cometi18n.messages.success.export + '<br>';
			msg += '<a href="' + escUrl( WINDOW.URL.createObjectURL( blob ) ) + '" download="' + filename + '">' + __cometi18n.ui.download + '</a>';

			message( msg, 200 ).set( pp );
			message( __cometi18n.messages.warning.export, 300 ).appendTo( pp );

		});

	}

};

export default class Template {

	constructor( index ){
		const data = TEMPLATESJS.getTemplate( index );

		this.index = index;
		this.data = !isObject( data ) ? false : data;
		this.ui = null;

	}

	render(){
		var inner = '';
		var date = '';

		if( !this.data ){
			return;

		}
		if( this.data.post_date ){
			date = timeSince( this.data.post_date );

		}
		inner += '<div class="' + __class.item.meta + '">';
		inner += '<h4 class="' + __class.item.title + '">' + capitalize( this.data.post_title ) + '</h4>';
		inner += '<p class="' + __class.item.date + '">' + date + '</p>';
		inner += '</div>';

		inner += '<div class="' + __class.item.events + '">';
		inner += '</div>';

		this.ui = DOCUMENT.createElement( 'div' );
		this.ui.className = __class.item.main;
		this.ui.innerHTML = inner;
		this.createEvents();

		TEMPLATESJS.appendTemplate( this.index, this.ui );


	}

	createEvents(){
		const events = {
			edit: {
				title: __cometi18n.ui.edit,
				onclick: this.edit(),
				inner: 'title'

			},
			preview: {
				title: __cometi18n.ui.template.preview,
				onclick: this.preview,
				icon: 'cico cico-eye',
				inner: 'icon'

			},
			export: {
				title: __cometi18n.ui.export,
				onclick: this.export,
				icon: 'cico cico-export',
				inner: 'icon'

			},
			delete: {
				title: __cometi18n.ui.delete,
				onclick: this.delete,
				icon: 'cico cico-trash',
				inner: 'icon'

			},
		};

		const C = ClassName( __class.item.event );

		var e, ui, title;

		for( e in events ){
			title = false;
			ui = DOCUMENT.createElement( 'a' );
			ui.className = C.combineWith( [ C.modifier( e ), 'comet-button', 'comet-button--circle' ] );


			if( isString( events[e].onclick ) ){
				ui.href = events[e].onclick.trim();

			}else if( isFunction( events[e].onclick ) ){
				Node( ui ).on( 'click', events[e].onclick, this );

			}

			if( isString( events[e].title ) ){
				title = stripTags( events[e].title );
				ui.title = title;

			}

			if( events[e].inner === 'icon' && isString( events[e].icon ) ){
				ui.innerHTML = '<span class="comet-button__icon ' + events[e].icon.trim() + '"></span>';

			}else if( title ){
				ui.innerHTML = title;

			}
			this.ui.lastChild.appendChild( ui );

		}

	}

	edit(){
		const id = this.data.ID;
		const args = {
			post: id, 
			action: 'edit', 
			comet: 'template'

		};

		return addQueryArgs( args, __cometdata.edit_url );

	}

	preview( ev, ui, self ){
		const url = isString( ui.href ) ? ( stripTags( ui.href ) ).trim() : false;
		var inner = '<div>';

		ev.preventDefault();

		if( !url ){
			inner += '<div class="comet-msgbox">';
			inner += '<span class="cico cico-exclamation"></span>';
			inner += '<p>' + __cometi18n.messages.error.unreach + '</p>';
			inner += '</div>';

		}else{
			inner += '<iframe src="' + escUrl( url ) + '"></iframe>';

		}
		inner += '</div>';

		Modal({
			classes: 'comet-previewbox',
			header: '<h4>' + __cometi18n.ui.pTemplate + '</h4>',
			content: inner
		});

	}

	export( ev, ui, self ){
		var fragment = false;
		var wrapper, inner, id;

		ev.preventDefault();

		if( !( id = parseId( self.data.ID ) ) ){
			return;

		}
		fragment = DOCUMENT.createDocumentFragment();
		wrapper = DOCUMENT.createElement( 'div' );
		wrapper.className = 'comet-savebox comet-wrapper';
		fragment.appendChild( wrapper );

		inner = '<div class="comet-saveform">';
		inner += '<input type="text" class="comet-input" value="" placeholder="' + __cometi18n.ui.name + '" />';
		inner += '<button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.export + '">' + __cometi18n.ui.export + '</button>';
		inner += '</div>';
		wrapper.innerHTML = inner;

		Node( wrapper.firstChild.lastChild ).on( 'click', CORE.export, { id: id, input: wrapper.firstChild.firstChild } );

		Modal({
			classes: 'comet-exportbox',
			header: '<h4>' + __cometi18n.ui.expTemplate + '</h4>',
			content: fragment,
		});

	}

	delete( ev, ui, self ){
		var msg = false;
		var id;

		ev.preventDefault();

		if( !( id = parseId( self.data.ID ) ) ){
			msg = __cometi18n.messages.error.noTemplate;

		}
		Dialog({
			message: ( !msg ? __cometi18n.messages.warning.delete : msg ),
			confirm: CORE.delete,
			data: {
				id,
				node: self.data.ui,
				error: ( !msg ? false : true )
			}
		});

	}

} 