import { isBool, isNode, isString, isObject, isArray } from '../utils/is.js';
import { jsonEncode, stripTags, encodeChars, escUrl } from '../utils/fill.js';
import { parseJson, parseDataset, parseId } from '../utils/parse.js';
import { addQueryArgs } from '../utils/url.js';
import message from '../utils/message.js';
import dialog from '../utils/dialog.js';
import modal from '../utils/modal.js';
import node from '../dom/element.js';
import ajax from '../utils/ajax.js';

/* global document, window, __cometi18n, __cometdata, FileReader, Blob */

/**
* @TODO: Rewrite
*
*/

const DOCUMENT = document;

const WINDOW = window;

export default function(){

	const __bun = {

		toggle: function( button, state ){
			const waitwhile = 'comet-waitwhile';

			if( !isNode( button ) ){
				return;

			}

			if( isBool( state ) && state ){
				node( button ).addClass( waitwhile );
				button.innerHTML = '<span class="cico cico-spin"></span>';
				return;

			}
			node( button ).removeClass( waitwhile );
			button.innerHTML = state;

		}

	};

	const __ = {

		create: function(){

			var is_saving = false;

			const nt = DOCUMENT.getElementById( 'comet-newTemplate' );

			const __core = {

				open: function( ev ){
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

					node( wrapper.lastChild.lastChild ).on( 'click', __core.save, wrapper.lastChild.firstChild );

					modal({
						classes: 'comet-newtemplatebox',
						header: '<h4>' + __cometi18n.ui.newTemplate + '</h4>',
						content: fragment

					});

				},

				save: function( ev, ui, input ){
					var name, _message, pp;

					ev.preventDefault();

					if( is_saving || !isNode( input ) || input.parentNode === null || ( pp = input.parentNode.parentNode ) === null ){
						return;

					}
					is_saving = true;
					__bun.toggle( ui, true );

					if( !isString( name = input.value ) || ( name = ( stripTags( name ) ).trim() ).length < 1 ){
						_message = message( __cometi18n.messages.error.title, 400 );
						_message.remove_existing( pp );
						_message.appendTo( pp );
						is_saving = false;
						__bun.toggle( ui, __cometi18n.ui.create );
						return;

					}

					ajax({
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

						is_saving = false;
						__bun.toggle( ui, __cometi18n.ui.create );

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

				}

			};

			if( !isNode( nt ) ){
				return;

			}
			node( nt ).on( 'click', __core.open );

		},

		delete: function(){

			var isDeleting = false;

			const nt = DOCUMENT.getElementsByClassName( 'comet-templateDelete' );

			const prop = {

				open: function( ev, ui ){
					var msg = false;
					var id;

					ev.preventDefault();

					if( !( id = parseDataset( ui, 'id' ) ) || !( id = parseId( id ) ) ){
						msg = __cometi18n.messages.error.noTemplate;

					}
					dialog({
						message: ( !msg ? __cometi18n.messages.warning.delete : msg ),
						confirm: prop.delete,
						data: {
							id: id,
							node: ui.parentNode.parentNode,
							error: ( !msg ? false : true )
						}
					});

				},

				delete: function( ev, ui, data ){
					ev.preventDefault();

					if( isDeleting || !isObject( data ) || ( isBool( data.error ) && data.error ) ){
						return;

					}
					isDeleting = true;
					data.dialog.destroy();

					ajax({
						do: 'dtemplate',
						id: data.id

					}).done(function( r ){
						isDeleting = false;

						if( [ 'false', 'FALSE', '0', 0 ].indexOf( r ) > -1 ){
							return;

						}
						WINDOW.location.reload( true );

					});


				}

			};

			if( !isNode( nt ) ){
				return;

			}
			node( nt ).on( 'click', prop.open );

		},

		import: function(){

			const nt = DOCUMENT.getElementById( 'comet-importTemplateBtn' );

			const __core = {

				open: function(){
					const input = DOCUMENT.getElementById( 'comet-importTemplateFile' );
					var wrapper;

					if( !isNode( input ) ){
						return;

					}
					wrapper = DOCUMENT.createElement( 'div' );
					wrapper.className = 'comet-savebox comet-wrapper';
					wrapper.innerHTML = __cometi18n.messages.selFile;

					modal({
						classes: 'comet-importbox',
						header: '<h4>' + __cometi18n.ui.impTemplate + '</h4>',
						content: wrapper,
					});
					node( input ).on( 'change', __core.import, wrapper );
					input.click();

				},

				import: function( ev, ui, wrapper ){
					const files = ui.files;
					var importing, file, f, reader, fragment, button, items, item;

					if( !files || files.length < 1 ){
						return;

					}
					importing = files.length;
					fragment = DOCUMENT.createDocumentFragment();
					items = DOCUMENT.createElement( 'ul' );
					items.className = 'comet-import comet-items';

					button = DOCUMENT.createElement( 'button' );
					button.className = 'comet-button comet-buttonPrimary';
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

							if( !( data = parseJson( e.target.result ) ) || !isObject( data ) || !isObject( data.meta ) ){
								return false;

							}

							ajax({
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

							});

						};
						reader.readAsText( file );

					}
					wrapper.innerHTML = '';
					wrapper.appendChild( fragment );

					node( button ).on( 'click', function( ev_ ){
						ev_.preventDefault();

						if( importing !== 0 ){
							return;

						}
						WINDOW.location.reload( true ); 

					});

				},

			};

			if( !isNode( nt ) ){
				return;

			}
			node( nt ).on( 'click', __core.open );

		},

		export: function(){

			var is_saving = false;

			const nt = DOCUMENT.getElementsByClassName( 'comet-templateExport' );

			const __core = {

				open: function( ev, ui ){
					var fragment = false;
					var wrapper, inner, id;

					ev.preventDefault();

					if(  !( id = parseDataset( ui, 'id' ) ) || !( id = parseId( id ) ) ){
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

					node( wrapper.firstChild.lastChild ).on( 'click', __core.export, { id: id, input: wrapper.firstChild.firstChild } );

					modal({
						classes: 'comet-exportbox',
						header: '<h4>' + __cometi18n.ui.expTemplate + '</h4>',
						content: fragment,
					});
				},

				export: function( ev, ui, edata ){
					var name, pp, _message;

					ev.preventDefault();

					if( is_saving || !isNode( edata.input ) || edata.input.parentNode === null || ( pp = edata.input.parentNode.parentNode ) === null ){
						return;

					}
					is_saving = true;
					__bun.toggle( ui, true );

					if( !isString( name = edata.input.value ) || ( name = ( stripTags( name ) ).trim() ).length < 1 ){
						_message = message( __cometi18n.messages.error.title, 400 );
						_message.remove_existing( pp );
						_message.appendTo( pp );
						is_saving = false;
						__bun.toggle( ui, __cometi18n.ui.export );
						return;

					}

					ajax({
						do: 'get',
						meta: true,
						id: edata.id,

					}).done(function( r ){
						var data, blob, msg, filename, json_data;

						is_saving = false;
						__bun.toggle( ui, __cometi18n.ui.export );

						if( !( data = parseJson( r ) ) || !isString( data.post_content ) || !isObject( data.meta ) ){
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

			if( !isNode( nt ) ){
				return;

			}
			node( nt ).on( 'click', __core.open );

		},

		preview: function(){

			const nt = DOCUMENT.getElementsByClassName( 'comet-templatePreview' );

			if( !isNode( nt ) ){
				return;

			}
			node( nt ).on( 'click', function( ev, ui ){
				const url = isString( ui.href ) ? ( stripTags( ui.href ) ).trim() : false;
				var inner = '<div>';
				
				ev.preventDefault();

				if( !url ){
					inner += '<div class="comet-msgbox">';
					inner += '<span class="cico cico-exclamation"></span>';
					inner += '<p>' + __cometi18n.messages.error.unreach + '</p>';
					inner += '</div>';

				}else{
					inner += '<iframe src="' + encodeURI( url ) + '"></iframe>';

				}
				inner += '</div>';

				modal({
					classes: 'comet-previewbox',
					header: '<h4>' + __cometi18n.ui.pTemplate + '</h4>',
					content: inner
				});
			});

		}

	};
	__.create();
	__.delete();
	__.import();
	__.export();
	__.preview();

}