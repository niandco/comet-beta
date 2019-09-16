import { isString } from '../../utils/is.js';

const REGEX = {
	import: /@import\s+url\(\s*'?"?([^'")]+)'?"?\s*\)\s*;/i,
	link: /<link[^>]*href="?'?([^'"]+)'?"?[^>/]*\/?>/i,

};

const TRY = {

	matching: function( type, entry ){
		var m;

		type = isString( type ) ? ( type.toLowerCase() ).trim() : false;

		return ( !type || !( type in REGEX ) || ( m = entry.match( REGEX[type] ) ) === null || !isString( m[1] ) ? false : m[1].trim() );


	},

	import: function( entry ){
		return this.matching( 'import', entry );

	},

	link: function( entry ){
		return this.matching( 'link', entry );

	}

};

export default function( entry ){
	var url;

	return ( isString( entry ) ? ( !( url = TRY.link( entry ) ) ? ( !( url = TRY.import( entry ) ) ? false : url ) : url ) : false );

}