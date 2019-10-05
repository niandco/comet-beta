import { frame as getFrame, getDeviceType, panel as getPanel } from '../stored.js';
import { isArray, isObject, isBool, isNode } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import Global from '../../../utils/global.js';
import node from '../../../dom/element.js';

const DOCUMENT = document;

const __ClassName = ClassName( 'comet-device' );

const CORE = {

	slug: 'deviceType',

	classes: {
		active: 'comet-panel__control__field--active'

	},

	devices: {
		desktop: {
			width: '100%',
			name: __cometi18n.ui.desktop,
			classes: {
				name: __ClassName.modifier( 'desktop' ),
				icon: 'cico-desktop'
			}
		},
		tablet: {
			width: '800px',
			name: __cometi18n.ui.tablet,
			classes: {
				name: __ClassName.modifier( 'tablet' ),
				icon: 'cico-tablet'
			}
		},
		mobile: {
			width: '400px',
			name: __cometi18n.ui.mobile,
			classes: {
				name: __ClassName.modifier( 'mobile' ),
				icon: 'cico-mobile'
			}
		}

	},

	switch: function( target, active ){

		if( isBool( active ) && active ){
			node( target ).addClass( CORE.classes.active );
			return;

		}
		node( target ).removeClass( CORE.classes.active );

	}

};

export default function( ev_source, source ){

	const frame = getFrame();

	const device = getDeviceType();

	var next_device = 'tablet';

	var inner, panel, a, b, c, control, active;

	ev_source.preventDefault();

	if( !frame || !( device in CORE.devices ) ){
		return;

	}
	next_device = device === 'desktop' ? 'tablet' : ( device === 'tablet' ? 'mobile' : 'desktop' );

	inner = '<span class="comet-cockpit__footer__button__icon cico ' + CORE.devices[next_device].classes.icon + '"></span>';
	inner += '<span class="comet-cockpit__footer__button__title"><span>' + CORE.devices[next_device].name + '</span></span>';

	source.dataset.device = next_device;
	source.innerHTML = inner;

	frame.removeClass( CORE.devices[device].classes.name );
	frame.addClass( CORE.devices[next_device].classes.name );
	frame.target.style.width = CORE.devices[next_device].width;
	Global().set( CORE.slug, next_device, true );

	if( !( panel = getPanel() ) || !isArray( panel.controls ) || panel.controls.length < 1 ){
		return;

	}

	for( a = 0; a < panel.controls.length; a++ ){

		if( ( control = panel.controls[a] ).responsive !== true ){
			continue;

		}

		if( !isObject( control.target ) ){
			continue;

		}

		for( b in control.target ){

			if( !isArray( control.target[b] ) || control.target[b].length < 1 ){
				continue;

			}
			active = b === next_device;

			for( c = 0; c < control.target[b].length; c++ ){

				if( !isNode( control.target[b][c] ) ){
					continue;

				}
				CORE.switch( control.target[b][c], active );

			}

		}

	}

}