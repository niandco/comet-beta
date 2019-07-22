import { isNode, isString, isObject, isFunction, isArray, isBool } from '../../../utils/is.js';
import { frameset as getFrameset, panel as getPanel } from '../stored.js';
import { sanitizeNumber } from '../../../utils/sanitize.js';
import Global from '../../../utils/global.js';
import { createControl } from './control.js';
import node from '../../../dom/element.js';
import { createItems } from './items.js';
import { createTabs } from './tabs.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const ID = 'panel';

const FRAGMENT = DOCUMENT.createDocumentFragment();

const CLASSES = {
	default: 'comet-panel',
	close: 'comet-panel__close',
	header: {
		default: 'comet-panel__header',
		top: 'comet-panel__header__top',
		buttonset: 'comet-panel__header__buttonset',
		title: 'comet-panel__header__title'

	},
	body: {
		default: 'comet-panel__tabs'
	}

};

export default function( options ){

	const FRAMESET = getFrameset();

	const RDATA = {
		target: null,
		destroy: null,
		controls: []
	};

	const CORE = {

		data: {
			panel: null,
			controls: [],

		},

		loadAfter: function(){
			const CURRENT = {};
			const CONTROLS = CORE.data.controls;
			var a, response;

			if( !isArray( CONTROLS ) || CONTROLS.length < 1 ){
				return;

			}

			for( a = 0; a < CONTROLS.length; a++ ){

				if( !isObject( CONTROLS[a] ) || !isNode( CONTROLS[a].control ) ){
					continue;

				}

				if( isBool( CONTROLS[a].items ) && CONTROLS[a].items && CONTROLS[a].id === 'items' ){
					createItems( CONTROLS[a].control, options.data.current );
					continue;

				}
				CONTROLS[a].current = options.data.current;
				
				if( ( response = createControl( CONTROLS[a] ) ) === null ){
					continue;

				}
				CONTROLS[a].data.target = response;
				RDATA.controls[RDATA.controls.length] = CONTROLS[a].data;

				CORE.initSwitch( CONTROLS[a] );

			}

		},

		initSwitch: function( control ){


			node( control.data.target ).on( 'input', CORE.onSwitch, control );

		},

		onSwitch: function( ev, ui, control ){

		},

		onclose: function( ev, ui ){
			ev.preventDefault();

			CORE.destroy();

			if( isFunction( options.close.do ) ){
				options.close.do( ev, ui );

			}

		},

		destroy: function(){

			if( CORE.data.panel === null || CORE.data.panel.parentNode === null ){
				return;

			}
			CORE.data.panel.parentNode.removeChild( CORE.data.panel );
			CORE.setToGlobal( false );

		},

		setToGlobal: function( options ){
			return Global().set( ID, options, true );
			
		}

	};
	var panel, body, header, button, title, tabs, buttons;

	if( !isObject( options ) || !isObject( options.data ) ){
		options = {};

	}
	options.close = isObject( options.close ) ? options.close : {};
	options.close.title = isString( options.close.title ) ? options.close.title : __cometi18n.ui.close;
	options.close.inner = isString( options.close.inner ) ? options.close.inner : '<span class="cico cico-x"></span>';

	if( isObject( panel = getPanel() ) && panel.target !== null ){

		if( options.forceCreate === false ){
			return;

		}
		panel.destroy();

	}
	panel = DOCUMENT.createElement( 'div' );
	panel.className = CLASSES.default;
	panel.innerHTML = '<div class="' + CLASSES.header.default + '"><div class="' + CLASSES.header.top + '"></div></div><div class="' + CLASSES.body.default + '"></div>';
	panel.style.left = sanitizeNumber({ value: options.position, default: 0, min: 0 });
	FRAGMENT.appendChild( panel );
	CORE.data.panel = panel;

	header = panel.firstChild;
	body = panel.lastChild;

	button = DOCUMENT.createElement( 'button' );
	button.className = CLASSES.close;

	if( options.close.title !== '' ){
		button.title = options.close.title;

	}
	button.innerHTML = options.close.inner;
	header.firstChild.appendChild( button );
	node( button ).on( 'click', CORE.onclose );

	if( isString( options.title ) ){
		title = DOCUMENT.createElement( 'span' );
		title.className = CLASSES.header.title;
		title.innerHTML = options.title;
		header.firstChild.appendChild( title );

	}
	tabs = createTabs( options.data.tabs, options.data.current );

	buttons = DOCUMENT.createElement( 'div' );
	buttons.className = CLASSES.header.buttonset;
	buttons.appendChild( tabs.buttons );
	header.appendChild( buttons );

	body.appendChild( tabs.tabs );

	FRAMESET.append( FRAGMENT );
	CORE.data.controls = tabs.controls;
	CORE.loadAfter();

	RDATA.target = panel;
	RDATA.destroy = CORE.destroy;

	return CORE.setToGlobal( RDATA );

}