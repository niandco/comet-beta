import { parseDataset, parseId } from '../../../utils/parse.js';
import { isNode, isFunction } from '../../../utils/is.js';
import { shortcut as getShortcut } from '../stored.js';
import node from '../../../dom/element.js';
import { CORE } from './core.js';
import { ID } from '../../id.js';

const TYPES = {

	section: function( targetNode ){

		return {

			connectWith: [ {
				selector: '.comet-frame--main',
				items: '.cpb-section'
			} ],
			containment: '.comet-frame--main',

			start: function(){
				const sectionNode = CORE.getParent( targetNode, classes.section );
				var id;

				if( !isNode( sectionNode ) || !( id = parseDataset( sectionNode, 'id' ) ) || !parseId( id ) ){
					return;

				}
				getShortcut().destroy();
				sectionNode.style.visibility = 'hidden';
				return sectionNode;

			},

			stop: function( e, ui, sectionNode ){
				var id, t, closest;

				sectionNode.removeAttribute( 'style' );

				if( !( id = parseDataset( sectionNode, 'id' ) ) || !( id = parseId( id ) ) ){
					return;

				}
				t = 'last';
				closest = node( ui ).next( '.cpb-section' );
				t = isNode( closest ) && ( t = parseDataset( closest, 'id' ) ) && ( t = parseId( t ) ) ? t : 'last';

				ID.remove( id, 'sections', id );
				ID.insert( id, 'sections', id, t );
				ui.parentNode.replaceChild( sectionNode , ui );

			}
		};

	},

	row: function( targetNode ){

		return {

			connectWith: [ {
				selector: '.cpb-rows',
				items: '.cpb-row'
			} ],
			containment: '.comet-frame--main',

			start: function(){
				const rowNode = CORE.getParent( targetNode, classes.row );
				var id;

				if( !isNode( rowNode ) || !( id = parseDataset( rowNode, 'id' ) ) || !parseId( id ) ){
					return;

				}
				getShortcut().destroy();
				rowNode.style.visibility = 'hidden';
				return rowNode;

			},
			stop: function( e, ui, rowNode ){
				var id, sid, nsid, t, closest;

				if( !isNode( rowNode ) || !( id = parseDataset( rowNode, 'id' ) ) || !( id = parseId( id ) ) ){
					return;

				}
				if( !( sid = parseDataset( CORE.getParent( rowNode, classes.section ), 'id' ) ) || !( sid = parseId( sid ) ) ){
					return;

				}

				if( !( nsid = parseDataset( CORE.getParent( ui, classes.section ), 'id' ) ) || !( nsid = parseId( nsid ) ) ){
					return;

				}
				closest = node( ui ).next( '.cpb-row' );
				t = isNode( closest ) && ( t = parseDataset( closest, 'id' ) ) && ( t = parseId( t ) ) ? t : 'last';

				rowNode.removeAttribute( 'style' );
				ID.remove( id, 'rows', sid );
				ID.insert( id, 'rows', nsid, t );
				ui.parentNode.replaceChild( rowNode , ui );

			}

		};

	},

	column: function( targetNode ){
		
		return {

			connectWith: [ {
				selector: '.cpb-rowContent',
				items: '.cpb-column'
			} ],
			containment: '.comet-frame--main',

			start: function(){
				const columnNode = CORE.getParent( targetNode, classes.column );
				var id;

				if( !isNode( columnNode ) || !( id = parseDataset( columnNode, 'id' ) ) || !( parseId( id ) ) ){
					return;

				}
				getShortcut().destroy();
				columnNode.style.visibility = 'hidden';
				return columnNode;

			},
			stop: function( e, ui, columnNode ){
				var containerNode, uiContainerNode, id, rid, nrid, t, closest;

				if( !isNode( columnNode ) || !( id = parseDataset( columnNode, 'id' ) ) || !( id = parseId( id ) ) ){
					return;

				}

				if( ( containerNode = columnNode.parentNode ) === null || !( rid = parseDataset( containerNode.parentNode, 'id' ) ) || !( rid = parseId( rid ) ) ){
					return;

				}

				if( !__data().get( rid, 'rows' ) || ( uiContainerNode = ui.parentNode ) === null || !( nrid = parseDataset( uiContainerNode.parentNode, 'id' ) ) || !( nrid = parseId( nrid ) ) ){
					return;

				}
				closest = node( ui ).next( '.cpb-column' );
				t = isNode( closest ) && ( t = parseDataset( closest, 'id' ) ) && ( t = parseId( t ) ) ? t : 'last';

				columnNode.removeAttribute( 'style' );
				ID.remove( id, 'columns', rid );
				ID.insert( id, 'columns', nrid, t );
				uiContainerNode.replaceChild( columnNode , ui );

				if( rid !== nrid ){
					redefine.columns( containerNode );
					redefine.columns( uiContainerNode );

				}
			}

		};

	},

	element: function( targetNode ){
		
		return {

			connectWith: [ {
				selector: '.cpb-columnContent',
				items: '.cpb-element'
			} ],
			containment: '.comet-frame--main',

			start: function(){
				const elementNode = CORE.getParent( targetNode, classes.element );
				var id;

				if( !isNode( elementNode ) || !( id = parseDataset( elementNode, 'id' ) ) || !parseId( id ) ){
					return;

				}
				getShortcut().destroy();
				elementNode.style.visibility = 'hidden';
				return elementNode;

			},
			stop: function( e, ui, elementNode ){
				var id, cid, ncid, t, closest;

				if( !isNode( elementNode ) || !( id = parseDataset( elementNode, 'id' ) ) || !( id = parseId( id ) ) ){
					return;

				}

				if( !( cid = parseDataset( CORE.getParent( elementNode, classes.column ), 'id' ) ) || !( cid = parseId( cid ) ) ){
					return;

				}

				if( !__data().get( cid, 'columns' ) || !( ncid = parseDataset( CORE.getParent( ui, classes.column ), 'id' ) ) || !( ncid = parseId( ncid ) ) ){
					return;

				}
				closest = node( ui ).next( '.cpb-element' );
				t = isNode( closest ) && ( t = parseDataset( closest, 'id' ) ) && ( t = parseId( t ) ) ? t : 'last';

				elementNode.removeAttribute( 'style' );
				ID.remove( id, 'elements', cid );
				ID.insert( id, 'elements', ncid, t );
				ui.parentNode.replaceChild( elementNode , ui );

			}

		};

	}

};

export function getSortParameters( targetNode, type ){

	return isFunction( TYPES[type] ) ? TYPES[type]( targetNode ) : false;

}