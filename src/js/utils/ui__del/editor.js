import __data from '../../editor/data.js';
import __global from '../global.js';
import parse from '../parse.js';
import utils from '../utils.js';
import node from '../node.js';

/* global document, window, __cometi18n */

/**
 * 
 * @param {Object}		source			Node to replace by the editor
 * @param {Object}		options			Inline editor options
 * @param {String}		options.type	advanced/basic
 * @param {Integer}		options.id		Element id
 * @param {String}		options.slug	Matching setting slug
 * @param {String}		options.content	Content inner the HTML tag
 * @param {String}		options.tag		HTML tag wrapping the content
 *
 */
 export default function( source, options ){

 	const _d = document;

 	const _w =  window;

 	const __core = {

 		selection: {
 			range: false,
 			clicked: false

 		},

 		classes: {
 			active: 'comet-active',
 			hide: 'comet-hide',

 		},

 		element: {

 			id: false,

 			slug: false,

 			data: false,

 			build_meta: function(){
 				var data;

 				__core.element.id = parse.id( options.id );
 				__core.element.slug = utils.isString( options.slug ) ? utils.trim( options.slug ) : false;
 				__core.element.data = ( data = __data().get( __core.element.id, 'elements' ) ) ? data : false;


 			}

 		},

 		get: {

 			tags: function( oArray ){
 				const tags = [ 'span', 'br', 'ins', 'u', 'i', 'em', 'strong', 'b', 'strike', 'del', 'a', 'abbr', 'code', 'hr', 'mark', 'sup', 'sub', 's', 'small', 'cite', 'time', 'q' ];
 				var output = '';
 				var i = 0;

 				if( utils.isBool( oArray ) && oArray ){
 					return tags;

 				}

 				for( i; i < tags.length; i++ ){
 					output += '<' + utils.trim( tags[i] ) + '>';

 				}
 				return output;

 			},

 			textarea: function(){
 				const panel = utils.getNode( 'panel' );
 				var textarea, t;

 				if( !panel || ( textarea = _d.getElementsByTagName( 'textarea' ) ).length < 1 ){
 					return false;

 				}

 				for( t = 0; t < textarea.length; t++ ){

 					if( utils.isString( textarea[t].name ) && utils.trim( textarea[t].name ) === meta_element.slug ){
 						return textarea[t];

 					}

 				}
 				return false;

 			}

 		},

 		toolbar: {

 			slug: 'editorToolbar',

 			get: function(){
 				const meta = __global().get( __core.toolbar.slug );

 				if( !utils.isObject( meta ) || !node( meta.node ).isNode() || meta.buttons.length < 1 ){
 					return __core.toolbar.create();


 				}
 				return meta;

 			},

 			close: function( ev ){
 				const meta = __core.toolbar.get();

 				ev.preventDefault();

 				if( !meta ){
 					return;

 				}
 				node( meta.node ).addClass( __core.classes.hide );

 			},

 			buttons: function(){

 				const onbutton = {

 					default: function( command, val ){
 						var sel;
 						//var range;

 						val = !utils.isStringEmpty( val ) ? utils.trim( val ) : null;

 						if( !_w.getSelection || !_w.getSelection().modify || __core.selection.range === null ){
 							return;

 						}
 						sel = _w.getSelection();

 						if( __core.selection.clicked ){
 							sel.removeAllRanges();
 							sel.addRange( __core.selection.range );

 						}

 						if( sel.type === 'Caret' ){
 							sel.modify('move', 'backward', 'word');
 							sel.modify('extend', 'forward', 'word');

 						}
 						//range = sel.getRangeAt(0);
 						_d.execCommand( command, false, val );
 						__core.selection.clicked = false;

 					},

 					toggle: function( ui ){
 						const _ui = node( ui );

 						if( _ui.hasClass( __core.classes.active ) ){
 							_ui.removeClass( __core.classes.active );
 							return false;

 						}
 						_ui.addClass( __core.classes.active );
 						return true;

 					}


 				};

 				return [
 				{
 					command: 'bold',
 					icon: 'cico cico-bold',
 					title: __cometi18n.ui.bold,
 					do: function( ev, ui ){
 						ev.preventDefault();
 						onbutton.toggle( ui );
 						onbutton.default( 'bold' );

 					}
 				},

 				{
 					command: 'italic',
 					icon: 'cico cico-italic',
 					title: __cometi18n.ui.italic,
 					do: function( ev, ui ){
 						ev.preventDefault();
 						onbutton.toggle( ui );
 						onbutton.default( 'italic' );

 					}
 				},

 				{
 					command: 'underline',
 					icon: 'cico cico-underline',
 					title: __cometi18n.ui.underline,
 					do: function( ev, ui ){
 						ev.preventDefault();
 						onbutton.toggle( ui );
 						onbutton.default( 'underline' );

 					}
 				},

 				{
 					command: 'strikeThrough',
 					icon: 'cico cico-striketrough',
 					title: __cometi18n.ui.st,
 					do: function( ev, ui ){
 						ev.preventDefault();
 						onbutton.toggle( ui );
 						onbutton.default( 'strikeThrough' );

 					}
 				},

 				{
 					command: 'link',
 					icon: 'cico cico-link',
 					title: __cometi18n.ui.ilink,
 					render: function( button ){
 						var inner, input, createLink;
 						const inline = _d.createElement( 'div' );

 						inner = '<div class="comet-absui comet-tooltip">';
 						inner += '<input type="text" class="comet-input value="" />';
 						inner += '<button class="comet-button comet-done">';
 						inner += '<span class="comet-icon cico cico-break"></span><span class="comet-title comet-tooltip">' + __cometi18n.ui.ilink + '</span>';
 						inner += '</button>';
 						inner += '</div>';

 						inline.className = 'comet-inline';
 						inline.innerHTML = inner;
 						inline.appendChild( button );

 						input = inline.firstChild.firstChild;
 						createLink = inline.firstChild.lastChild;

 						node( createLink ).on( 'click', function( ev ){
 							const val = utils.isString( input.value ) ? utils.trim( utils.stripTags( input.value ) ) : '';
 							const state = val === '' ? 'unlink' : 'createLink';

 							ev.preventDefault();

 							onbutton.default( state, val );

 						});

 						return inline;

 					},
 					do: function( ev, ui ){
 						const _p = node( ui.parentNode );

 						ev.preventDefault();

 						if( onbutton.toggle( ui ) ){
 							_p.addClass( __core.classes.active );
 							return;

 						}
 						_p.removeClass( __core.classes.active );

 					}
 				}];

 			},

 			create: function(){
 				var button, oButton, inner, oInner, bClasses, b;
 				const fragment = _d.createDocumentFragment();
 				const oToolbar = _d.createElement( 'div' );
 				const buttons = __core.toolbar.buttons();
 				const meta = {
 					node: oToolbar,
 					buttons: []
 				};

 				oToolbar.className = 'comet-toolbar comet-ui comet-inline comet-float';

 				oInner = '<div class="comet-header">';
 				oInner += '<button class="comet-dragger comet-ui"><span class="cico cico-more"></span></button>';
 				oInner += '<button class="comet-close" title="' + __cometi18n.ui.close + '"><span class="cico cico-x"></span></button>';
 				oInner += '</div>';
 				oInner += '<div class="comet-body comet-buttonset"></div>';
 				oToolbar.innerHTML = oInner;

 				fragment.appendChild( oToolbar );

 				node( oToolbar.firstChild.lastChild ).on( 'click', __core.toolbar.close );
 				node( oToolbar.firstChild.firstChild ).on( 'mousedown', __core.toolbar.drag.dragstart );

 				for( b = 0; b < buttons.length; b++ ){
 					button = buttons[b];
 					oButton = _d.createElement( 'button' );
 					oButton.dataset.command = button.command;
 					oButton.className = 'comet-button comet-tbButton';
 					bClasses = 'comet-title';
 					inner = '';

 					if( 'icon' in button ){
 						inner += '<span class="comet-icon ' + button.icon + '"></span>';
 						bClasses += ' comet-tooltip';

 					}

 					if( 'title' in button ){
 						inner += '<span class="' + bClasses + '">' + button.title + '</span>';

 					}
 					oButton.innerHTML = inner;

 					if( utils.isFunction( button.render ) ){
 						oToolbar.lastChild.appendChild( button.render( oButton ) );

 					}else{
 						oToolbar.lastChild.appendChild( oButton );

 					}
 					node( oButton ).on( 'click', button.do );
 					meta.buttons[meta.buttons.length] = oButton;

 				}
 				_d.body.appendChild( fragment );
 				return __global().set( __core.toolbar.slug, meta, true );

 			},

 			set_position: function( data ){
 				var offsetTop, offsetLeft, min_top, min_left, max_top, max_left, top, left;

 				if( !utils.isObject( data ) || !( 'toolbar' in data ) || !( 'document' in data ) || !( 'frame' in data ) ){
 					return false;

 				}
 				offsetTop = data.frame.target.offsetTop;
 				offsetLeft = data.frame.target.offsetLeft;

 				if( !( 'pageY' in data ) || !( 'pageX' in data ) ){
 					top = offsetTop + 20;
 					left = offsetLeft + 20;

 				}else{

 				min_top = offsetTop;
 				min_left = offsetLeft;

 				max_left = ( data.frame.width + offsetLeft ) - data.toolbar.width;
 				max_top = ( data.frame.height + offsetTop ) - data.toolbar.height;

 				top = data.pageY <= min_top ? min_top : ( data.pageY >= max_top ? max_top : data.pageY );
 				left = data.pageX <= min_left ? min_left : ( data.pageX >= max_left ? max_left : data.pageX );
 			}

 					data.toolbar.target.style.top = top + 'px';
 					data.toolbar.target.style.left = left + 'px';

 				return true;

 			},

 			get_ui: function(){
 				const oDoc = _d.documentElement;
 				const _oDoc = node( oDoc );
 				const frame = utils.getNode( 'frame' );
 				const _frame = node( frame );
 				const toolbar = __core.toolbar.get().node;
 				const _toolbar = node( toolbar );

 				return {
 					toolbar: {
 						target: toolbar,
 						node: _toolbar,
 						width: _toolbar.width(),
 						height: _toolbar.height()
 					},
 					document: {
 						target: oDoc,
 						node: _oDoc,
 						width: _oDoc.width(),
 						height: _oDoc.height(),
 					},
 					frame: {
 						target: frame,
 						node: _frame,
 						width: _frame.width(),
 						height: _frame.height(),

 					}
 				};

 			},



 			drag: {

 				is_dragging: false,

 				dragstart: function( ev ){
 					const __object = __core.toolbar.get_ui();

 					ev.preventDefault();

 					__core.toolbar.drag.is_dragging = true;

 					__object.document.node.on( 'mouseup', __core.toolbar.drag.dragstop );
 					__object.document.node.on( 'mousemove', __core.toolbar.drag.dragging, __object );


 				},

 				dragstop: function(){
 					__core.toolbar.drag.is_dragging = false;

 				},

 				dragging: function( ev, ui, __object ){

 					if( !__core.toolbar.drag.is_dragging ){
 						return;

 					}
 					__object.pageY = ev.pageY;
 					__object.pageX = ev.pageX;
 					__core.toolbar.set_position( __object );

 				}

 			}


 		},

 		editor: {

 			create: function(){
 				const tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'div', 'aside', 'pre', 'blockquote', 'article', 'section' ];
 				const tag = utils.isString( options.tag ) ? utils.trim( options.tag.toLowerCase() ) : 'p';
 				const oObject = _d.createElement( tags.indexOf( tag ) < 0 ? 'p' : tag );

 				oObject.className = 'comet-editable comet-ui';
 				oObject.innerHTML = utils.isString( options.content ) ? utils.stripTags( options.content, __core.get.tags( false ) ) : 'Write something here...';
 				oObject.setAttribute( 'contenteditable', 'true' );

 				node( oObject ).on( 'click', __core.editor.focus );
 				node( oObject ).on( 'input', __core.editor.change );
 				node( oObject ).on( 'keypress', __core.editor.keypress );

 				return oObject;

 			},

 			keypress: function( ev ){

 				if( ev.keyCode === 13 ){
 					ev.preventDefault();
 					_d.execCommand( 'insertHTML', false, '<br><br>' );
 					return false;

 				}

 			},

 			focus: function( ev ){
 				const meta = __core.toolbar.get();
 				var buttons, _selection;

 				ev.preventDefault();
 				ev.stopPropagation();

 				if( !meta || !node( ev.target ).isNode() || ( buttons = meta.buttons ).length < 1 ){
 					return;

 				}
 				node( meta.node ).removeClass( __core.classes.hide );

 				if( _w.getSelection && ( _selection = _w.getSelection() ).modify ){
 					__core.selection.range = _selection.getRangeAt(0);
 					__core.selection.clicked = true;

 				}
 				_d.execCommand( 'insertBrOnReturn', false, true );
 				_d.execCommand( 'defaultParagraphSeparator', false, 'br' );

 				function isCommand( button, command ){
 					const cmd = parse.dataset( button, 'command' );

 					return ( utils.isString( cmd ) && utils.trim( cmd ) === command );

 				}

 				function parent( comp ){
 					var command, _button, b;

 					if( node( comp ).hasClass( __core.classes.editor ) || comp.parentNode === null ){
 						return;

 					}

 					switch( comp.nodeName.toLowerCase() ){
 						case 'b':
 						case 'bold':
 						case 'bolder':
 						case 'strong':
 						command = 'bold';
 						break;

 						case 'i':
 						case 'em':
 						case 'italic':
 						command = 'italic';
 						break;

 						case 'u':
 						case 'ins':
 						case 'underline':
 						command = 'underline';
 						break;

 						case 'del':
 						case 'strike':
 						case 'strikethrough':
 						command = 'strikeThrough';
 						break;

 						case 'a':
 						case 'link':
 						command = 'link';
 						break;

 						default:
 						return;
 					}

 					for( b = 0; b < buttons.length; b++ ){

 						if( !( ( _button = node( buttons[b] ) ).isNode() ) || !isCommand( buttons[b], command ) ){
 							continue;

 						}
 						_button.addClass( __core.classes.active );

 					}
 					parent( comp.parentNode );

 				}
 				node( buttons ).removeClass( __core.classes.active );
 				parent( ev.target );

 			},

 			change: function( ev, ui ){
 				const sanitized_content = utils.encode_chars( utils.stripTags( ui.innerHTML, __core.get.tags( false ) ) );
 				const data = {};
 				var textarea;

 				data[meta_element.slug] = sanitized_content;
 				__data().set( meta_element.id, 'elements', data );

 				if( !( textarea = __core.get.textarea() ) ){
 					return;

 				}
 				textarea.value = sanitized_content;

 			}

 		}

 	};

 	var editor, meta_element;

 	options = utils.isObject( options ) ? options : {};
 	meta_element = __core.element;
 	meta_element.build_meta();

 	if( !node( source ).isNode() || source.parentNode === null || !meta_element.id || !meta_element.slug || !meta_element.data ){
 		return false;

 	}
 	editor = __core.editor.create();
 	source.parentNode.replaceChild( editor, source );

 }