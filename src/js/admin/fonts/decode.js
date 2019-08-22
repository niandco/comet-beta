import { isObject, isString, isArray } from '../../utils/is.js';

const REGEX = {
	fontFace: /@font-face\s*\{[^}]+\}/gmi,
	fontFamily: /font-family:\s*(?:'|")?([^'";]+)(?:'|")?\s*;/i,
	fontWeight: /font-weight:\s*([a-z0-9\s]+)\s*;/i

};

const TRY = {

	matching: function( raw, type ){
		var m;

		type = isString( type ) ? type.trim() : false;

		return ( !isString( raw ) || !type || !( type in REGEX ) || ( m = raw.match( REGEX[type] ) ) === null ? false : m );


	},

	fontFace: function( raw ){
		const m = this.matching( raw, 'fontFace' );
		return ( !m || m.length < 1 ? false : m );

	},

	fontFamily: function( raw ){
		const m = this.matching( raw, 'fontFamily' );
		return ( !m || !isString( m[1] ) ? false : m[1].trim() );

	},

	fontWeight: function( raw ){
		const m = this.matching( raw, 'fontWeight' );
		return ( !m ? false : CORE.sanitizeWeight( m[1] ) );

	}

};

const CORE = {

	names: [],

	fonts: [],

	addFont: function( family, weight, raw ){
		var index = this.names.indexOf( family );
		var __raw;

		if( index < 0 ){
			index = this.fonts.length;
			this.names[index] = family;
			this.fonts[index] = {
				family: family,
				weight: {}
			};

		}

		if( !isObject( this.fonts[index].weight ) || isArray( this.fonts[index].weight ) ){
			this.fonts[index].weight = {};

		}

		if( isString( raw ) ){
			__raw = isString( __raw = this.fonts[index].weight[weight] ) ? __raw : '';
			this.fonts[index].weight[weight] = __raw + raw;

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

export default function( raw ){
	var ff, i, wei, fam;



	if( !isString( raw ) || !( ff = TRY.fontFace( raw ) ) ){
		return false;

	}

	for( i = 0; i < ff.length; i++ ){

		if( !( wei = TRY.fontWeight( ff[i] ) ) || !( fam = TRY.fontFamily( ff[i] ) ) ){
			continue;

		}
		CORE.addFont( fam, wei, ff[i] );

	}
	return CORE.fonts;

}