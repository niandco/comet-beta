
/* global window */

const base64 = {

	encode: function( str ){
		return window.btoa( unescape( encodeURIComponent( str ) ) );
	},

	decode: function( str ){
		return decodeURIComponent( escape( window.atob( str ) ) );
	}
	
};

export default base64;