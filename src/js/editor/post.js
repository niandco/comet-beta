import { isString, isBool, isEmpty } from '../utils/is.js';
import { sanitizeNumber } from '../utils/sanitize.js';
import { stripTags } from '../utils/fill.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	tags: [ 'img', 'video', 'audio', 'p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'ul', 'ol' ],

	allowedTags: '<span><br><del><u><strike><i><em><b><strong><ins><a><code><var><samp><kbd>',

};

const ELEMENTS = {

	img: function( current ){
		var tmp;

		if( !current ){
			return false;

		}

		return {
			img: ( isString( tmp = current.src ) ? ( stripTags( tmp ) ).trim() : '' ),
			alt: ( isString( tmp = current.alt ) ? ( stripTags( tmp ) ).trim() : '' ),
			cap: ( isString( tmp = current.title ) ? ( stripTags( tmp ) ).trim() : '' ),
			_type: 'image'

		};

	},

	ul: function( current, isOl ){
		const items = [];
		var tmp, i, citems;

		if( !current || ( citems = current.children ).length < 1 ){
			return false;

		}

		for( i = 0; i < citems; i++ ){

			if( !isString( tmp = citems[i].nodeName ) || ( tmp.toLowerCase() ).trim() !== 'li' ){
				continue;

			}
			items[items.length] = {
				ctnt: ( isString( tmp = citems[i].innerHTML ) ? ( stripTags( tmp, allowed ) ).trim() : '' )

			};

		}
		isOl = isBool( isOl ) && isOl;

		return {
			sty: isOl ? 'decimal' : 'disc',
			_items: items,
			_type: 'listItems'
			
		};

	},

	default: function( current, tag ){
		var tmp;

		if( !current || [ 'p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre' ].indexOf( tag ) < 0 ){
			return false;

		}

		return {
			tag: tag,
			content: ( isString( tmp = current.innerHTML ) ? ( stripTags( tmp, allowed ) ).trim() : '' ),
			_type: 'text'

		};

	},

	video: function( current ){
		var tmp;

		if( !current ){
			return false;

		}

		return {
			type: 'c',
			url: ( isString( tmp = current.src ) ? ( stripTags( tmp ) ).trim() : '' ),
			he: sanitizeNumber({ value: current.getAttribute( 'height' ) } ),
			wi: sanitizeNumber({ value: current.getAttribute( 'width' ) } ),
			_type: 'video'

		};

	},

	audio: function( current ){
		var tmp;

		if( !current ){
			return false;

		}

		return {
			url: ( isString( tmp = current.src ) ? ( stripTags( tmp ) ).trim() : '' ),
			_type: 'audio'

		};

	}

};

export default function( entry ){
	var fragment, div;

	const data = [];

	if( !isString( entry ) || isEmpty( entry ) ){
		return false;

	}
	fragment = DOCUMENT.createDocumentFragment();
	div = DOCUMENT.createElement( 'div' );
	div.innerHTML = entry;
	fragment.appendChild( div );

	CORE.tags.forEach( function( tag ){
		const get = div.getElementsByTagName( tag );
		var i, nname, current, tmp;

		if( get.length < 1 ){
			return;

		}

		for( i = 0; i < get.length; i++ ){

			if( !isString( ( current = get[i] ).nodeName ) ){
				continue;

			}
			nname = ( current.nodeName.toLowerCase() ).trim();

			if( nname === 'ol' ){
				tmp = ELEMENTS.ul( current, true );

			}else if( nname in _priv ){
				tmp = ELEMENTS[nname]( current );

			}else{
				tmp = ELEMENTS.default( current, nname );

			}

			if( !tmp ){
				continue;

			}
			data[data.length] = tmp;

		}

	});
	return data;

}
