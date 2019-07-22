import utils from '../../../../utils/utils.js';
import modal from '../../../../utils/modal.js';
import _icon from '../../../../utils/icon.js';
import node from '../../../../utils/node.js';
import update from '../../../update.js';

/* global document, __cometi18n */

export default function( slug, field, data ){

	var input = null;

	var value = '';

	var loaded = [];

	var _modal = false;

	const _d = document;

	const wrapper = _d.createElement( 'div' );

	const __core = {

		load: function( set_id ){
			const fragment = _d.createDocumentFragment();
			const set = _icon.get_set( set_id );
			var icon_id, scope, svg, encoded;

			loaded = [];

			if( utils.isObject( set ) && utils.isObject( set.set ) ){

				for( icon_id in set.set ){

					if( utils.isStringEmpty( svg = _icon.get_svg_from_data( set.set[icon_id] ) ) ){
						continue;

					}
					encoded = _icon.encode( set_id, icon_id );
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
			value = edata;
			input.value = edata;
			__core.create();
			update( input );
			_modal.destroy();

		},

		switch: function( ev, ui ){
			__core.load( utils.isString( ui.value ) ? utils.trim( ui.value ) : '' );

		},

		search: function( ev, ui ){

			const val = utils.isString( ui.value ) ? utils.trim( ui.value ) : '';
			var icon, i, regex;

			if( loaded.length < 1 ){
				return false;

			}
			regex = new RegExp( val, 'i' );

			for( i = 0; i < loaded.length; i++ ){

				if( !utils.isObject( icon = loaded[i] ) || !utils.isString( icon.id ) ){
					continue;

				}

				if( !utils.isStringEmpty( val ) && icon.id.search( regex ) === -1 ){
					icon.node.style.display = 'none';
					continue;

				}
				icon.node.style.display = 'block';

			}

		},

		open: function( ev ){
			const sets = utils.getSvgSets();
			var first_id = false;
			var count = 1;
			var id, header, inner, body;

			ev.preventDefault();
			ev.stopPropagation();

			if( !utils.isObject( sets ) ){
				return;

			}

			header = _d.createElement( 'div' );
			header.className = 'comet-searchbox';

			inner = '<select class="comet-ui comet-select">';

			for( id in sets ){

				if( !utils.isObject( sets[id] ) || !utils.isString( sets[id].name ) || !utils.isObject( sets[id].set ) ){
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
			value = '';
			input.value = value;
			__core.create();
			update( input );

		},

		create: function(){

			const browse = __cometi18n.ui.browse;
			const remove = __cometi18n.ui.remove;
			const buttonClass = 'comet-button';
			const wcn = wrapper.childNodes;
			const button = _d.createElement( 'button' );
			const decoded = _icon.decode( value );
			const icon = ( !decoded ? false : _icon.get_icon( decoded.set_id, decoded.icon_id ) );
			var n = 0;

			while( n < wcn.length ){

				if( wcn[n] !== input ){
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
			oh.innerHTML = _icon.get_svg_from_data( icon );
			node( oh ).on( 'click', __core.open );

			button.className = buttonClass + ' comet-remove';
			button.title = remove;
			button.innerHTML = '<span class="cico cico-x"></span>';
			oh.appendChild( button );
			node( button ).on( 'click', __core.delete );

		}


	};

	data = utils.isObject( data ) ? data : {};

	if( 'std' in field ){
		value = field.std;

	}

	if( slug in data ){
		value = data[slug];

	}
	value = utils.isString( value ) ? utils.trim( utils.stripTags( value ) ) : '';

	wrapper.className = 'comet-uploader comet-image comet-wrapper';
	wrapper.innerHTML = '<input type="hidden" name="' + slug + '" class="comet-field" value="' + value + '" />';
	input = wrapper.firstChild;
	__core.create();

	return wrapper;

}