import { generalSettings as GeneralSettings, notifications as Notifications } from '../stored.js';
import { encodeChars, jsonEncode, stripTags, escUrl } from '../../../utils/fill.js';
import { isBool, isNode, isString, isEmpty, isObject } from '../../../utils/is.js';
import { sanitizeContent } from '../../../utils/sanitize.js';
import { parseId } from '../../../utils/parse.js';
import message from '../../../utils/message.js';
import modal from '../../../utils/modal.js';
import node from '../../../dom/element.js';
import ajax from '../../../utils/ajax.js';
import { DATA } from '../../data.js';

const DOCUMENT = document;

export default {

	save: function( ev, ui ){

		var is_saving = false;

		const __core = {

			toggle: function( button, state ){
				const waitwhile = 'comet-waitwhile';
				const _button = node( button );

				if( !_button ){
					return;

				}

				if( isBool( state ) && state ){
					_button.addClass( waitwhile );
					return;

				}
				_button.removeClass( waitwhile );

			}

		};
		ev.preventDefault();

		(function(){
			var id, e_data;

			if( !( id = parseId( __cometdata.post_id ) ) || is_saving ){
				return;

			}
			is_saving = true;
			__core.toggle( ui, true );
			e_data = GeneralSettings().getFormData();
			e_data.meta = DATA.getData();
			e_data.post_content = sanitizeContent();

			ajax({
				do: 'save',
				id: id,
				data: jsonEncode( e_data )

			}).done(function( r ){
				var code = 400;
				var msg = __cometi18n.messages.error.savePost;

				if( parseInt( r ) > 0 ){
					msg = __cometi18n.messages.success.savePost;
					code = 200;

				}
				Notifications().add( msg, code );
				is_saving = false;
				__core.toggle( ui, false );

			});

		})();

	},

	saveAs: function( ev, ui ){


		var is_saving = false;

		const _d = document;

		const __core = {

			toggle: function( button, saving ){
				const waitwhile = 'comet-waitwhile';
				const _button = node( button );

				if( !_button ){
					return;

				}

				if( isBool( saving ) && saving ){
					_button.addClass( waitwhile );
					button.innerHTML = '<span class="cico cico-spin"></span>';
					return;

				}
				_button.removeClass( waitwhile );
				button.innerHTML = __cometi18n.ui.save;

			},

			save: function( ev, ui, edata ){
				const metaData = DATA.getData();
				var m = '';
				var _message, val, pp;
				
				ev.preventDefault();

				if( !isObject( edata ) || is_saving ){
					return;

				}
				is_saving = true;
				__core.toggle( ui, true );

				if( !isNode( edata.input ) ){
					m = __cometi18n.messages.error.savePost + '<br>';

				}

				if( !isObject( metaData ) || isEmpty( metaData._sections ) ){
					m = __cometi18n.messages.error.noContent + '<br>';

				}

				if( !isString( val = edata.input.value ) || isEmpty( val = ( stripTags( val ) ).trim() ) ){
					m += __cometi18n.messages.error.title;

				}

				if( m.length > 0 ){

					if( ui.parentNode !== null && ( pp = ui.parentNode.parentNode ) !== null ){
						_message = message( m, 400 );
						_message.remove_existing( pp );
						_message.appendTo( pp );

					}
					is_saving = false;
					__core.toggle( ui, false );
					return;

				}

				ajax({
					do: 'save',
					data: jsonEncode({
						post_title: encodeChars( val ),
						meta: metaData,
						post_content: sanitizeContent(),
						post_type: 'comet_mytemplates',
						post_status: 'publish'

					})

				}).done( function( r ){
					var code = 400;
					var msg = __cometi18n.messages.error.savePost;

					is_saving = false;
					__core.toggle( ui, false );

					if( parseInt( r ) > 0 ){
						msg = __cometi18n.messages.success.savePost;
						code = 200;

					}
					edata.modal.destroy();
					Notifications().add( msg, code );

				});

			},

		};
		ev.preventDefault();

		(function(){

			var mod = false;
			var content, inner, form;

			content = DOCUMENT.createElement( 'div' );
			content.className = 'comet-savebox comet-wrapper';

			inner = '<p>' + __cometi18n.messages.stemplate + ' <a href="' + escUrl( 'https://blacklead.fr/support/docs/comet/my-templates/' ) + '" target="_blank">' + __cometi18n.messages.rmtemplate + '</a>.</p>';
			inner += '<div class="comet-saveform">';
			inner += '<input type="text" class="comet-input comet-ui" placeholder="' + __cometi18n.ui.tempname + '" />';
			inner += '<button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.save + '">' + __cometi18n.ui.save + '</button>';
			inner += '</div>';

			content.innerHTML = inner;

			mod = modal({
				classes: 'comet-save-template',
				header: '<h4>' + __cometi18n.ui.saveTemplate + '</h4>',
				content: content

			});

			form = content.lastChild;

			node( form.lastChild ).on( 'click', __core.save, { input: form.firstChild, modal: mod } );
		})();

	}

};