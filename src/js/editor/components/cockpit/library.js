import { frame as Frame, notifications as Notifications } from '../stored.js';
import { isString, isEmpty, isObject, isArray } from '../../../utils/is.js';
import { parseId, parseIds, parseJson } from '../../../utils/parse.js';
import { escUrl, inArray } from '../../../utils/fill.js';
import { addQueryArgs } from '../../../utils/url.js';
import node from '../../../dom/element.js';
import layout from '../../../utils/layout.js';
import modal from '../../../utils/modal.js';
import ajax from '../../../utils/ajax.js';
import { DATA } from '../../data.js';

/* global document, __cometi18n, __cometdata */

const DOCUMENT = document;

const CORE = {

	library: false,

	loaded: [],

	preview: function( ev, ui, data ){
		var id, url;

		ev.preventDefault();

		if( !isObject( data ) || !( id = parseId( data.id ) ) ){
			return;

		}
		url = addQueryArgs( { id }, __cometdata.preview_url );

		modal({
			header: '<h4>' + data.title + ' (' + data.id + ')</h4>',
			content: '<iframe src="' + escUrl( url ) + '"></iframe>'
		});

	},

	search: function( ev, ui ){
		const v = isString( ui.value ) ? ui.value.trim() : '';
		var regex, i;

		if( CORE.loaded.length < 1 ){
			return false;

		}
		regex = new RegExp( v, 'i' );

		for( i = 0; i < CORE.loaded.length; i++ ){

			if( !isObject( CORE.loaded[i] ) ){
				continue;

			}

			if( v !== '' && CORE.loaded[i].title.search( regex ) === -1 ){
				CORE.loaded[i].node.style.display = 'none';
				continue;

			}
			CORE.loaded[i].node.style.display = 'block';

		}

	},

	switch: function( ev, ui ){

		CORE.load( ui.value );

	},

	load: function( set ){

		if( !isString( set ) || !inArray( [ 'cus', 'pre' ], ( set = set.trim() ) ) ){
			return false;

		}

		ajax({
			do: 'templates',
			data: set

		}).done( CORE.onLoaded );

	},

	onLoaded: function( templates ){
		const body = CORE.library.body.firstElementChild;
		const fragment = DOCUMENT.createDocumentFragment();
		var t, template, id, title, buttonset, inner, scope;

		if( templates === '0' || body === null || !isArray( templates = parseJson( templates ) ) ){
			return;

		}
		CORE.loaded = [];

		for( t = 0; t < templates.length; t++ ){
			template = templates[t];

			if( !( id = parseId( template.ID ) ) ){
				continue;

			}
			title = isString( template.post_title ) ? template.post_title.trim() : '';

			scope = DOCUMENT.createElement( 'div' );
			scope.className = 'comet-mytemplates__template';

			inner = '<figure class="comet-mytemplates__template__figure">';
			inner += '<span class="comet-mytemplates__template__id">' + id + '</span>';
			inner += '<div class="comet-mytemplates__template__buttonset">';
			inner += '<button class="comet-mytemplates__template__buttonset__insert" title="' + __cometi18n.ui.insert + '" aria-label="' + __cometi18n.ui.insert + '"><span class="cico cico-dir-download"></span></button>';
			inner += '<button class="comet-mytemplates__template__buttonset__preview" title="' + __cometi18n.ui.preview + '" aria-label="' + __cometi18n.ui.preview + '"><span class="cico cico-eye"></span></button>';
			inner += '</div>';
			inner +='</figure>';
			inner += '<aside class="comet-mytemplates__template__meta">' + title + '</aside>';

			scope.innerHTML = inner;

			fragment.appendChild( scope );

			CORE.loaded[CORE.loaded.length] = {
				id: id,
				title: title,
				node: scope
			};

			buttonset = scope.firstChild.lastChild;

			node( buttonset.firstChild ).on( 'click', CORE.insert, id );
			node( buttonset.lastChild ).on( 'click', CORE.preview, { id, title } );

		}
		body.innerHTML = '';
		body.appendChild( fragment );

	},

	insert: {

		clone: function( data ){
			var from = false;
			var ids, a, count, id;

			if( !isObject( data ) || isEmpty( data._sections ) ){
				return false;

			}

			if( !isArray( ids = parseIds( data._sections, 'array' ) ) ){
				return false;

			}
			count = 0;

			for( a = 0; a < ids.length; a++ ){

				if( !( id = CORE.insert._clone( 'sections', ids[a], data, '0' ) ) ){
					continue;

				}

				if( count === 0 ){
					from = id;

				}
				count++;

			}
			return from;

		},

		_clone: function( type, id, data, pid ){
			const TYPES = [ 'items', 'elements', 'columns', 'rows', 'sections' ];
			var children = [];
			var childtype, _childtype, n_id, a;

			if( !isString( type ) || !inArray( TYPES, ( type = ( type.toLowerCase() ).trim() ) ) ){
				return false;

			}

			if( !isObject( data ) || !isObject( data[type] ) ){
				return false;

			}

			if( !isObject( data[type][id] ) ){
				data[type][id] = {};

			}

			if( !( n_id = DATA.create( ( type === 'elements' ? data[type][id]._type : type ), pid, 'last', data[type][id] ) ) ){
				return false;

			}
			childtype = DATA.getChild( type );

			if( childtype && ( _childtype = '_' + childtype ) && isObject( data[type][id] ) && !isEmpty( data[type][id][_childtype] ) ){
				children = parseIds( data[type][id][_childtype], 'array' );

			}
			DATA.removeIds( n_id, type );

			if( !isArray( children, 1 ) ){
				return n_id;

			}

			for( a = 0; a < children.length; a++ ){
				CORE.insert._clone( childtype, children[a], data, n_id );

			}
			return n_id;

		},

		init: function( ev, ui, id ){

			ev.preventDefault();

			if( ( id = parseId( id ) ) ){
				Notifications().add( __cometi18n.messages.warning.ltemplate, 300 );

				ajax({
					id,
					meta: 'true',
					do: 'get'

				}).done( CORE.insert.onLoaded );

			}
			CORE.library.destroy();


		},

		onLoaded: function( response ){
			const NOTIFICATIONS = Notifications();
			const FRAME = Frame();
			var data, from;

			if( !FRAME ){
				NOTIFICATIONS.add( __cometi18n.messages.error.ltemplate, 400 );
				return;

			}

			if( response === '0' || !isObject( data = parseJson( response ) ) || !isObject( data['meta'] ) ){
				NOTIFICATIONS.add( __cometi18n.messages.error.ltemplate, 400 );

			}
			from = CORE.insert.clone( data['meta'] );
			layout( DATA.getData() ).init( FRAME.target, from );
			NOTIFICATIONS.add( __cometi18n.messages.success.ltemplate, 200 );

		}

	}

};

export default function( ev ){
	var header, body, inner;

	ev.preventDefault();

	header = DOCUMENT.createElement( 'div' );
	header.className = 'comet-searchbox comet-searchbox--mytemplates';

	inner = '<select class="comet-select comet-searchbox--mytemplates__select">';
	inner += '<option value="cus">' + __cometi18n.ui.mytemplates + '</option>';
	inner += '</select>';

	inner += '<input type="text" class="comet-input comet-searchbox--mytemplates__input" placeholder="' + __cometi18n.ui.saTemplate + '"/>';
	header.innerHTML = inner;

	body = DOCUMENT.createElement( 'div' );
	body.className = 'comet-templates comet-mytemplates';

	CORE.library = modal({
		header: header,
		content: body
	});

	CORE.loaded = [];
	/* cus, pre */
	CORE.load( 'cus' );

	node( header.firstChild ).on( 'change', CORE.switch );
	node( header.lastChild ).on( 'input', CORE.search );

}