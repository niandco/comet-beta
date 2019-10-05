import { isNode, isFunction } from '../../utils/is.js';
import { convertHSB_HEX } from './convert.js';
import { LocalStorage } from './data.js';
import { strcolor } from './utils.js';
import Range from '../range/index.js';

export default function( selector, id ){


	if( !isNode( selector ) ){
		return;

	}

	Range( selector, {
		change: function( ev, ui, value ){
			const DATA = LocalStorage( id );
			const CURRENT = DATA.getObject();
			const vhue = value / 360;
			var color;

			if( !CURRENT ){
				return;

			}
			CURRENT.color.hsb[0] = vhue;
			CURRENT.cp.saturation.parentNode.style.backgroundColor = strcolor( 'hex', convertHSB_HEX( [ vhue, 1, 1 ] ) );

			color = DATA.setColor();

			if( isFunction( CURRENT.onchange ) ){
				CURRENT.onchange( CURRENT.source.node, color );

			}

		}
	});

}