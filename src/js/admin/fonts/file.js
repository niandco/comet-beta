import { isString, isArray, isObject } from '../../utils/is.js';
import { getFontData } from './helpers.js';
import ajax from '../../utils/ajax.js';
import catchUrl from './catch-url.js';
import Fonts from './fonts.js';

const FONTSJS = new Fonts();

const CORE = {

	counter: {
		length: 0,
		count: 0,
		failed: 0

	},

	call: function( file ){
		const SELF = this;
		const rawFile = new XMLHttpRequest();

		rawFile.open( 'GET', file, true );

		rawFile.onreadystatechange = function(){
			var response, i, args, gdata;

			if( rawFile.readyState !== 4 ){
				return;

			}

			if( rawFile.status === 200 || rawFile.status === 0 ){
				response = SELF.catch.fonts( rawFile.responseText );

				if( isArray( response ) && response.length > 0 ){
					SELF.counter.length = response.length;
					SELF.counter.count = response.length;
					SELF.counter.failed = 0;

					for( i = 0; i < response.length; i++ ){

						args = {
							post_title: response[i].family,
							post_type: 'comet_fonts',
							post_status: 'publish',
							meta: response[i]
						};

						if( isObject( gdata = getFontData( response[i].family ) ) ){
							SELF.save( args, gdata.data.id, gdata.index );
							continue;

						}
						SELF.save( args, -1, -1 );

					}
					return;

				}

			}
			FONTSJS.setState( false );


			/* @TODO isMessagesBox */

			if( !isMessagesBox() ){
				return;

			}
			message( __cometi18n.messages.error.noFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );

		};

		rawFile.send( null );

	},

	save: function( font, id, index ){

		const SELF = this;

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
			SELF.counter.count--;

			console.log( response );

			if( ( id = parseInt( response ) ) < 1 ){
				SELF.counter.failed++;

				/* @TODO isMessagesBox */

				if( __core.utils.isMessagesBox() ){
					message( 'Failed to import ' + SELF.counter.failed + '/' + SELF.counter.length + ' fonts.', 400 ).set( __core.data.modal.fontBoxUi.messagesBox );

				}

			}else{
				args = {
					id,
					family: font.post_title,
					weight: font.meta.weight
				};

				if( index < 0 ){
					index = FONTSJS.count();
					//@TODO		__core.actions.addCard( args );

				}
				FONTSJS.setFont( index, args );
				//__core.data.collection[index] = args;
				//@TODO		__core.actions.addCss( args );

			}

			if( SELF.counter.count < 1 ){
				FONTSJS.setCounter();
				FONTSJS.setLoadTime();
				FONTSJS.isImport( false );
				//@TODO		FONTSJS.getModal.destroy();

			}


		});

	},

};

export default function( entry ){
	var r_url;

	if( !( r_url = catchUrl( entry ) ) ){
		FONTSJS.setState( false );
		message( __cometi18n.messages.error.unreachFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );
		return;

	}
	CORE.call( r_url );

}