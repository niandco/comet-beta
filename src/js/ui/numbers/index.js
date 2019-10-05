import { isString, isBool, isArray, isNode, isObject } from '../../utils/is.js';
import { createInputField } from '../../editor/components/panel/control.js';
import { getDeviceType } from '../../editor/components/stored.js';
import { ClassName } from '../../utils/className.js';
import update from '../../editor/control/update.js';
import { stripTags } from '../../utils/fill.js';
import { TARGET } from '../../editor/target.js';
import { DATA } from '../../editor/data.js';
import node from '../../dom/element.js';

/* global document, __cometi18n */

const DOCUMENT = document;

const FRAGMENT = DOCUMENT.createDocumentFragment();

const CORE = {

	classes: {
		wrapper: 'comet-panel__control__uiwrap',
		numbers: 'comet-panel__control__uiwrap--numbers',
		number: 'comet-panel__control__uiwrap--numbers__number',
		vernum: 'comet-panel__control__vernum',
		locked: 'comet-panel__control__vernum--locked',
		active: 'comet-panel__control__field--active'

	},

	vernum: function( ev, ui ){

		ev.preventDefault();

		if( isBool( ui.__isLocked ) && ui.__isLocked ){
			ui.firstChild.className = 'cico cico-unlock';
			ui.title = __cometi18n.ui.unlocked;
			ui.__isLocked = false;

		}else{
			ui.firstChild.className = 'cico cico-lock';
			ui.title = __cometi18n.ui.locked;
			ui.__isLocked = true;

		}

	},

	update: function( ev, ui, data ){
		const currentDevice = getDeviceType();
		var num, input, d, t_id, t_type, edata;

		ev.preventDefault();

		if( !( currentDevice in data.devices ) ){
			return;

		}
		num = parseFloat( ui.value );

		if( !isBool( data.vernumNode.__isLocked ) || !data.vernumNode.__isLocked ){
			update( ui );
			return;

		}

		if( ( t_id = TARGET.id() ) && ( t_type = TARGET.type() ) ){

			for( d in data.devices[currentDevice] ){

				if( !isNode( data.devices[currentDevice][d] ) || ( input = data.devices[currentDevice][d].firstChild ).nodeName !== 'INPUT' ){
					continue;

				}

				if( input === ui ){
					continue;

				}
				edata = {};
				input.value = num;
				edata[input.name] = num;
				DATA.set( t_id, t_type, edata );

			}
		}

	},

	getValue: function( slug, data ){
		var value = '';

		if( 'std' in data.data ){
			value = data.data.std;

		}

		if( slug in data.current ){
			value = data.current[slug];

		}
		return value;

	},

	createNumber: function( data, device, devices, vernumNode ){
		const wrapNode = DOCUMENT.createElement( 'div' );

		var inner = createInputField( 'number', data.name, data.value );

		inner += '<label>' + data.label + '</label>';

		if( data.type === device ){
			wrapNode.className = ClassName( CORE.classes.number ).combineWith( [ CORE.classes.active ] );

		}else{
			wrapNode.className = CORE.classes.number;

		}
		wrapNode.innerHTML = inner;

		node( wrapNode.firstChild ).on( 'input', CORE.update, { devices, vernumNode } );

		if( !isArray( devices[data.type] ) ){
			devices[data.type] = [];

		}
		devices[data.type][devices[data.type].length] = wrapNode;

		return wrapNode;

	}

};

export default function( data ){

	var option, options, id, response, inner, vernumNode;

	const isResponsive = isBool( data.data.responsive ) && data.data.responsive;

	const devices = {
		tablet: [],
		mobile: [],
		desktop: []
	};

	const device = getDeviceType();

	inner = '<button class="' + CORE.classes.vernum + '" title="' + __cometi18n.ui.unlocked + '">';
	inner += '<span class="cico cico-unlock"></span>';
	inner += '</button>';

	inner += '<div class="' + ClassName( CORE.classes.wrapper ).combineWith( [ CORE.classes.numbers ] ) + '" ></div>';

	data.control.innerHTML = inner;
	vernumNode = data.control.firstChild;
	vernumNode.__isLocked = false;

	node( vernumNode ).on( 'click', CORE.vernum );

	if( !isObject( options = data.data.values ) ){
		return null;

	}

	for( option in options ){

		response = CORE.createNumber( {
			type: 'desktop',
			label: isString( options[option].label ) ? stripTags( options[option].label ) : '',
			name: ( id = data.id + option ),
			value: CORE.getValue( id, data )

		}, device, devices, vernumNode );

		if( !response ){
			continue;

		}
		data.control.lastChild.appendChild( response );

		if( !isResponsive ){
			continue;

		}

		response = CORE.createNumber( {
			type: 'tablet',
			label: isString( options[option].label ) ? stripTags( options[option].label ) : '',
			name: id + 't',
			value: CORE.getValue( id + 't', data )

		}, device, devices, vernumNode );

		if( !response ){
			continue;

		}
		data.control.lastChild.appendChild( response );

		response = CORE.createNumber( {
			type: 'mobile',
			label: isString( options[option].label ) ? stripTags( options[option].label ) : '',
			name: id + 'm',
			value: CORE.getValue( id + 'm', data )

		}, device, devices, vernumNode );

		if( !response ){
			continue;

		}
		data.control.lastChild.appendChild( response );

	}
	return devices;

}