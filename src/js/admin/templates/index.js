import { jsonEncode, jsonDecode, stripTags, encodeChars } from '../../utils/fill.js';
import { isNode, isString, isObject, isArray } from '../../utils/is.js';
/*import { addQueryArgs } from '../utils/url.js';*/

import message from '../../utils/message.js';
import Modal from '../../utils/modal.js';
import { ClassName } from '../../utils/className.js';
import Node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';
import { __class } from './classes.js';
import Templates from './templates.js';
import Template from './template.js';

/* global document, window, __cometi18n, __cometdata, FileReader */

const DOCUMENT = document;

const WINDOW = window;

const TEMPLATESJS = new Templates();

const CORE = {
	saving: false,

	importing: false,

	save: function( ev, ui, input ){
		var name, _message, pp;

		ev.preventDefault();

		if( CORE.saving || !isNode( input ) || input.parentNode === null || ( pp = input.parentNode.parentNode ) === null ){
			return;

		}
		CORE.saving = true;
					//__bun.toggle( ui, true );

					if( !isString( name = input.value ) || ( name = ( stripTags( name ) ).trim() ).length < 1 ){
						_message = message( __cometi18n.messages.error.title, 400 );
						_message.remove_existing( pp );
						_message.appendTo( pp );
						CORE.saving = false;
						//__bun.toggle( ui, __cometi18n.ui.create );
						return;

					}

					Ajax({
						do: 'save',
						data: jsonEncode({
							post_title: encodeChars( name ),
							post_type: 'comet_mytemplates',
							post_content: '',
							meta: {},
							post_status: 'publish'
						})

					}).done(function( r ){
						var url, msg;

						CORE.saving = false;
						//__bun.toggle( ui, __cometi18n.ui.create );

						if( parseInt( r ) > 0 ){
							url = addQueryArgs( { post: r, action: 'edit', comet: 'template'  }, __cometdata.edit_url );
							msg = __cometi18n.messages.success.newTemplate + '<br>' + __cometi18n.messages.redirect;
							msg += ' <a href="' + encodeURI( url ) + '">' + __cometi18n.messages.editPage + '</a>.';
							message( msg, 200 ).set( pp );
							WINDOW.open( url, '_self' );
							return;

						}
						_message = message( __cometi18n.messages.error.default, 400 );
						_message.remove_existing( pp );
						_message.appendTo( pp );


					});

				},

				import: function( ev, ui, wrapper ){
					const files = ui.files;
					var importing, file, f, reader, fragment, button, items, item;

					if( CORE.importing || !files || files.length < 1 ){
						return;

					}
					CORE.importing = true;
					importing = files.length;
					fragment = DOCUMENT.createDocumentFragment();
					items = DOCUMENT.createElement( 'ul' );
					items.className = 'comet-import comet-items';

					button = DOCUMENT.createElement( 'button' );
					button.className = 'comet-button comet-button--primary';
					button.innerHTML = __cometi18n.ui.finish;

					fragment.appendChild( message( __cometi18n.messages.warning.import, 300 ).get() );
					fragment.appendChild( items );
					fragment.appendChild( button );

					for( f = 0; f < files.length; f++ ){

						if( !( file = files[f] ).type.match( 'json' ) ){
							continue;

						}
						reader = new FileReader();

						item = DOCUMENT.createElement( 'li' );
						item.className = 'comet-item comet-waitwhile';
						item.innerHTML = file.name + '<span class="cico cico-spin"></span>';
						items.appendChild( item );

						reader.onload = function( e ){
							var data;

							if( !( data = jsonDecode( e.target.result ) ) || !isObject( data ) || !isObject( data.meta ) ){
								return false;

							}

							Ajax({
								do: 'save',
								data: jsonEncode({
									post_title: isString( data.title ) ? data.title : isString( data.post_title ) ? data.post_title : 'Undefined',
									post_content: isString( data.content ) ? data.content : isString( data.post_content ) ? data.post_content : '',
									meta: isArray( data.meta ) ? {} : data.meta,
									post_type: 'comet_mytemplates',
									post_status: 'publish'

								})

							}).done(function( r ){
								const is_saved = ( parseInt( r ) > 0 );
								item.className = 'comet-item comet-' + ( is_saved ? 'success' : 'error' ); 
								item.lastChild.className = 'cico cico-' + ( is_saved ? 'check' : 'x' );
								importing--;

								if( importing === 0 ){
									CORE.importing = false;

								}

							});

						};
						reader.readAsText( file );

					}
					wrapper.innerHTML = '';
					wrapper.appendChild( fragment );

					Node( button ).on( 'click', function( ev_ ){
						ev_.preventDefault();

						if( importing !== 0 ){
							return;

						}
						//WINDOW.location.reload( true ); 

					});

				}

			};

			export default class MyTemplates {

				constructor ( response ){

					this.response = response;
					this.fragment = null;

					TEMPLATESJS.reset();

				}

				render (){
					var h_inner, b_inner, i, collection;

					TEMPLATESJS.setTemplates( this.response.templates );

					this.fragment = DOCUMENT.createDocumentFragment();

					this.header();
					this.body();


					return this.fragment;
				}

				header (){
					const header = DOCUMENT.createElement( 'div' );
					const C = ClassName( __class.hColumn );
					var inner;
					this.fragment.appendChild( header );


					inner = '<div class="' + C.combineWith( [ C.modifier( 'c1' ) ] ) + '">';
					inner += '<h4 class="' + __class.counter + '"></h4>';
					inner += '</div>';
					inner += '<div class="' + C.combineWith( [ C.modifier( 'c2' ) ] ) + '">';
					inner += '<div class="' + __class.import.main + '">';
					inner += '<input type="file" class="' + __class.import.files + '" multiple accept=".json" />';
					inner += '<button class="' + ClassName( __class.import.select ).combineWith( [ 'comet-button', 'comet-button--circle', 'comet-button--has-icon' ] ) + '" title="' + __cometi18n.ui.template.import + '">';
					inner += '<span class="comet-button__icon cico cico-import"></span>';
					inner += '</button>';
					inner += '</div>';
					inner += '<button class="' + ClassName( __class.button ).combineWith( [ 'comet-button', 'comet-button--primary', 'comet-button--circle', 'comet-button--has-icon' ] ) + '" title="' + __cometi18n.ui.template.new + '">';
					inner += '<span class="comet-button__icon cico cico-plus"></span>';
					inner += '</button>';
					inner += '</div>';

					header.className = __class.header;
					header.innerHTML = inner;

					TEMPLATESJS.setUi( 'counter', header.firstChild.firstChild );
					TEMPLATESJS.setUi( 'import', header.lastChild.firstChild.firstChild );
					TEMPLATESJS.setCounter();

					Node( header.lastChild.lastChild ).on( 'click', this.createNew );
					Node( header.lastChild.firstChild.lastChild ).on( 'click', this.import );

				}

				body (){
					const body = DOCUMENT.createElement( 'div' );
					const templates = TEMPLATESJS.getTemplates();
					var a = 0;

					this.fragment.appendChild( body );

					TEMPLATESJS.setUi( 'list', body );

					body.className = __class.list;

					for( a; a < templates.length; a++ ){
						new Template( a ).render();

					}

				}

				createNew ( ev ){
					const fragment = DOCUMENT.createDocumentFragment();
					const wrapper = DOCUMENT.createElement( 'div' );
					var inner;

					ev.preventDefault();

					wrapper.className = 'comet-savebox comet-wrapper';

					fragment.appendChild( wrapper );

					inner = '<div class="comet-saveform">';
					inner += '<input type="text" class="comet-input" value="" placeholder="' + __cometi18n.ui.name + '" />';
					inner += '<button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.create + '">' + __cometi18n.ui.create + '</button>';
					inner += '</div>';
					wrapper.innerHTML = inner;

					Node( wrapper.lastChild.lastChild ).on( 'click', CORE.save, wrapper.lastChild.firstChild );

					Modal({
						classes: 'comet-newtemplatebox',
						header: '<h4>' + __cometi18n.ui.newTemplate + '</h4>',
						content: fragment

					});

				}

				import (){

					const input = TEMPLATESJS.getUi( 'import' );
					var wrapper;

					if( !isNode( input ) ){
						return;

					}
					wrapper = DOCUMENT.createElement( 'div' );
					wrapper.className = 'comet-savebox comet-wrapper';
					wrapper.innerHTML = __cometi18n.messages.selFile;

					Modal({
						classes: 'comet-importbox',
						header: '<h4>' + __cometi18n.ui.impTemplate + '</h4>',
						content: wrapper,
					});
					Node( input ).on( 'change', CORE.import, wrapper );
					input.click();

				}

}