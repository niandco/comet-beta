import { generalSettings as GeneralSettings, notifications as Notifications } from '../stored.js';
import { isNode, isBool, isObject, isFunction } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import dialog from '../../../utils/dialog.js';
import node from '../../../dom/element.js';
import device from './device.js';
import evSave from './save.js';

const DOCUMENT = document;

const WINDOW = window;

const BASE = 'comet-cockpit__footer';

const CLASSNAME = ClassName( BASE );

const CORE = {

	classes: {
		main: BASE,
		expand: 'comet-cockpit__expand',
		button: CLASSNAME.element( 'button' ),
		icon: CLASSNAME.element( 'button__icon' ),
		title: CLASSNAME.element( 'button__title' ),

	},

	buttons: {

		responsive: {
			title: __cometi18n.ui.desktop,
			icon: 'cico-desktop',
			dataset: {
				device: 'desktop'
			},
			event: device

		},

		settings: {
			title: __cometi18n.ui.settings,
			icon: 'cico-cog',
			event: function( ev, ui ){
				ev.preventDefault();
				GeneralSettings().toggle( ev, ui );
				
			}

		},

		notifications: {
			title: __cometi18n.ui.notifications,
			icon: 'cico-exclamation',
			expand: true,
			event: function( ev, ui ){
				ev.preventDefault();
				Notifications().toggle( ev, ui );

			}

		},

		saveAs: {
			title: __cometi18n.ui.sTemplate,
			icon: 'cico-dir-upload',
			expand: true,
			event: evSave.saveAs

		},

		save: {
			title: __cometi18n.ui.save,
			icon: 'cico-update',
			event: evSave.save

		},

		exit: {
			title: __cometi18n.ui.exit,
			expand: true,
			icon: 'cico-power',
			event: function( ev ){

				ev.preventDefault();

				dialog({

					message: __cometi18n.messages.warning.exit,

					confirm: function(){

						WINDOW.location.replace( __cometdata.dashboard_url );

					}

				});

			}

		},

	},

	createButton: function( data ){
		const BUTTON = DOCUMENT.createElement( 'button' );
		var a;

		BUTTON.className = CORE.classes.button + ( isBool( data.expand ) && data.expand ? ' ' + CORE.classes.expand : '' );
		BUTTON.setAttribute( 'aria-label', data.title );
		BUTTON.innerHTML = '<span class="' + CORE.classes.icon + ' cico ' + data.icon + '"></span><span class="' + CORE.classes.title + '"><span>' + data.title + '</span></span>';

		if( isObject( data.dataset ) ){

			for( a in data.dataset ){
				BUTTON.dataset[a] = data.dataset[a];

			}

		}

		if( isFunction( data.event ) ){
			node( BUTTON ).on( 'click', data.event );

		}
		return BUTTON;

	}

};

export default function( parentNode ){
	var b, button;

	if( !isNode( parentNode ) ){
		return false;

	}

	for( b in CORE.buttons ){
		button = CORE.createButton( CORE.buttons[b] );
		parentNode.appendChild( button );

	}

	return {
		target: parentNode,
		destroy: function(){
			parentNode.innerHTML = '';

		}

	};

}