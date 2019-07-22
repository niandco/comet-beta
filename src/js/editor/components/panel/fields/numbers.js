import { frame as getFrame } from '../../stored.js';
import utils from '../../../../utils/utils.js';
import node from '../../../../utils/node.js';
import redefine from '../../../redefine.js';
import update from '../../../update.js';
import __target from '../../../target.js';
import __data from '../../../data.js';

/* global document, __cometi18n */

export default function( id, field, data ){

	var inner, _dd, v, values, _id, _responsive, tmp;

	var is_locked = false;

	var device = 'desktop';

	const _d = document;

	const is_responsive = ( utils.isString( field.responsive ) && [ 'true', 'yes' ].indexOf( ( field.responsive ).toLowerCase() ) > -1 );

	const devices = {
		tablet: [],
		mobile: [],
		desktop: []
	};

	const frame = getFrame();

	const classes = {
		active: 'comet-active',
		locked: 'comet-locked',
		tablet: 'cpb-devicetype-tablet',
		mobile: 'cpb-devicetype-mobile'
	};

	const __core = {

		devices: function( ev, ui, e ){
			const _body = node( _d.body );
			var _device, ico, d;

			ev.preventDefault();
			ev.stopPropagation();

			switch( e.device ){
				
				case 'tablet':
				ico = 'cico-tablet';
				frame.style.maxWidth = '800px';
				_body.addClass( classes.tablet );
				break;

				case 'mobile':
				ico = 'cico-mobile';
				frame.style.maxWidth = '400px';
				_body.addClass( classes.mobile );
				break;

				case 'desktop':
				default:
				ico = 'cico-desktop';
				_body.removeClass( classes.tablet );
				_body.removeClass( classes.mobile );
				redefine.workflow();

			}
			device = e.device;
			e.icon.className = 'cico ' + ico;

			for( d in devices ){

				if( !utils.isArray( devices[d] ) ){
					return;

				}
				_device = node( devices[d] );

				if( d === e.device ){
					_device.addClass( classes.active );

				}else{
					_device.removeClass( classes.active );

				}

				if( is_locked ){
					_device.addClass( classes.locked );
					continue;

				}
				_device.removeClass( classes.locked );

			}

		},

		vernum: function( ev, ui ){
			var d, _device;

			ev.preventDefault();

			is_locked = utils.isBool( is_locked ) && is_locked ? false : true;

			if( is_locked ){
				ui.firstChild.className = 'cico cico-lock';
				ui.title = __cometi18n.ui.locked;

			}else{
				ui.firstChild.className = 'cico cico-unlock';
				ui.title = __cometi18n.ui.unlocked;

			}

			for( d in devices ){

				if( !utils.isArray( devices[d] ) ){
					return;

				}
				_device = node( devices[d] );

				if( d === device  && is_locked ){
					_device.addClass( classes.locked );
					continue;

				}
				_device.removeClass( classes.locked );

			}

		},

		update: function( ev, ui, type ){
			var num, input, d, target_, t_id, t_type, data_, edata;
			
			ev.preventDefault();

			if( !( type in devices ) ){
				return;

			}
			num = parseFloat( ui.value );

			if( is_locked ){
				target_ = __target();

				if( ( t_id = target_.id() ) && ( t_type = target_.type() ) ){
					data_ = __data();

					for( d in devices[type] ){

						if( !node( devices[type][d] ).isNode() || !node( input = devices[type][d].firstChild ).hasClass( 'comet-field' ) || input === ui ){
							continue;

						}
						edata = {};
						input.value = num;
						edata[input.name] = num;
						data_.set( t_id, t_type, edata );

					}
				}

			}
			update( ui );

		},

		get_value: function( slug, _field ){
			var value = '';

			if( 'std' in _field ){
				value = _field.std;

			}

			if( slug in data ){
				value = data[slug];

			}
			return value;

		},

		number: function( type, e ){
			var className = 'comet-number comet-wrapper';
			var _node, len;

			if( !( type in devices ) ){
				return false;

			}

			if( is_locked ){
				className += ' ' + classes.locked;

			}

			if( type === 'desktop' ){
				className += ' ' + classes.active;

			}
			_node = _d.createElement( 'div' );
			_node.className = className;
			_node.innerHTML = '<input type="number" class="comet-field" name="' + e.name + '" value="' + e.value + '" /><label>' + e.label + '</label>';
			
			node( _node.firstChild ).on( 'input change', __core.update, type );
			
			if( utils.isArray( devices[type] ) ){
				len = devices[type].length;
				devices[type][len] = _node;

			}else{
				devices[type] = [];
				devices[type][0] = _node;

			}

			return _node;

		}

	};

	const fragment = _d.createDocumentFragment();

	const _num = _d.createElement( 'div' );

	const _lock = _d.createElement( 'button' );

	data = utils.isObject( data ) ? data : {};

	_lock.className = 'comet-vernum comet-upper';
	_lock.title = __cometi18n.ui.unlocked;
	_lock.innerHTML = '<span class="cico cico-unlock"></span>';

	node( _lock ).on( 'click', __core.vernum );

	fragment.appendChild( _lock );

	if( is_responsive ){
		_responsive = _d.createElement( 'div' );
		_responsive.className = 'comet-switch comet-devices comet-dropdown comet-upper';

		inner = '<span class="cico cico-desktop"></span>';
		inner += '<div class="comet-items">';
		inner += '<button class="comet-device" data-device="d"><span class="cico cico-desktop"></span>' + __cometi18n.ui.desktop + '</button>';
		inner += '<button class="comet-device" data-device="t"><span class="cico cico-tablet"></span>' + __cometi18n.ui.tablet + '</button>';
		inner += '<button class="comet-device" data-device="m"><span class="cico cico-mobile"></span>' + __cometi18n.ui.mobile + '</button>';
		inner += '</div>';
		_responsive.innerHTML = inner;

		_dd = _responsive.lastChild.children;

		node( _dd[0] ).on( 'click', __core.devices, { icon: _responsive.firstChild, device: 'desktop' } );
		node( _dd[1] ).on( 'click', __core.devices, { icon: _responsive.firstChild, device: 'tablet' } );
		node( _dd[2] ).on( 'click', __core.devices, { icon: _responsive.firstChild, device: 'mobile' } );

		fragment.appendChild( _responsive );

	}
	_num.className = 'comet-wrapper comet-numbers';
	fragment.appendChild( _num );

	if( utils.isObject( values = field.values ) ){

		for( v in values ){

			tmp = __core.number( 'desktop', {
				label: utils.isString( values[v].label ) ? utils.trim( utils.stripTags( values[v].label ) ) : '',
				name: ( _id = id + v ),
				value: __core.get_value( _id, values[v] )

			} );

			if( !tmp ){
				continue;

			}
			_num.appendChild( tmp );

			if( !is_responsive ){
				continue;

			}

			tmp = __core.number( 'tablet', {
				label: utils.isString( values[v].label ) ? utils.trim( utils.stripTags( values[v].label ) ) : '',
				name: _id + 't',
				value: __core.get_value( _id + 't', values[v] )

			} );

			if( !tmp ){
				continue;

			}
			_num.appendChild( tmp );


			tmp = __core.number( 'mobile', {
				label: utils.isString( values[v].label ) ? utils.trim( utils.stripTags( values[v].label ) ) : '',
				name: _id + 'm',
				value: __core.get_value( _id + 'm', values[v] )

			} );

			if( !tmp ){
				continue;

			}
			_num.appendChild( tmp );


		}

	}

	return fragment;

}