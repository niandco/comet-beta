import { isFunction, isObject, isString, isBool, isNumber, isArray, isEmpty, isNode } from '../../../utils/is.js';
import f_gradient from '../../../utils/ui/gradient.js';
import f_color from '../../../utils/ui/color-picker.js';
import sanitize from '../../../utils/sanitize.js';
import f_range from '../../../utils/ui/range.js';
import f_numbers from './fields/numbers.js';
import global from '../../../utils/global.js';
import layout from '../../../utils/layout.js';
import nodes from '../../../dom/elements.js';
import parse from '../../../utils/parse.js';
import utils from '../../../utils/utils.js';
import node from '../../../dom/element.js';
import f_icon from './fields/icon.js';
import __target from '../../target.js';
import update from '../../update.js';
import panel from './index.js';
import __data from '../../data.js';
import __id from '../../id.js';

/* global document, wp, __cometi18n */

const DOCUMENT = document;

const __create = function( tabs, data ){

	const _d = document;

	const __fieldsJs = [];

	const __core = {

		data: {
			controls: {
				all: {},
				toggle: {},
			},

		},

		classes: {
			active: 'comet-active',
			hide: 'comet-hide',
			tab: 'comet-tab'

		},

		actions: {

			tab: function( ev, ui, contentNode ){
				ev.preventDefault();
				nodes( ui.parentNode.children ).removeClass( __core.classes.active );
				nodes( contentNode.parentNode.children ).removeClass( __core.classes.active );
				node( contentNode ).addClass( __core.classes.active );
				node( ui ).addClass( __core.classes.active );

			},

			section: function( ev, ui, contentNode ){
				ev.preventDefault();
				node( contentNode ).toggleClass( __core.classes.active );

			},

			update: function( _node ){

				node( _node ).on( 'input', function( ev, ui ){
					update( ui );

				});

			},

			switch: function( _node, fieldData ){
				const sdata = fieldData.switch;
				var a, b, slug, len;

				for( a in sdata ){

					if( !isArray( sdata[a] ) || isEmpty( sdata[a] ) ){
						continue;

					}

					for( b = 0; b < sdata[a].length; b++ ){

						if( !( ( slug = sdata[a][b] ) in __core.data.controls.toggle ) || !isObject( __core.data.controls.toggle[slug] ) ){
							__core.data.controls.toggle[slug] = {};

						}

						if( !isArray( __core.data.controls.toggle[slug].values ) || isEmpty( __core.data.controls.toggle[slug].values ) ){
							__core.data.controls.toggle[slug].values = [];

						}
						len = __core.data.controls.toggle[slug].values.length;
						__core.data.controls.toggle[slug].values[len] = a;
						__core.data.controls.toggle[slug].node = _node;

					}

				}

				node( _node ).on( 'input', function( ev, ui ){
					const value = ui.value;
					const isCheckbox = ( ui.nodeName === 'INPUT' && ui.type === 'checkbox' );
					const isChecked = ( isCheckbox && ui.checked );
					var isValue = false;

					for( a in sdata ){
						isValue = ( value === a );

						if( !isArray( sdata[a] ) ){
							continue;

						}

						for( b = 0; b < sdata[a].length; b++ ){

							if( !( ( slug = sdata[a][b] ) in __core.data.controls.all ) ){
								continue;

							}

							if( ( !isCheckbox && isValue ) || isChecked ){
								node( __core.data.controls.all[slug].target ).removeClass( __core.classes.hide );
								continue;

							}
							node( __core.data.controls.all[slug].target ).addClass( __core.classes.hide );

						}

					}

				});

			},

			initControlsState: function(){
				var a, _node, checkbox, checked;

				if( !isObject( __core.data.controls.toggle ) || !isObject( __core.data.controls.all ) ){
					return false;

				}

				for( a in __core.data.controls.toggle ){

					if( !isObject( __core.data.controls.toggle[a] ) ){
						continue;

					}
					_node = __core.data.controls.toggle[a].node;
					checkbox = ( _node.nodeName === 'INPUT' && _node.type === 'checkbox' );
					checked = ( checkbox && _node.checked );

					if( ( !checkbox && __core.data.controls.toggle[a].values.indexOf( _node.value ) > -1 ) || checked ){
						node( __core.data.controls.all[a].target ).removeClass( __core.classes.hide );
						continue;

					}
					node( __core.data.controls.all[a].target ).addClass( __core.classes.hide );

				}

			}
		},

		create: {

			tabs: function(){
				const oTabs = _d.createDocumentFragment();
				const oContent = _d.createDocumentFragment();
				var count = 1;
				var a, isItems, t, tab, content;

				if( isObject( tabs ) ){

					for( a in tabs ){
						isItems = ( a === 'items' );

						if( !isObject( t = tabs[a] ) || !isString( t.name ) || ( !isItems && !isObject( t.sections ) ) || ( isItems && !isObject( t.tabs ) ) ){
							continue;

						}
						tab = _d.createElement( 'button' );
						tab.className = __core.classes.tab + ( count === 1 ? ' ' + __core.classes.active : '' );
						tab.innerHTML = t.name;
						oTabs.appendChild( tab );

						content = _d.createElement( 'div' );
						content.className = __core.classes.tab + ( count === 1 ? ' ' + __core.classes.active : '' );
						content.appendChild( __core.create.tab( ( isItems ? t.tabs : t.sections ), isItems ) );
						oContent.appendChild( content );

						node( tab ).on( 'click', __core.actions.tab, content );
						count++;

					}
					__core.actions.initControlsState();

				}

				global().set( 'panelFields', __fieldsJs, true );

				return {
					tabs: oTabs,
					content: oContent
				};

			},

			tab: function( sections, isItems ){
				const oTab = _d.createDocumentFragment();
				var section, a, s, dataItem, ids, id;

				if( isBool( isItems ) && isItems ){

					section = _d.createElement( 'div' );
					section.className = 'comet-section comet-items comet-ui';
					section.innerHTML = '<div class="comet-items comet-items-sortable"></div><div class="comet-buttonset"><button class="comet-button comet-buttonPrimary" aria-label="' + __cometi18n.ui.addItem + '"><span class="cico cico-plus"></span><span class="comet-title">' + __cometi18n.ui.addItem + '</span></button></div>';
					oTab.appendChild( section );

					if( isObject( data ) && isString( data._items ) && !isEmpty( data._items ) && ( ids = parse.ids( data._items, 'array' ) ).length > 0 ){

						for( a = 0; a < ids.length; a++ ){

							if( !( id = parse.id( ids[a] ) ) || !( dataItem = __data().get( id, 'items' ) ) ){
								continue;

							}
							section.firstChild.appendChild( createItem( id, dataItem.title ) );

						}
					}

					node( section.lastChild.firstChild ).on( 'click', __core.actions.item.add, section.firstChild );

					return oTab;

				}

				if( isObject( sections ) ){ 

					for( a in sections ){

						if( !isObject( s = sections[a] ) || !isString( s.name ) || !isObject( s.fields ) ){
							continue;

						}
						section = _d.createElement( 'div' );
						section.className = 'comet-section comet-ui';
						section.innerHTML = '<h4 class="comet-header comet-title">' + s.name + '</h4><div class="comet-body"></div>';
						oTab.appendChild( section );

						section.lastChild.appendChild( __core.create.fields( s.fields ) );

						node( section.firstChild ).on( 'click', __core.actions.section, section.lastChild );
					}
				}
				return oTab;

			},

			fields: function( fields ){
				const oFields = _d.createDocumentFragment();
				var f, a, field, meta, oField;

				if( isObject( fields ) ){

					for( a in fields ){

						if( !isObject( f = fields[a] ) || !isString( f.type ) || !isString( f.label ) ){
							continue;

						}
						if( !( oField = __core.create.field( a, f ) ) ){
							continue;

						}
						f.type = ( utils.stripTags( f.type.toLowerCase() ) ).trim();
						field = _d.createElement( 'div' );
						field.className = 'comet-control comet-control-' + f.type;
						field.innerHTML = '<div class="comet-meta"></div><div class="comet-field-wrap"></div>';
						oFields.appendChild( field );

						meta = '<label>' + ( utils.stripTags( f.label ) ).trim() + '</label>';

						if( isString( f.desc ) && !isEmpty( f.desc ) ){
							meta += '<span class="comet-tooltip">';
							meta += '<span class="comet-icon">?</span>';
							meta += '<span class="comet-description comet-inner">' + utils.stripTags( f.desc, '<b><strong><i><a><span><sub><sup><ins>' ) + '</span>';
							meta += '</span>';

						}
						field.firstChild.innerHTML = meta;
						field.lastChild.appendChild( oField );

						if( !isObject( __core.data.controls.all[a] ) ){
							__core.data.controls.all[a] = {};

						}
						__core.data.controls.all[a].target = field;

					}

				}
				return oFields;
			},

			field: function( slug, field ){

				var fieldClass = 'comet-field';

				var value = '';

				const isSwitch = ( 'switch' in field && isObject( field.switch ) );

				const fields = {

					text: function(){

						const _node = _d.createElement( 'input' );
						_node.type = 'text';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = value;
						__core.actions.update( _node );

						return _node;

					},

					textarea: function(){

						const _node = _d.createElement( 'textarea' );
						_node.name = slug;
						_node.className = fieldClass;
						_node.innerHTML = value;
						__core.actions.update( _node );

						return _node;

					},

					select: function(){

						var v, values, _option;

						const _node = _d.createElement( 'select' );
						_node.name = slug;
						_node.className = fieldClass;

						if( isObject( values = field.values ) ){

							for( v in values ){

								if( !isString( values[v] ) && !isNumber( values[v] ) ){
									continue;

								}
								_option = _d.createElement( 'option' );
								_option.value = v;
								_option.innerHTML = utils.stripTags( values[v].toString() );

								if( v === value ){
									_option.selected = true;

								}
								_node.appendChild( _option );

							}

						}
						__core.actions.update( _node );

						if( isSwitch ){
							__core.actions.switch( _node, field );

						}
						return _node;

					},

					checkbox: function(){

						const _node = _d.createElement( 'input' );
						_node.type = 'checkbox';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = 'true';

						if( value === 'true' ){
							_node.checked = true;

						}
						__core.actions.update( _node );

						if( isSwitch ){
							__core.actions.switch( _node, field );

						}
						return _node;

					},

					radio: function(){

						const onradio = function( ev, ui ){
							const parentNode = ui.parentNode;
							var dren;

							if( parentNode === null || ( dren = parentNode.children ).length < 1 ){
								return;

							}
							nodes( dren ).removeClass( __core.classes.active );
							node( ui ).addClass( __core.classes.active );
							update( ui.firstElementChild );

							if( isSwitch ){
								__core.actions.switch( ui.firstElementChild, field );

							}

						};

						const fragment = _d.createDocumentFragment();

						var _radio, values, v, inner;

						if( isObject( values = field.values ) ){

							for( v in values ){

								if( !isObject( values[v] ) || !isString( values[v].title ) || !isString( values[v].icon ) ){
									continue;

								}
								_radio = _d.createElement( 'label' );
								_radio.className = 'comet-label comet-ui' + ( v === value ? ' ' + __core.classes.active : '' );
								fragment.appendChild( _radio );
								inner = '<input type="radio" class="' + fieldClass + '" name="' + slug + '"value="' + v + '" />';
								inner += '<span class="comet-icon ' + ( utils.stripTags( values[v].icon ) ).trim() + '"></span>';
								inner += '<span class="comet-title">' + ( utils.stripTags( values[v].title, '<b><strong><i><span><u><ins>' ) ).trim() + '</span>';
								_radio.innerHTML = inner;

								if( v === value ){
									_radio.firstChild.checked = true;

								}
								node( _radio ).on( 'click', onradio );

							}

						}

						return fragment;

					},

					range: function(){

						const _node = _d.createElement( 'input' );
						_node.type = 'hidden';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = value;
						_node.min = sanitize.number({ value: field.min, min: 0 });
						_node.max = sanitize.number({ value: field.max, min: _node.min });
						_node.step = sanitize.number({ value: field.step, min: 0.01 });
						_node.dataset.unit = isString( field.unit ) ? utils.stripTags( field.unit ) : '';

						__fieldsJs[__fieldsJs.length] = {
							type: field.type,
							node: _node
						}

						return _node;

					},

					number: function(){

						var unit, _unit;

						const fragment = _d.createDocumentFragment();

						const _node = _d.createElement( 'input' );
						_node.type = 'number';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = value;

						fragment.appendChild( _node );

						if( isString( unit = field.unit ) ){
							_unit = _d.createElement( 'span' );
							_unit.className = 'comet-unit';
							_unit.innerHTML = utils.stripTags( unit );
							fragment.appendChild( _unit );

						}
						__core.actions.update( _node );

						return fragment;

					},

					numbers: function(){

						return f_numbers( slug, field, data );

					},

					color: function(){

						const fragment = _d.createDocumentFragment();
						const _node = _d.createElement( 'input' );
						_node.type = 'text';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = value;

						fragment.appendChild( _node );

						f_color( _node, {
							opacity: true,
							input: true,
							clear: true,
							onchange: function( ui, source ){
								update( source );

							}

						});

						return fragment;

					},

					editor: function(){
						var op;

						const _node = _d.createElement( 'textarea' );
						_node.name = slug;
						_node.className = fieldClass + ( isString( op = field.option ) && [ 'advanced', 'force_tag' ].indexOf( op = op.trim() ) > -1 ? ( op === 'advanced' ? ' comet-fieldEditorAdvanced' : ' comet-fieldEditorForceTag' ) : '' );
						_node.innerHTML = value;
						__core.actions.update( _node );

						return _node;

					},

					gradient: function(){

						const fragment = _d.createDocumentFragment();
						const _node = _d.createElement( 'input' );
						_node.type = 'hidden';
						_node.name = slug;
						_node.className = fieldClass;
						_node.value = value;
						fragment.appendChild( _node );

						f_gradient( _node, {
							size: 20,
							onchange: function( ui ){
								update( ui );

							}
						} );

						return fragment;

					},

					icon: function(){

						return f_icon( slug, field, data );

					},

					image: function(){

						var input = null;

						var _value = isString( value ) ? ( utils.stripTags( value ) ).trim() : '';

						const wrapper = _d.createElement( 'div' );

						const __img = {

							open: function( ev ){
								var args, media;

								ev.preventDefault();
								ev.stopPropagation();

								if( media ){
									media.open();
									return;
								}

								args = {
									frame: 'select',
									title: __cometi18n.ui.selImage,
									library: {
										type: 'image'
									},
									button: {
										text: __cometi18n.ui.select,
									},
									multiple: false,
									editing:    true,
									filterable: true,
									searchable: true,
									sortable: true

								};

								media = wp.media( args );

								media.on( 'select', function(){
									const att = media.state().get('selection').first().toJSON();
									_value = isString( _value = att.url ) ? ( ( _value = ( utils.stripTags( _value ) ).trim() ) !== '' ? _value : '' ) : '';

									input.value = _value;
									__img.create();
									update( input );

								});
								media.open();

							},

							delete: function( ev ){
								ev.preventDefault();
								ev.stopPropagation();
								_value = '';
								input.value = _value;
								__img.create();
								update( input );

							},

							create: function(){

								const browse = __cometi18n.ui.browse;
								const remove = __cometi18n.ui.remove;
								const buttonClass = 'comet-button';
								const wcn = wrapper.childNodes;
								const button = _d.createElement( 'button' );
								var n = 0;

								while( n < wcn.length ){

									if( wcn[n] !== input ){
										wrapper.removeChild( wcn[n] );

									}
									n++;

								}

								if( _value === '' ){
									button.className = buttonClass + ' comet-buttonPrimary comet-upload';
									button.innerHTML = browse;
									wrapper.appendChild( button );
									node( button ).on( 'click', __img.open );
									return;

								}
								const oh = _d.createElement( 'div' );
								wrapper.appendChild( oh );
								oh.className = 'comet-media comet-wrapper comet-image';
								oh.title = browse;
								oh.innerHTML = '<img src="' + _value + '"/>';
								node( oh ).on( 'click', __img.open );

								button.className = buttonClass + ' comet-remove';
								button.title = remove;
								button.innerHTML = '<span class="cico cico-x"></span>';
								oh.appendChild( button );
								node( button ).on( 'click', __img.delete );
							}

						};

						wrapper.className = 'comet-uploader comet-image comet-wrapper';
						wrapper.innerHTML = '<input type="hidden" name="' + slug + '" class="' + fieldClass + '" value="' + _value + '" />';
						input = wrapper.firstChild;
						__img.create();

						return wrapper;

					}

				};

				if( 'std' in field ){
					value = field.std;

				}

				if( slug in data ){
					value = data[slug];

				}

				if( !isObject( __core.data.controls.all[slug] ) ){
					__core.data.controls.all[slug] = {};

				}
				__core.data.controls.all[slug].value = value;

				return ( isFunction( fields[field.type] ) ? fields[field.type]() : false );

			}

		},

	};
	data = isObject( data ) ? data : {};

	return __core.create.tabs();

};

export default __create;