import { parseId, parseIds, parseDataset } from '../../../utils/parse.js';
import { isObject, isNode } from '../../../utils/is.js';
import layout from '../../../utils/layout.js';
import node from '../../../dom/element.js';
import { getElement } from '../stored.js';
import { TARGET } from '../../target.js';
import { DATA } from '../../data.js';
import { ID } from '../../id.js';
import panel from './index.js';

const DOCUMENT = document;

const CORE = {

	classes: {
		items: {
			default: 'comet-panel__items',
			sortable: 'comet-panel__items--sortable'
		},
		item: {
			default: 'comet-panel__item',
			tooltip: 'comet-panel__item__tooltip',
			icon: 'comet-panel__item__icon',
			button: 'comet-panel__item__button',

		},
		add: {
			default: 'comet-panel__additem',
			button: 'comet-panel__additem__button',
			tooltip: 'comet-panel__additem__button__tooltip',
			icon: 'comet-panel__additem__button__icon'
		}

	},

	add: function( ev, ui, itemsNode ){
		var pid, id;

		ev.preventDefault();

		if( !isNode( itemsNode )  || !( pid = TARGET.id() ) ){
			return;

		}

		if( TARGET.type() === null || !( id = DATA.create( 'items', pid, 'last' ) ) ){
			return;

		}
		itemsNode.appendChild( CORE.createItem( id ) );

	},

	edit: function( ev, ui, args ){
		var id, tabs1, tid, element, edata;

		ev.preventDefault();

		if( !( id = parseId( args.id ) ) || !( tid = TARGET.id() ) ){
			return;

		}

		if( !isObject( element = DATA.get( tid, 'elements' ) ) || !isObject( edata = getElement( element._type ) ) ){
			return;

		}

		if( !isObject( edata.tabs ) || !isObject( edata.tabs.items ) || !isObject( edata.tabs.items.tabs ) ){
			return;

		}
		tabs1 = __create( edata.tabs.items.tabs, DATA.get( id, 'items' ) );
		TARGET.set( { state: 'items', item: id } );

		panel({
			title: __cometi18n.ui.editItem,
			tabs: tabs1.tabs,
			content: tabs1.content,
			close: {
				inner: '<span class="cico cico-arrow-left-alt"></span>',
				title: __cometi18n.ui.back,
				do: function(){

					if( !tid ){
						return false;

					}
					const tabs2 = __create( edata.tabs, element );
					TARGET.set( { state: null, item: null } );

					panel({
						title: __cometi18n.options.element.edit,
						tabs: tabs2.tabs,
						content: tabs2.content,
						close: {
							do: function(){
								TARGET.reset();

							}

						}

					});

				}
			}
		});

	},

	delete: function( ev, ui, args ){
		var element_id, item_id, elementNode;
		var _t, lyt;

		ev.preventDefault();

		if( !isNode( args.target ) || !( item_id = parseId( args.id ) ) ){
			return;

		}

		if( !DATA.remove( item_id, 'items', ( element_id = TARGET.id() ) ) ){
			return;

		}
		args.target.parentNode.removeChild( args.target );

		if( ( elementNode = TARGET.node() ) && ( lyt = layout( DATA.getData() ).element( element_id, true ) ) ){
			elementNode.parentNode.replaceChild( lyt, elementNode );

		}

	},

	sort: function( id ){

		return {
			connectWith: [
			{
				selector: '.comet-items--sortable',
				items: '.comet-items__item--sortable'
			}
			],
			containment: '.comet-items--sortable',
			start: function( ev, ui ){

				if( ui.parentNode === null ){
					return;

				}

				ui.parentNode.style.visibility = 'hidden';
				return ui.parentNode;

			},
			stop: function( e, ui, item ){
				var pid, t, re, closest, tnode;

				item.removeAttribute( 'style' );

				if( !( pid = TARGET.id() ) ){
					return;

				}
				closest = node( ui ).next( { selector: '.comet-item-sortable' } );
				t = isNode( closest ) && ( t = parseDataset( closest, 'id' ) ) && ( t = parseId( t ) ) ? t : 'last';

				ID.remove( id, 'items', pid );
				ID.insert( id, 'items', pid, t );
				ui.parentNode.replaceChild( item , ui );

				if( !( tnode = TARGET.node() ) || tnode === null || !( re = layout( DATA.getData() ).element( pid, true ) ) ){
					return;

				}
				tnode.parentNode.replaceChild( re, tnode );

			}
		};

	},

	createItem: function( id ){
		const item = DOCUMENT.createElement( 'div' );
		const args = {};
		var inner, dren;

		item.className = 'comet-item comet-item-sortable comet-items__item comet-items__item--sortable';
		item.dataset.id = id;

		inner = '<button class="comet-button" aria-label="' + __cometi18n.ui.sort + '"><span class="cico cico-move"></span><span class="comet-title">' + __cometi18n.ui.sort + '</span></button>';
		inner += '<span>' + id + '</span>';
		inner += '<button class="comet-button comet-first" aria-label="' + __cometi18n.ui.edit + '"><span class="cico cico-edit"></span><span class="comet-title">' + __cometi18n.ui.edit + '</span></button>';
		inner += '<button class="comet-button comet-last" aria-label="' + __cometi18n.ui.delete + '"><span class="cico cico-trash"></span><span class="comet-title">' + __cometi18n.ui.delete + '</span></button>';

		item.innerHTML = inner;
		dren = item.children;

		args.id = id;
		args.target = item;

		node( dren[0] ).sort( CORE.sort( id ) );
		node( dren[2] ).on( 'click', CORE.edit, args );
		node( dren[3] ).on( 'click', CORE.delete, args );

		return item;

	}

};

export function createItems( section, data ){
	var inner, a, ids, id, dataItem, items;

	if( !isNode( section ) ){
		return false;

	}
	inner = '<div class="' + CORE.classes.items.default + ' ' + CORE.classes.items.sortable + '"></div>';
	inner += '<div class="' + CORE.classes.add.default + '">';
	inner += '<button class="' + CORE.classes.add.button + '" aria-label="' + __cometi18n.ui.addItem + '">';
	inner += '<span class="' + CORE.classes.add.icon + ' cico cico-plus"></span>';
	inner += '<span class="' + CORE.classes.add.tooltip + '">' + __cometi18n.ui.addItem + '</span>';
	inner += '</button>';
	inner += '</div>';
	section.innerHTML = inner;
	items = section.firstChild;

	node( section.lastChild.firstChild ).on( 'click', CORE.add, items );

	if( !isObject( data ) || !isString( data._items ) || isEmpty( data._items ) || ( ids = parseIds( data._items, 'array' ) ).length < 1 ){
		return;

	}

	for( a = 0; a < ids.length; a++ ){

		if( !( id = parseId( ids[a] ) ) || !( dataItem = DATA.get( id, 'items' ) ) ){
			continue;

		}
		items.appendChild( CORE.createItem( id, dataItem.title ) );

	}

}