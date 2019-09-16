import { isString, isArray, isObject } from '../../utils/is.js';
import { jsonEncode } from '../../utils/fill.js';
import ajax from '../../utils/ajax.js';
import catchUrl from './catch-url.js';
import Fontui from './font-ui.js';
import decode from './decode.js';
import Fonts from './fonts.js';

const FONTSJS = new Fonts();

const FONTUI = new Fontui();

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
				response = decode( rawFile.responseText );

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

						if( isObject( gdata = FONTSJS.getFontBy( 'name', response[i].family ) ) ){
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

			/*if( !isMessagesBox() ){
				return;

			}
			message( __cometi18n.messages.error.noFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );*/

		};

		rawFile.send( null );

	},

	save: function( font, id, index ){

		const SELF = this;

		const data = {
			do: 'save',
			data: jsonEncode( font, true )

		};

		if( id > 0 ){
			data.id = id;

		}

		ajax( data ).done(function( response ){
			var args;
			SELF.counter.count--;

			if( ( id = parseInt( response ) ) < 1 ){
				SELF.counter.failed++;

				/* @TODO isMessagesBox */

				/*if( __core.utils.isMessagesBox() ){
					message( 'Failed to import ' + SELF.counter.failed + '/' + SELF.counter.length + ' fonts.', 400 ).set( __core.data.modal.fontBoxUi.messagesBox );

				}*/

			}else{

				args = {
					id,
					family: font.post_title,
					weight: font.meta.weight
				};
				console.log( index );
				FONTSJS.setFont( index, args, true );

				if( index < 0 ){
					FONTUI.html( args );

				}
				FONTUI.css( args );

			}

			if( SELF.counter.count < 1 ){
				FONTSJS.setCounter();
				FONTSJS.setLoadTime();
				FONTSJS.setImport( false );
				FONTSJS.getModal().destroy();

			}


		});

	},

};

export default function( entry ){
	var r_url;

	if( !( r_url = catchUrl( entry ) ) ){
		FONTSJS.setState( false );
		//message( __cometi18n.messages.error.unreachFont, 400 ).set( __core.data.modal.fontBoxUi.messagesBox );
		return;

	}
	CORE.call( r_url );

}