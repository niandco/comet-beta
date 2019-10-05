import { isString, isEmpty, isObject, isNode } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { getSvgSets } from '../../editor/components/stored.js';
import update from '../../editor/control/update.js';
import Modal from '../../utils/modal.js';
import node from '../../dom/element.js';
import Icon from '../../utils/icon.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const I_CLASSNAME = ClassName( 'comet-media-uploader' );

const CORE = {

	modal: false,

	icons: [],

	classes: {
		main: I_CLASSNAME.modifier( 'icon' ),
		button: I_CLASSNAME.element( 'button' ),
		browse: I_CLASSNAME.element( 'browse' ),
		remove: I_CLASSNAME.element( 'remove' ),
		media: I_CLASSNAME.element( 'media' ),
		icon: I_CLASSNAME.element( 'media--icon' )

	},

	load: function( set_id, extData ){
		const fragment = DOCUMENT.createDocumentFragment();
		const set = Icon.get_set( set_id );
		var icon_id, scope, svg, encoded;

		CORE.icons = [];

		if( isObject( set ) && isObject( set.set ) ){

			for( icon_id in set.set ){
				svg = Icon.get_svg_from_data( set.set[icon_id] );

				if( !isString( svg ) || isEmpty( svg ) ){
					continue;

				}
				encoded = Icon.encode( set_id, icon_id );
				scope = DOCUMENT.createElement( 'div' );
				scope.className = 'comet-icons-pack__icon';
				scope.innerHTML = svg;
				fragment.appendChild( scope );

				CORE.icons[CORE.icons.length] = {
					id: icon_id,
					name: set.set[icon_id].name,
					svg: svg,
					node: scope

				};

				node( scope ).on( 'click', CORE.onclick, { scope: extData, value: encoded } );

			}

		}
		CORE.modal.body.firstChild.innerHTML = '';
		CORE.modal.body.firstChild.appendChild( fragment );

	},

	onclick: function( ev, ui, data ){
		ev.preventDefault();
		
		data.scope.source.value = data.value;
		CORE.create( data.scope );
		update( data.scope.source );
		CORE.modal.destroy();

	},

	switch: function( ev, ui, extData ){
		CORE.load( ( isString( ui.value ) ? ui.value.trim() : '' ), extData );

	},

	search: function( ev, ui ){
		const val = isString( ui.value ) ? ui.value.trim() : '';
		var icon, i, regex;

		if( CORE.icons.length < 1 ){
			return false;

		}
		regex = new RegExp( val, 'i' );

		for( i = 0; i < CORE.icons.length; i++ ){

			if( !isObject( icon = CORE.icons[i] ) || !isString( icon.id ) ){
				continue;

			}

			if( isString( val ) && !isEmpty( val ) && icon.id.search( regex ) === -1 ){
				icon.node.style.display = 'none';
				continue;

			}
			icon.node.style.display = 'block';

		}

	},

	open: function( ev, ui, extData ){
		const sets = getSvgSets();
		var first_id = false;
		var count = 1;
		var id, header, inner, body;

		ev.preventDefault();
		ev.stopPropagation();

		if( !isObject( sets ) ){
			return;

		}

		header = DOCUMENT.createElement( 'div' );
		header.className = 'comet-searchbox';

		inner = '<select class="comet-ui comet-select">';

		for( id in sets ){

			if( !isObject( sets[id] ) || !isString( sets[id].name ) || !isObject( sets[id].set ) ){
				continue;

			}

			if( count === 1 ){
				first_id = id;

			}
			inner += '<option value="' + id +'">' + sets[id].name + '</option>';
			count++;

		}
		inner += '</select>';
		inner += '<input type="text" class="comet-ui comet-input" placeholder="' + __cometi18n.ui.sIcon + '"/>';
		header.innerHTML = inner;

		body = DOCUMENT.createElement( 'div' );
		body.className = 'comet-icons-pack';

		CORE.modal = Modal({
			header: header,
			content: body
		});

		CORE.load( first_id, extData );

		node( header.firstChild ).on( 'change', CORE.switch, extData );
		node( header.lastChild ).on( 'input', CORE.search );

	},

	remove: function( ev, ui, extData ){
		ev.preventDefault();

		extData.source.value = '';
		CORE.create( extData );
		update( extData.source );

	},

	create: function( extData ){
		const DECODED = Icon.decode( extData.source.value );
		const VALUE = ( !DECODED ? false : Icon.get_icon( DECODED.set_id, DECODED.icon_id ) );
		var inner;

		extData.wrapper.innerHTML = '';

		if( !VALUE ){
			extData.wrapper.innerHTML = '<button class="' + CORE.classes.button + '">' + __cometi18n.ui.browse + '</button>';
			node( extData.wrapper.firstChild ).on( 'click', CORE.open, extData );
			return;

		}
		inner = Icon.get_svg_from_data( VALUE );
		inner += '<button class="' + CORE.classes.remove + '" title="' + __cometi18n.ui.remove + '">';
		inner += '<span class="cico cico-x"></span>';
		inner += '</button>';

		extData.wrapper.innerHTML = inner;

		node( extData.wrapper.firstChild ).on( 'click', CORE.open, extData );
		node( extData.wrapper.lastChild ).on( 'click', CORE.remove, extData );

	}

};

export default function( source, data ){

	const FRAGMENT = DOCUMENT.createDocumentFragment();

	const WRAPPER = DOCUMENT.createElement( 'div' );

	if( !isNode( source ) ){
		return false;

	}
	FRAGMENT.appendChild( WRAPPER );
	WRAPPER.className = I_CLASSNAME.combineWith( [ CORE.classes.main ] );
	CORE.create( { source, wrapper: WRAPPER } );
	source.parentNode.appendChild( FRAGMENT );

}