import { isNode, isFunction } from '../../utils/is.js';
import { LocalStorage } from './data.js';
import { parseColor } from './parse.js';
import node from '../../dom/element.js';

const CORE = {

	input: function( ev, ui, id ){
		const DATA = LocalStorage( id );
		const CURRENT = DATA.getObject();
		const value = ui.value;
		var color, colorObject;

		ev.preventDefault();

		if( !CURRENT || !( colorObject = parseColor( value ) ) ){
			return;

		}
		CURRENT.color = colorObject;
		color = DATA.setColor();

		if( isFunction( CURRENT.onchange ) ){
			CURRENT.onchange( CURRENT.source.node, color );

		}

	}

};

export default function( selector, id ){

	if( !isNode( selector ) ){
		return;

	}
	node( selector ).on( 'input', CORE.input, id );

}