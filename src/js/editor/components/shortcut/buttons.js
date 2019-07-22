import { isNode, isObject, isString, isEmpty,isFunction } from '../../../utils/is.js';
import { shortcut as getShortcut, getSettingsFrom, getElement } from '../stored.js';
import { parseId, parseDataset } from '../../../utils/parse.js';
import node from '../../../dom/element.js';
import { TARGET } from '../../target.js';
import panel from '../panel/index.js';
import { DATA } from '../../data.js';
import { CORE } from './core.js';

const TYPES = {

	section: function( data ){
		const type = 'sections';
		const targetNode = CORE.getParent( data.target, 'cpb-section' );
		var id, nid, sdata, ret;

		if( !targetNode || !( id = parseDataset( targetNode, 'id' ) ) || !( id = parseId( id ) ) ){
			return false;

		}

		switch( data.role ){

			case 'edit':

			sdata = getSettingsFrom( 'section' );

			TARGET.set({
				id: id,
				type: type,
				node: targetNode
			});

			return {
				title: __cometi18n.options.section.edit,
				data: {
					tabs: sdata,
					current: DATA.get( id, type )
				}

			};

			case 'del':

			DATA.remove( id, type );
			node( targetNode ).remove();
			return true;

			case 'dup':

			if( !( nid = DATA.clone( id, type ) ) || !( ret = layout( DATA.getData() ).section( nid ) ) ){
				return false;

			}
			node( targetNode ).after( ret.querySelectorAll( '.cpb-section' ) );
			return true;

			default:
			return false;

		}

	},

	row: function( data ){
		const type = 'rows';
		const targetNode = CORE.getParent( data.target, 'cpb-row' );
		var id, parentNode, pid, nid, rdata, ret;

		if( !targetNode || !( id = parseDataset( targetNode, 'id' ) ) || !( id = parseId( id ) ) ){
			return false;

		}

		switch( data.role ){

			case 'edit':

			rdata = getSettingsFrom( 'row' );

			TARGET.set({
				id: id,
				type: type,
				node: targetNode
			});

			return {
				title: __cometi18n.options.row.edit,
				data: {
					tabs: rdata,
					current: DATA.get( id, type )
				}
			};

			case 'del':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-section' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}
			DATA.remove( id, type, pid );
			node( targetNode ).remove();
			return true;

			case 'dup':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-section' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}

			if( !( nid = DATA.clone( id, type, pid ) ) || !( ret = layout( DATA.getData() ).row( nid ) ) ){
				return false;

			}
			node( targetNode ).after( ret.querySelectorAll( '.cpb-row' ) );
			return true;

			default:
			return false;

		}

	},

	column: function( data ){
		const type = 'columns';
		const targetNode = CORE.getParent( data.target, 'cpb-column' );
		var id, parentNode, pid, nid, cdata, ret;

		if( !targetNode || !( id = parseDataset( targetNode, 'id' ) ) || !( id = parseId( id ) ) ){
			return false;

		}

		switch( data.role ){

			case 'edit':

			cdata = getSettingsFrom( 'column' );

			TARGET.set({
				id: id,
				type: type,
				node: targetNode
			});

			return {
				title: __cometi18n.options.column.edit,
				data: {
					tabs: cdata,
					current: DATA.get( id, type ) 
				}
			};

			case 'del':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-row' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}
			parentNode = targetNode.parentNode;
			DATA.remove( id, type, pid );
			node( targetNode ).remove();
			redefine.columns( parentNode );
			return true;

			case 'dup':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-row' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}

			if( !( nid = DATA.clone( id, type, pid ) ) || !( ret = layout( DATA.getData() ).column( nid ) ) ){
				return false;

			}
			node( targetNode ).after( ret.querySelectorAll( '.cpb-column' ) );
			redefine.columns( targetNode.parentNode );
			return true;

			default:
			return false;

		}

	},

	element: function( data ){
		const type = 'elements';
		const targetNode = CORE.getParent( data.target, 'cpb-element' );
		var id, parentNode, pid, nid, _type, tmp, edata, ret;

		if( !targetNode || !( id = parseDataset( targetNode, 'id' ) ) || !( id = parseId( id ) ) ){
			return false;

		}

		switch( data.role ){

			case 'edit':

			if( !isObject( tmp = DATA.get( id, type ) ) || !isString( _type = tmp._type ) || isEmpty( _type ) ){
				return false;

			}

			if( !isObject( edata = getElement( _type ) ) || !isObject( edata.tabs ) ){
				return false;

			}

			TARGET.set({
				id: id,
				type: type,
				node: targetNode
			});

			return {
				title: __cometi18n.options.element.edit,
				data: { 
					tabs: edata.tabs,
					current: tmp
				}
			};

			case 'del':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-column' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}
			DATA.remove( id, type, pid );
			node( targetNode ).remove();
			return true;

			case 'dup':

			if( !( parentNode = CORE.getParent( targetNode, 'cpb-column' ) ) || !( pid = parseDataset( parentNode, 'id' ) ) || !( pid = parseId( pid ) ) ){
				return false;

			}

			if( !( nid = DATA.clone( id, type, pid ) ) || !( ret = layout( DATA.getData() ).element( nid ) ) ){
				console.log( ret );
				return false;

			}
			node( targetNode ).after( ret.querySelectorAll( '.cpb-element' ) );
			return true;

			default:
			return false;

		}

	}

};

export function onButtonsClick( event, ui, data ){

	const SHORTCUT = getShortcut();

	var get;

	event.preventDefault();

	if( !isFunction( TYPES[data.type] ) || !CORE.isRoleDefined( data.role ) ){

		if( SHORTCUT ){
			SHORTCUT.destroy();

		}
		return;

	}

	if( !isObject( get = TYPES[data.type]( data ) ) || !isObject( get.data ) || !isString( get.title ) ){
		console.log( 'fa' );

		if( SHORTCUT ){
			SHORTCUT.destroy();
			
		}
		return;

	}
	console.log( get );

	panel({
		title: get.title,
		data: get.data,
		close: {
			do: function(){
				TARGET.reset();
			}
		}

	});
}