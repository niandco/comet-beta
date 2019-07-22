import gradient from '../utils/gradient.js';
import sanitize from '../utils/sanitize.js';
import layout from '../utils/layout.js';
import utils from '../utils/utils.js';
import parse from '../utils/parse.js';
import node from '../utils/node.js';
import __data from './data.js';

/* global window, __cometdata */

const redefine = {

	gradient: function( comp ){
		const o = [];
		var _p, colors, c, fields, f, _color, val, _g, stop, encode;

		if( !node( comp ).isNode() || !( ( _p = node( comp.parentNode ) ).isNode() ) || ( colors = _p.prop().children ).length < 1 ){
			return false;

		}

		for( c in colors ){

			if( !( ( _color = node( colors[c] ) ).hasClass( 'comet-eGColor' ) ) || ( fields = _color.prop().children ).length < 1 ){
				continue;

			}

			for( f in fields ){

				if( !node( fields[f] ).hasClass( 'comet-fieldColor' ) || ( val = sanitize.color( fields[f].value ) ) === '' ){
					continue;

				}
				stop = !utils.isNumber( stop = parseInt( _color.prop().style.left ) ) || isNaN( stop ) ? 0 : stop;

				if( stop < 0 ){
					stop = 0;
				}
				if( stop > 100 ){
					stop = 100;
				}
				o[o.length] = {
					stop: stop,
					color: val
				};
			}
		}

		if( !( ( _g = node( _p.prop().parentNode ) ).isNode() ) || ( fields = _g.prop().children ).length < 1 ){
			return false;

		}
		encode = gradient.encode( o );

		for( f in fields ){

			if( !node( fields[f] ).hasClass( 'comet-field' ) ){
				continue;

			}
			fields[f].value = encode;

		}

	},

	columns: function( row ){
		const data_ = __data();
		const _row = node( row );
		var dren, c, width, id;

		if( !_row.isNode() ){
			return false;

		}
		row.dataset.ncol = 0;

		if( ( dren = _row.children( 'cpb-column' ) ).length < 1 ){
			return false;

		}
		row.dataset.ncol = dren.length;
		width = Number( 100 / dren.length ).toFixed( 2 );

		for( c = 0; c < dren.length; c++ ){

			if( !node( dren[c] ).isNode() || !( id = parse.dataset( dren[c], 'id' ) ) || !( id = parse.id( id ) ) ){
				continue;

			}
			data_.set( id, 'columns', { wsize: width } );
			layout( data_.getData(), 'css' ).column( id );

		}
	}

};

export default redefine;