import { isNode, isString, isTrueValue } from '../../utils/is.js';
import { stripTags } from '../../utils/fill.js';
import node from '../../dom/element.js';

const DOCUMENT = document;

const CORE = {

	remove: function( ui ){
		console.log( ui );

		if( ui.parentNode === null ){
			return;

		}
		ui.parentNode.removeChild( ui );

	}

};

export default function( content, data ){
	const bgClassName = 'cpb-backgroundComponents';
	var inner = '';
	var background;

	if( !isNode( content ) ){
		return;

	}
	console.log( content );
	node( content ).children( { selector: '.' + bgClassName, onMatch: CORE.remove } );

	background = DOCUMENT.createElement( 'div' );
	background.className = bgClassName;

	if( 'vid' in data && isTrueValue( data.vid ) && isString( data.vurl ) ){
		inner += '<video class="cpb-backgroundVideo" src="' + ( stripTags( data.vurl ) ).trim() + '" loop autoplay muted preload="auto"></video>';

	}

	if( 'ov' in data && isTrueValue( data.ov ) && isString( data.ovc ) ){
		inner += '<div class="cpb-backgroundOverlay"></div>';

	}
	background.innerHTML = inner;

	content.appendChild( background );

}