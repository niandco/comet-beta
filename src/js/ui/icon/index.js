import { isString, isEmpty, isObject, isNode } from '../../utils/is.js';
import { getSvgSets } from '../../editor/components/stored.js';
import update from '../../editor/control/update.js';
import modal from '../../utils/modal.js';
import node from '../../dom/element.js';
import Icon from '../../utils/icon.js';

/* global document, __cometi18n */

/**
 * @TODO Rewrite and optimize the function
 *
 */

export default function( source, data ){

	var loaded = [];

	var _modal = false;

	const _d = document;

	const wrapper = _d.createElement( 'div' );

	const __core = {

		load: function( set_id ){
			const fragment = _d.createDocumentFragment();
			const set = Icon.get_set( set_id );
			var icon_id, scope, svg, encoded;

			loaded = [];

			if( isObject( set ) && isObject( set.set ) ){

				for( icon_id in set.set ){
					svg = Icon.get_svg_from_data( set.set[icon_id] );

					if( !isString( svg ) || isEmpty( svg ) ){
						continue;

					}
					encoded = Icon.encode( set_id, icon_id );
					scope = _d.createElement( 'div' );
					scope.className = 'comet-scope comet-icon comet-collection';
					scope.innerHTML = svg;
					fragment.appendChild( scope );

					loaded[loaded.length] = {
						id: icon_id,
						name: set.set[icon_id].name,
						svg: svg,
						node: scope

					};

					node( scope ).on( 'click', __core.onclick, encoded );

				}

			}
			_modal.body.firstChild.innerHTML = '';
			_modal.body.firstChild.appendChild( fragment );

		},

		onclick: function( ev, ui, edata ){
			ev.preventDefault();
			data.value = edata;
			source.value = edata;
			__core.create();
			update( source );
			_modal.destroy();

		},

		switch: function( ev, ui ){
			__core.load( isString( ui.value ) ? ui.value.trim() : '' );

		},

		search: function( ev, ui ){

			const val = isString( ui.value ) ? ui.value.trim() : '';
			var icon, i, regex;

			if( loaded.length < 1 ){
				return false;

			}
			regex = new RegExp( val, 'i' );

			for( i = 0; i < loaded.length; i++ ){

				if( !isObject( icon = loaded[i] ) || !isString( icon.id ) ){
					continue;

				}

				if( isString( val ) && !isEmpty( val ) && icon.id.search( regex ) === -1 ){
					icon.node.style.display = 'none';
					continue;

				}
				icon.node.style.display = 'block';

			}

		},

		open: function( ev ){
			const sets = getSvgSets();
			var first_id = false;
			var count = 1;
			var id, header, inner, body;

			ev.preventDefault();
			ev.stopPropagation();

			if( !isObject( sets ) ){
				return;

			}

			header = _d.createElement( 'div' );
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

			body = _d.createElement( 'div' );
			body.className = 'comet-icons comet-set comet-wrapper';

			_modal = modal({
				header: header,
				content: body
			});

			__core.load( first_id );

			node( header.firstChild ).on( 'change', __core.switch );
			node( header.lastChild ).on( 'input', __core.search );
		},

		delete: function( ev ){
			ev.preventDefault();
			ev.stopPropagation();
			data.value = '';
			source.value = '';
			__core.create();
			update( source );

		},

		create: function(){

			const browse = __cometi18n.ui.browse;
			const remove = __cometi18n.ui.remove;
			const buttonClass = 'comet-button';
			const wcn = wrapper.childNodes;
			const button = _d.createElement( 'button' );
			const decoded = Icon.decode( data.value );
			const icon = ( !decoded ? false : Icon.get_icon( decoded.set_id, decoded.icon_id ) );
			var n = 0;

			while( n < wcn.length ){

				if( wcn[n] !== source ){
					wrapper.removeChild( wcn[n] );

				}
				n++;
			}

			if( !icon ){
				button.className = buttonClass + ' comet-buttonPrimary comet-upload';
				button.innerHTML = browse;
				wrapper.appendChild( button );
				node( button ).on( 'click', __core.open );
				return;

			}
			const oh = _d.createElement( 'div' );
			wrapper.appendChild( oh );
			oh.className = 'comet-media comet-wrapper comet-icon';
			oh.title = browse;
			oh.innerHTML = Icon.get_svg_from_data( icon );
			node( oh ).on( 'click', __core.open );

			button.className = buttonClass + ' comet-remove';
			button.title = remove;
			button.innerHTML = '<span class="cico cico-x"></span>';
			oh.appendChild( button );
			node( button ).on( 'click', __core.delete );

		}


	};

	if( !isNode( source ) ){
		return false;

	}
	wrapper.className = 'comet-uploader comet-image comet-wrapper';
	__core.create();

	return wrapper;

}