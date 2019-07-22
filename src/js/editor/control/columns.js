import { parseId, parseDataset } from '../../utils/parse.js';
import { sanitizeNumber } from '../../utils/sanitize.js';
import { isObject } from '../../utils/is.js';
import layout from '../../utils/layout.js';
import node from '../../dom/element.js';
import { DATA } from '../data.js';

const TYPE = 'columns';

const CORE = {

	isSibling: function( target ){
		var id;
		return ( !node( target ).hasClass( 'cpb-column' ) || !( id = parseDataset( target, 'id' ) ) || !( id = parseId( id ) ) ? false : id );

	},

	getNextSibling: function( target ){
		var sib, id, sibdata;

		if( target === null || ( sib = target.nextSibling ) === null ){
			return false;

		}

		if( !( id = CORE.isSibling( sib ) ) || !( sibdata = DATA.get( id, TYPE ) ) ){
			return CORE.getNextSibling( sib );

		}
		return {
			id: id,
			node: sib,
			width: sibdata.wsize

		};

	},

	getPrevSibling: function( target ){
		var sib, id, sibdata;

		if( target === null || ( sib = target.previousSibling ) === null ){
			return false;

		}

		if( !( id = CORE.isSibling( sib ) ) || !( sibdata = DATA.get( id, TYPE ) ) ){
			return CORE.getPrevSibling( sib );

		}
		return {
			id: id,
			node: sib,
			width: sibdata.wsize

		};

	},

	getSibling: function( target ){
		var tmp;

		if( ( tmp = CORE.getNextSibling( target ) ) ){
			return tmp;

		}

		if( ( tmp = CORE.getPrevSibling( target ) ) ){
			return tmp;

		}
		return false;

	},

};

export default function( data ){

	var sw, sibling, c, dren, width, delta, id, get, siblingWidth, targetWidth;

	var value = data.value;

	if( data.target === null || data.target.parentNode === null || data.slug !== 'wsize' ){
		return value;

	}

	if( !( sibling = CORE.getSibling( data.target ) ) ){
		ui.value = 100;
		return 100;

	}
	dren = data.target.parentNode.children;
	width = 0;
	siblingWidth = 0;
	targetWidth = 0;

	for( c = 0; c < dren.length; c++ ){

		if( !( id = CORE.isSibling( dren[c] ) ) || !isObject( get = DATA.get( id, TYPE ) ) ){
			continue;

		}
		sw = sanitizeNumber( { value: get.wsize, min: 10, default: 10 } );

		if( dren[c] === data.node ){
			targetWidth = sw;
			continue;

		}

		if( dren[c] === sibling.node ){
			siblingWidth = sw;
			continue;

		}
		width = width + sw;

	}
	value = sanitizeNumber( { value: parseFloat( value ), min: 10, default: 10 } );
	delta = targetWidth - value;
	siblingWidth = sanitizeNumber( { value: ( siblingWidth + delta ), min: 10, default: 10 } );
	width = width + value + siblingWidth;

	if( width > 100 ){
		delta = width - 100;
		width = width - siblingWidth;
		siblingWidth = sanitizeNumber( { value: ( siblingWidth - delta ), min: 10, default: 10 } );
		width = width + siblingWidth;

		if( width > 100 ){
			delta = width - 100;
			width = width - value;
			value = sanitizeNumber( { value: ( value - delta ), min: 10, default: 10 } );

		}


	}else if( width < 100 ){
		delta = 100 - width;
		value = value + delta;

	}
	DATA.set( sibling.id, TYPE, { wsize: siblingWidth } );
	layout( DATA.getData(), 'css' ).column( sibling.id );
	return value;

}