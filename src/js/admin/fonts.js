import { isString, isObject, isArray, isNode, isBool } from '../utils/is.js';
import { capitalize, jsonEncode } from '../utils/fill.js';
import message from '../utils/message.js';
import dialog from '../utils/dialog.js';
import modal from '../utils/modal.js';
import ajax from '../utils/ajax.js';
import node from '../dom/element.js';

/* global document, __cometi18n, __cometdata, XMLHttpRequest */

/**
* @TODO: Rewrite
*
*/

const DOCUMENT = document;

export default function(){

	const __core = {

		data: {
			collection: [],
			counter: false,
			loadInfo: false,
			fontsBox: false,
			modal: false,
			isImporting: false,
			isDeleting: false,
			hasFonts: false,

		},

		file: function( entry ){

			const __file = {

				counter: {
					length: 0,
					count: 0,
					failed: 0

				},

				catch: {

					url: function(){
						var url;

						const __try = {

							regex: {
								import: /@import\s+url\(\s*'?"?([^'")]+)'?"?\s*\)\s*;/i,
								link: /<link[^>]*href="?'?([^'"]+)'?"?[^>/]*\/?>/i,
							},

							matching: function( type ){
								var m;

								type = isString( type ) ? ( type.toLowerCase() ).trim() : false;

								return ( !type || !( type in __try.regex ) || ( m = entry.match( __try.regex[type] ) ) === null || !isString( m[1] ) ? false : m[1].trim() );


							},

							import: function(){
								return __try.matching( 'import' );

							},

							link: function(){
								return __try.matching( 'link' );

							}

						};

						return ( isString( entry ) ? ( !( url = __try.link() ) ? ( !( url = __try.import() ) ? false : url ) : url ) : false );

					},

					fonts: function( raw ){

						const __try = {

							regex: {
								fontFace: /@font-face\s*\{[^}]+\}/gmi,
								fontFamily: /font-family:\s*(?:'|")?([^'";]+)(?:'|")?\s*;/i,
								fontWeight: /font-weight:\s*([a-z0-9\s]+)\s*;/i
							},

							matching: function( _raw, type ){
								var m;

								type = isString( type ) ? type.trim() : false;

								return ( !isString( _raw ) || !type || !( type in __try.regex ) || ( m = _raw.match( __try.regex[type] ) ) === null ? false : m );


							},

							fontFace: function( _raw ){
								const m = __try.matching( _raw, 'fontFace' );
								return ( !m || m.length < 1 ? false : m );

							},

							fontFamily: function( _raw ){
								const m = __try.matching( _raw, 'fontFamily' );
								return ( !m || !isString( m[1] ) ? false : m[1].trim() );

							},

							fontWeight: function( _raw ){
								const m = __try.matching( _raw, 'fontWeight' );
								return ( !m ? false : __fonts.sanitizeWeight( m[1] ) );

							}

						};

						const __fonts = {

							names: [],

							fonts: [],

							get: function(){
								var ff, i, wei, fam;

								if( !( ff = __try.fontFace( raw ) ) ){
									return false;

								}

								for( i = 0; i < ff.length; i++ ){

									if( !( wei = __try.fontWeight( ff[i] ) ) || !( fam = __try.fontFamily( ff[i] ) ) ){
										continue;

									}
									__fonts.addFont( fam, wei, ff[i] );

								}
								return __fonts.fonts;

							},

							addFont: function( family, weight, _raw ){
								var index = __fonts.names.indexOf( family );
								var __raw;

								if( index < 0 ){
									index = __fonts.fonts.length;
									__fonts.names[index] = family;
									__fonts.fonts[index] = {
										family: family,
										weight: {}
									};

								}

								if( !isObject( __fonts.fonts[index].weight ) || isArray( __fonts.fonts[index].weight ) ){
									__fonts.fonts[index].weight = {};

								}

								if( isString( _raw ) ){
									__raw = isString( __raw = __fonts.fonts[index].weight[weight] ) ? __raw : '';
									__fonts.fonts[index].weight[weight] = __raw + _raw;

								}
								return index;

							},

							sanitizeWeight: function( weight ){

								weight = isString( weight ) ? ( weight.toLowerCase() ).trim() : weight;

								switch( weight ){

									case 'thin':
									case 'hairline':
									case '100':
									case 100:
									return 100;

									case 'extra light':
									case 'ultra light':
									case '200':
									case 200:
									return 200;

									case 'light':
									case '300':
									case 300:
									return 300;

									case 'normal':
									case '400':
									case 400:
									return 400;

									case 'medium':
									case '500':
									case 500:
									return 500;

									case 'semi bold':
									case 'demi bold':
									case '600':
									case 600:
									return 600;

									case 'bold':
									case '700':
									case 700:
									return 700;

									case 'extra bold':
									case 'ultra bold':
									case '800':
									case 800:
									return 800;

									case 'black':
									case 'heavy':
									case '900':
									case 900:
									return 900;

									default:
									return false;

								}


							}

						};

						return isString( raw ) ? __fonts.get() : false;

					}


				},

				call: function( file ){
					const rawFile = new XMLHttpRequest();

					rawFile.open( 'GET', file, true );
					rawFile.onreadystatechange = function(){
						var response, i, args, gdata;
						
						if( rawFile.readyState !== 4 ){
							return;

						}

						if( rawFile.status === 200 || rawFile.status === 0 ){
							response = __file.catch.fonts( rawFile.responseText );

							if( isArray( response ) && response.length > 0 ){
								__file.counter.length = response.length;
								__file.counter.count = response.length;
								__file.counter.failed = 0;

								for( i = 0; i < response.length; i++ ){

									args = {
										post_title: response[i].family,
										post_type: 'comet_fonts',
										post_status: 'publish',
										meta: response[i]
									};

									if( isObject( gdata = __core.utils.getFontData( response[i].family ) ) ){
										__file.save( args, gdata.data.id, gdata.index );
										continue;

									}
									__file.save( args, -1, -1 );

								}
								return;

							}

						}
						__core.actions.set.state( false );

						if( !__core.utils.isMessagesBox() ){
							return;

						}
						message( __cometi18n.messages.error.noFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );

					};
					rawFile.send( null );

				},

				save: function( font, id, index ){

					const _data = {
						do: 'save',
						data: jsonEncode( font )

					};

					if( id > 0 ){
						_data.id = id;

					}
					console.log( font );

					ajax( _data ).done(function( response ){
						var args;
						__file.counter.count--;

						console.log( response );

						if( ( id = parseInt( response ) ) < 1 ){
							__file.counter.failed++;

							if( __core.utils.isMessagesBox() ){
								message( 'Failed to import ' + __file.counter.failed + '/' + __file.counter.length + ' fonts.', 400 ).set( __core.data.modal.fontBoxUi.messagesBox );

							}

						}else{
							args = {
								id: id,
								family: font.post_title,
								weight: font.meta.weight
							};

							if( index < 0 ){
								index = __core.data.collection.length;
								__core.actions.addCard( args );

							}
							__core.data.collection[index] = args;
							__core.actions.addCss( args );

						}

						if( __file.counter.count < 1 ){
							__core.actions.set.counter();
							__core.actions.set.loadTime();
							__core.data.isImporting = false;
							__core.data.modal.destroy();

						}


					});

				},

			};

			var r_url;

			if( !( r_url = __file.catch.url() ) ){
				__core.actions.set.state( false );
				message( __cometi18n.messages.error.unreachFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );
				return;

			}
			__file.call( r_url );


		},

		utils: {

			resourceTypes: {
				google: 'Google Fonts',
				typeKit: 'TypeKit',
				typography: 'Typography.com (H&Co)',
				custom: __cometi18n.ui.custom

			},

			is_resource: function( value ){
				return ( isString( value ) && value in __core.utils.resourceTypes );

			},

			isMessagesBox: function(){
				return ( !__core.data.modal && isNode( __core.data.modal.fontBoxUi.messagesBox ) );

			},

			getFontData: function( entry ){
				var collection, i, isId;

				__core.data.collection = !isArray( __core.data.collection ) ? [] : __core.data.collection;
				collection = __core.data.collection;
				entry = ( isId = entry > 0 ) || isString( entry ) ? entry : false;

				if( false ){
					return false;

				}

				for( i = 0; i < collection.length; i++ ){

					if( ( isId && entry === parseInt( collection[i].id ) ) || ( collection[i].family === entry ) ){
						return {
							index: i,
							data: collection[i]
						};

					}

				}
				return false;

			}

		},

		actions: {

			add: function( ev ){
				const fragment = DOCUMENT.createDocumentFragment();
				const wrapper = DOCUMENT.createElement( 'div' );
				var inner, wfields;

				ev.preventDefault();

				wrapper.className = 'comet-savebox comet-wrapper';

				fragment.appendChild( wrapper );

				inner = '<div class="comet-messages comet-wrapper"></div>';

				inner += '<div class="comet-saveform">';
				inner += '<label>';
				inner += '<p>' + __cometi18n.ui.resource + '</p>';
				inner += '<select class="comet-input comet-capture" name="resource">';
				inner += '<option value="google">Google Fonts</option>';
				inner += '<option value="typeKit">TypeKit</option>';
				inner += '<option value="typography">Typography.com (H&Co)</option>';
				//inner += '<option value="custom">' + __cometi18n.ui.custom + '</option>';
				inner += '</select>';
				inner += '</label>';

				inner += '<label>';
				inner += '<p>' + __cometi18n.ui.embed + '</p>';
				inner += '<textarea class="comet-input comet-capture" name="embed"></textarea>';
				inner += '</label>';

				inner += '<button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.import + '">' + __cometi18n.ui.import + '</button>';
				inner += '</div>';
				wrapper.innerHTML = inner;

				wfields = wrapper.lastChild.children;

				node( wrapper.lastChild.lastChild ).on(
					'click',
					__core.actions.import,
					{
						resource: wfields[0].lastChild,
						embed: wfields[1].lastChild
					}
					);

				__core.data.modal = modal({
					classes: 'comet-fontbox',
					header: '<h4>' + __cometi18n.ui.addFont + '</h4>',
					content: fragment,
					done: function(){

						if( __core.data.isImporting ){
							return 1;

						}
						__core.data.modal = false;

					}

				});

				__core.data.modal.fontBoxUi = {
					box: wrapper,
					import: wrapper.lastChild.lastChild,
					messagesBox: wrapper.firstChild

				};


			},

			remove: function( ev, ui, _data ){

				ev.preventDefault();

				if( __core.data.isDeleting ){
					return;

				}

				dialog({
					message: __cometi18n.messages.warning.delete,
					ui: {
						done: __cometi18n.ui.delete
					},  
					confirm: function( ev_, ui_, dialog_ ){
						var done_;

						if( __core.data.isDeleting ){
							return;

						}
						done_ = node( dialog_.dialog.buttonset.done );
						__core.data.isDeleting = true;
						dialog_.dialog.buttonset.cancel.style.display = 'none';
						dialog_.dialog.buttonset.done.innerHTML = '<span class="cico cico-spin"></span>';
						done_.addClass( 'comet-waitwhile' );

						ajax({
							do: 'dtemplate',
							id: _data.id

						}).done(function( response ){
							var msg = __cometi18n.messages.error.delFont;
							var code = 400;
							var gdata;
							__core.data.isDeleting = false;
							dialog_.dialog.buttonset.cancel.className = 'comet-button comet-buttonPrimary comet-cancel';
							dialog_.dialog.buttonset.cancel.style.display = 'inline-block';
							dialog_.dialog.buttonset.cancel.innerHTML = __cometi18n.ui.done;
							done_.remove();

							if( parseInt( response ) === 1 ){

								if( _data.card.parentNode !== null ){
									_data.card.parentNode.removeChild( _data.card );

								}

								if( isObject( gdata = __core.utils.getFontData( _data.id ) ) ){
									__core.data.collection.splice( gdata.index, 1 );

								}
								__core.actions.set.counter();
								__core.actions.set.loadTime();
								msg = __cometi18n.messages.success.delFont;
								code = 200;

							}
							message( msg, code ).set( dialog_.dialog.textbox );

						});

					}
				});


			},

			import: function( ev, ui, _data ){

				ev.preventDefault();

				if( __core.data.isImporting ){
					return;

				}
				__core.actions.set.state( true );

				if( !__core.utils.is_resource( _data.resource.value ) ){
					//@TODO: error
					return;

				}

				if( !isString( _data.embed.value ) ){
					//@TODO: error
					return;

				}
				__core.file( _data.embed.value );

			},

			set: {
				counter: function(){
					const count = __core.data.collection.length;

					if( count === 1 ){
						__core.data.counter.innerHTML = count + ' font family';
						return;
						
					}
					__core.data.counter.innerHTML = count + ' font families';

				},

				loadTime: function(){
					const count = __core.data.collection.length;
					var state = 'Slow';
					var classes = 'comet-gauge comet-indicator';

					if( count <= 2 ){
						state = 'Fast';
						classes += ' is-fast';


					}else if( count <= 4 ){
						state = 'Moderate';
						classes += ' is-moderate'; 

					}else{
						state = 'Slow';
						classes += ' is-slow';

					}
					__core.data.loadInfo.className = classes;
					__core.data.loadInfo.innerHTML = 'Load time: ' + state;

				},

				state: function( importing ){
					const button = __core.data.modal.fontBoxUi.import;
					importing = ( isBool( importing ) && importing );
					__core.data.isImporting = importing;

					if( !isNode( button ) ){
						return false;

					}

					if( importing ){
						node( button ).addClass( 'comet-waitwhile' );
						button.innerHTML = '<span class="cico cico-spin"></span>';
						return true;

					}
					node( button ).removeClass( 'comet-waitwhile' );
					button.innerHTML = __cometi18n.ui.import;
					return true;

				}

			},

			addCard: function( data ){
				const fragment = DOCUMENT.createDocumentFragment();
				const card = DOCUMENT.createElement( 'div' );
				const name = isObject( data ) && isString( data.family ) ? data.family : false;
				var inner, count;

				if( !name ){
					return;

				}
				count = isArray( data.weight ) ? data.weight.length : ( isObject( data.weight ) ? Object.keys( data.weight ).length : 0 );
				fragment.appendChild( card );
				inner = '<div class="comet-previewbox comet-sampletext">';
				inner += '<p class="comet-inner comet-text" style="font-family:' + name + ';">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>';
				inner += '</div>';
				inner += '<div class="comet-info comet-wrapper">';
				inner += '<div class="comet-fontinfo">';
				inner += '<span class="comet-fontname">' + capitalize( name ) + '</span>';
				inner += '<span class="comet-fontstyle">' + ( count === 1 ? '1 style' : count + ' styles' ) + '</span>';
				inner += '</div>';
				inner += '<div class="comet-actions comet-ui">';
				inner += '<button class="comet-button" title="' + __cometi18n.ui.delete + '"><span class="cico cico-trash"></span></button>';
				inner += '</div>';
				inner += '</div>';
				card.className = 'comet-font comet-wrapper comet-card';
				card.innerHTML = inner;

				node( card.lastChild.lastChild.firstChild ).on( 'click', __core.actions.remove, { card: card, id: data.id } );

				if( !__core.data.hasFonts ){
					__core.data.fontsBox.innerHTML = '';
					__core.data.hasFonts = true;

				}
				__core.data.fontsBox.appendChild( card );


			},

			addCss: function( data ){
				var css, inner, i;

				if( !isObject( data ) || !isObject( data.weight ) ){
					return;

				}
				inner = '';

				for( i in data.weight ){

					if( isString( data.weight[i] ) ){
						inner += data.weight[i];

					}

				}
				css = DOCUMENT.createElement( 'style' );
				css.type = 'text/css';
				css.innerHTML = inner;
				DOCUMENT.head.appendChild( css );

			},

			svg: function( slug ){

				const icons = {

					heart: function(){
						var icon = '';

						icon += '<g>';
						icon += '<path d="M111.7,24.7L111.7,24.7C101,14 83.6,14 72.8,24.7L64,33.6L55.2,24.8C44.4,14 27,14 16.3,24.7L16.3,24.7C5.6,35.4 5.6,52.9 16.3,63.6L57,104.3C60.9,108.2 67.2,108.2 71.1,104.3L111.8,63.6C122.5,52.9 122.5,35.5 111.7,24.7z" fill="#ff5576" stroke-dasharray="none"></path>';
						icon += '<path d="M64,110.2C60.5,110.2 57.3,108.8 54.8,106.4L41.5,93.1C40.3,91.9 40.3,90 41.5,88.9C42.7,87.7 44.6,87.7 45.7,88.9L59,102.2C60.3,103.5 62.1,104.2 63.9,104.2S67.5,103.5 68.9,102.2L109.6,61.5C114.2,56.9 116.8,50.7 116.8,44.2S114.3,31.5 109.6,26.9C100,17.3 84.5,17.3 75,26.9L66.2,35.7C65,36.9 63.1,36.9 62,35.7L53,26.8C48.4,22.2 42.2,19.6 35.7,19.6C29.2,19.6 23,22.1 18.4,26.8C13.8,31.4 11.2,37.6 11.2,44.1S13.7,56.8 18.4,61.4L25.6,68.6C26.8,69.8 26.8,71.7 25.6,72.8C24.4,74 22.5,74 21.4,72.8L14.2,65.6C8.4,60 5.2,52.3 5.2,44.2S8.4,28.4 14.1,22.6C19.9,16.8 27.5,13.7 35.7,13.7S51.5,16.9 57.3,22.6L64,29.3L70.7,22.6C76.5,16.8 84.1,13.7 92.3,13.7S108.1,16.9 113.9,22.6C119.7,28.4 122.8,36 122.8,44.2S119.6,60 113.9,65.8L73.2,106.5C70.7,108.8 67.5,110.2 64,110.2z" fill="#444b54"></path>';
						icon += '</g>';

						return icon;

					},

					add: function(){
						var icon = '';

						icon += '<g>';
						icon += '<path d="M64,24L64,24C58.5,24 54,28.5 54,34L54,54L34,54C28.5,54 24,58.5 24,64L24,64C24,69.5 28.5,74 34,74L54,74L54,94C54,99.5 58.5,104 64,104L64,104C69.5,104 74,99.5 74,94L74,74L94,74C99.5,74 104,69.5 104,64L104,64C104,58.5 99.5,54 94,54L74,54L74,34C74,28.5 69.5,24 64,24z" fill="#006afe" stroke-dasharray="none" fill-opacity="1"></path>';
						icon += '<path d="M64,107C56.8,107 51,101.2 51,94L51,77L34,77C26.8,77 21,71.2 21,64S26.8,51 34,51C35.7,51 37,52.3 37,54S35.7,57 34,57C30.1,57 27,60.1 27,64S30.1,71 34,71L54,71C55.7,71 57,72.3 57,74L57,94C57,97.9 60.1,101 64,101S71,97.9 71,94L71,74C71,72.3 72.3,71 74,71L94,71C97.9,71 101,67.9 101,64S97.9,57 94,57L74,57C72.3,57 71,55.7 71,54L71,34C71,30.1 67.9,27 64,27S57,30.1 57,34L57,54C57,55.7 55.7,57 54,57S51,55.7 51,54L51,34C51,26.8 56.8,21 64,21S77,26.8 77,34L77,51L94,51C101.2,51 107,56.8 107,64S101.2,77 94,77L77,77L77,94C77,101.2 71.2,107 64,107z" fill="#444b54"></path>';
						icon += '</g>';

						return icon;

					},

					check: function(){
						var icon = '';

						icon += '<g>';
						icon += '<path d="M24.4,56L24.4,56C28.3,52.1 34.6,52.1 38.5,56L49.1,66.6L83.8,31.9C87.7,28 94,28 97.9,31.9L97.9,31.9C101.8,35.8 101.8,42.1 97.9,46L56.3,87.8C52.4,91.7 46.1,91.7 42.2,87.8L24.4,70.2C20.5,66.3 20.5,59.9 24.4,56z" fill="#adf9d2"></path>';
						icon += '<path d="M49.2,93.8L49.2,93.8C45.7,93.8 42.5,92.4 40,90L22.3,72.3C17.2,67.2 17.2,59 22.3,53.9C22.3,53.9 22.3,53.9 22.3,53.9C27.4,48.8 35.6,48.8 40.7,53.9L49.2,62.4L81.8,29.8C86.9,24.7 95.1,24.7 100.2,29.8C105.3,34.9 105.3,43.1 100.2,48.2L58.4,90C55.9,92.4 52.7,93.8 49.2,93.8zM26.6,58.1C23.9,60.8 23.9,65.3 26.6,68L44.3,85.7C45.6,87 47.4,87.8 49.3,87.8C51.2,87.8 52.9,87.1 54.2,85.8L96,44C98.7,41.3 98.7,36.8 96,34.1C93.3,31.4 88.8,31.4 86.1,34.1L51.3,68.7C50.1,69.9 48.2,69.9 47.1,68.7L36.5,58.1C33.7,55.4 29.3,55.4 26.6,58.1L26.6,58.1z" fill="#444b54"></path>';
						icon += '</g>';

						return icon;

					}

				};

				if( !( slug in icons ) ){
					return '';

				}
				return '<svg xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" width="128" height="128">' + icons[slug]() + '</svg>';
				

			}

		}

	};

	(function(){
		const source = DOCUMENT.getElementById( 'comet-sourceframe8679171600336466' );
		var fragment, header, h_inner, b_inner, body, i;

		if( source === null || source.parentNode === null ){
			return;

		}
		__core.data.collection = isArray( __cometdata.fonts ) ? __cometdata.fonts : [];
		fragment = DOCUMENT.createDocumentFragment();
		header = DOCUMENT.createElement( 'div' );
		header.className = 'comet-header comet-top comet-wrapper';

		h_inner = '<div class="comet-column">';
		h_inner += '<h4></h4>';
		h_inner += '<span class="comet-gauge comet-indicator is-slow"></span>';
		h_inner += '</div>';
		h_inner += '<div class="comet-column">';
		h_inner += '<button class="comet-button comet-buttonPrimary" title="' + __cometi18n.ui.addFont + '"><span class="cico cico-plus"></span></button>';
		h_inner += '</div>';

		header.innerHTML = h_inner;

		body = DOCUMENT.createElement( 'div' );
		body.className = 'comet-body comet-fontslist comet-wrapper';

		fragment.appendChild( header );
		fragment.appendChild( body );

		node( header.lastChild.firstChild ).on( 'click', __core.actions.add );

		__core.data.counter = header.firstChild.firstChild;
		__core.data.loadInfo = header.firstChild.lastChild;
		__core.data.fontsBox = body;

		if( __core.data.collection.length > 0 ){
			__core.data.hasFonts = true;

			for( i = 0; i < __core.data.collection.length; i++ ){
				__core.actions.addCard( __core.data.collection[i] );
				__core.actions.addCss( __core.data.collection[i] );

			}

		}else{
			__core.data.hasFonts = false;
			b_inner = '<div class="comet-introduction comet-tutorial">';
			b_inner += '<h2>' + __cometi18n.messages.error.noFonts + '</h2>';
			b_inner += '<p>' + __cometi18n.messages.selFonts1 + '<br>' + __cometi18n.messages.selFonts2 + '</p>';
			b_inner += '<div class="comet-row">';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'heart' ) + '</figure>';
			b_inner += '<h4>Browsering</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt1 + '</p>';
			b_inner += '</div>';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'add' ) + '</figure>';
			b_inner += '<h4>Importing</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt2 + '</p>';
			b_inner += '</div>';
			b_inner += '<div class="comet-column">';
			b_inner += '<figure>' + __core.actions.svg( 'check' ) + '</figure>';
			b_inner += '<h4>Using</h4>';
			b_inner += '<p>' + __cometi18n.messages.fontSt3 + '</p>';
			b_inner += '</div>';
			b_inner += '</div>';
			b_inner += '</div>';
			body.innerHTML = b_inner;

		}
		source.parentNode.replaceChild( fragment, source );
		__core.actions.set.loadTime();
		__core.actions.set.counter();


	})();

}