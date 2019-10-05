import { isObject, isString, isBool, isEmpty, isArray } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import { createControls } from './controls.js';
import nodes from '../../../dom/elements.js';
import node from '../../../dom/element.js';
import { createItems } from './items.js';

const DOCUMENT = document;

const CORE = {

	classes: {

		tab: {
			default: 'comet-panel__tab',
			active: 'comet-panel__tab--active',
			button: 'comet-panel__tab--button',
			content: 'comet-panel__tab--content'
		},

		section: {
			default: 'comet-panel__section',
			items: 'comet-panel__section--items',
			active: 'comet-panel__section--active',
			header: 'comet-panel__section__header',
			body: 'comet-panel__section__body'
		}

	},

	onTab: function( ev, ui, contentNode ){
		ev.preventDefault();
		nodes( ui.parentNode.children ).removeClass( CORE.classes.tab.active );
		nodes( contentNode.parentNode.children ).removeClass( CORE.classes.tab.active );
		node( contentNode ).addClass( CORE.classes.tab.active );
		node( ui ).addClass( CORE.classes.tab.active );

	},

	onSection: function( ev, ui, contentNode ){
		ev.preventDefault();
		node( contentNode ).toggleClass( CORE.classes.section.active );

	},

	/*controlsState: function( controls ){
		var a, _node, checkbox, checked;

		if( !isObject( controls ) || !isObject( controls.toggle ) || !isObject( controls.all ) ){
			return false;

		}

		for( a in controls.toggle ){

			if( !isObject( controls.toggle[a] ) ){
				continue;

			}
			_node = controls.toggle[a].node;
			checkbox = ( _node.nodeName === 'INPUT' && _node.type === 'checkbox' );
			checked = ( checkbox && _node.checked );

			if( ( !checkbox && controls.toggle[a].values.indexOf( _node.value ) > -1 ) || checked ){
				node( controls.all[a].target ).removeClass( __core.classes.hide );
				continue;

			}
			node( controls.all[a].target ).addClass( __core.classes.hide );

		}

	},*/

	createSectionLayout: function( fragment, data ){
		const section = DOCUMENT.createElement( 'div' );
		const isItems = isBool( data ) && data;
		var inner, body, controls;

		fragment.appendChild( section );
		section.className = CORE.classes.section.default + ( isItems ? ' ' + CORE.classes.section.items : '' );

		if( !isItems ){
			inner = '<h4 class="' + CORE.classes.section.header + '">' + data.name + '</h4>';
			inner += '<div class="' + CORE.classes.section.body + '"></div>';
			section.innerHTML = inner;

			body = section.lastChild;
			controls = createControls( body, data.fields );
			node( section.firstChild ).on( 'click', CORE.onSection, body );

		}
		return { controls, section };

	},

	createTabContent: function( sections, data, isItems ){
		const oTab = DOCUMENT.createDocumentFragment();
		var controls = [];
		var a, s, dataItem, ids, id, response;

		if( isBool( isItems ) && isItems ){
			response = CORE.createSectionLayout( oTab, true );
			controls[controls.length] = {
				id: 'items',
				items: true,
				control: response.section
			};
			return { oTab, controls };

		}

		if( isObject( sections ) ){ 

			for( a in sections ){

				if( !isObject( s = sections[a] ) || !isString( s.name ) || !isObject( s.fields ) ){
					continue;

				}
				
				if( !( response = CORE.createSectionLayout( oTab, s ) ) ){
					continue;

				}

				if( !isArray( response.controls ) || response.controls.length < 1 ){
					continue;

				}
				controls = controls.concat( response.controls );

			}

		}
		return { oTab, controls };

	}

};

export function createTabs( tabs, data ){
	const oButtons = DOCUMENT.createDocumentFragment();
	const oContent = DOCUMENT.createDocumentFragment();
	var count = 1;
	var controls = [];
	var a, isItems, tab, content, button, response;

	if( isObject( tabs ) ){

		for( a in tabs ){
			isItems = ( a === 'items' );

			if( !isObject( tab = tabs[a] ) || !isString( tab.name ) || ( !isItems && !isObject( tab.sections ) ) || ( isItems && !isObject( tab.tabs ) ) ){
				continue;

			}
			button = DOCUMENT.createElement( 'button' );
			button.className = ClassName( CORE.classes.tab.default ).combineWith( [ CORE.classes.tab.button, ( count === 1 ? CORE.classes.tab.active : '' ) ] );
			button.innerHTML = tab.name;
			oButtons.appendChild( button );

			content = DOCUMENT.createElement( 'div' );
			content.className = ClassName( CORE.classes.tab.default ).combineWith( [ CORE.classes.tab.content, ( count === 1 ? CORE.classes.tab.active : '' ) ] );
			response = CORE.createTabContent( ( isItems ? tab.tabs : tab.sections ), data, isItems );

			content.appendChild( response.oTab );
			oContent.appendChild( content );

			if( isArray( response.controls ) && response.controls.length > 0 ){
				controls = controls.concat( response.controls );

			}

			node( button ).on( 'click', CORE.onTab, content );
			count++;

		}
		//__core.actions.initControlsState();

	}

	return {
		buttons: oButtons,
		tabs: oContent,
		controls
	};

}