import { isNumber, isFunction, isNode, isObject } from '../../utils/is.js';
import { LocalStorage } from './data.js';
import node from '../../dom/element.js';

const CORE = { 

	saturation: function( ev, ui, id ){
		const DATA = LocalStorage( id );
		const CURRENT = DATA.getObject();
		const type = ev.type;
		var color = '';
		var dt, satNode, dx, dy, x, y, rec, width, height, dw, s, b, px, py, dw2;

		if( !CURRENT || !isObject( CURRENT.cp ) ){
			return;

		}
		ev.preventDefault();
		ev.stopPropagation();

		if( type === 'mousedown' && type !== 'click' ){
			CURRENT.cp.isDragging = true;

		}

		if( ( type !== 'mousemove' || !CURRENT.cp.isDragging ) && type !== 'click' ){
			return;

		}
		satNode = node( ui );

		if( !( width = satNode.width() ) || !( height = satNode.height() ) ){
			return;

		}

		if( !( x = ( rec = ui.getBoundingClientRect() ).left ) || !( y = rec.top ) ){
			return;

		}
		px = isNumber( px = parseInt( ev.pageX - x ) ) && px > 0 ? px : 0;
		py = isNumber( py = parseInt( ev.pageY - y ) ) && py > 0 ? py : 0;
		dw = ( dw = node( CURRENT.cp.saturation ).width() ) > 0 ? dw : 0;
		dw2 = dw / 2;

		dx = px - dw2;
		dy = py - dw2;

		dx = dx > ( width - dw2 ) ? width - dw2 : ( dx < 0 ? -dw2 : dx );
		dy = dy > ( height - ( dw / 2 ) ) ? height - dw2 : ( dy < 0 ? -dw2 : dy );

		CURRENT.cp.saturation.style.left = parseInt( dx ) + 'px';
		CURRENT.cp.saturation.style.top = parseInt( dy ) + 'px';

		s = px / ( width - 1 );
		b = 1 - py / ( height - 1 );

		s = s < 0 ? 0 : ( s > 1 ? 1 : s );
		b = b < 0 ? 0 : ( b > 1 ? 1 : b );

		CURRENT.color.hsb[1] = s;
		CURRENT.color.hsb[2] = b;
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
	node( selector ).on( 'mousemove mousedown click', CORE.saturation, id );

}