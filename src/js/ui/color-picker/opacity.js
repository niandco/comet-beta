import { isNode, isFunction } from '../../utils/is.js';
import { LocalStorage } from './data.js';
import { parseValue } from './parse.js';
import Range from '../range/index.js';


export default function( selector, id ){

	if( !isNode( selector ) ){
		return;

	}

	Range( selector, {
		change: function( ev, ui, value ){
			const DATA = LocalStorage( id );
			const CURRENT = DATA.getObject();
			const alpha = parseValue( value, 0, 1, 1, true );
			var color;

			if( !CURRENT ){
				return;
				
			}
			CURRENT.color.hsb[3] = alpha;
			CURRENT.color.alpha = alpha;

			color = DATA.setColor();

			if( isFunction( CURRENT.onchange ) ){
				CURRENT.onchange( CURRENT.source.node, color );

			}

		}
	});

}