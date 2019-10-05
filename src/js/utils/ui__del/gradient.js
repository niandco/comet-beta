import sanitize from '../sanitize.js';
import gradient from '../gradient.js';
import cp from './color-picker.js';
import utils from '../utils.js';
import node from '../node.js';

/* global document */

export default function( source, options ){
	const _d = document;
	var dragging = false;
	var handler = false;
	var currentSource = false;
	var tmp;

	if( !source ){
		return;

	}

	if( !utils.isObject( options ) ){
		options = {};

	}
	options.size = utils.isNumber( tmp = parseInt( options.size ) ) && !isNaN( tmp ) ? tmp : 10;

	function toggleDelete( data ){
		var ds, d;

		if( !dragging || !handler || !utils.isObject( data ) || !( 'range' in data ) || !( 'manager' in data ) ){
			ds = _d.getElementsByClassName( 'comet-eGDelete' );

			for( d = 0; d < ds.length; d++ ){

				if( !node( ds[d] ).isNode() || ds[d].nodeName.toLowerCase() !== 'button' ){
					continue;

				}
				ds[d].name = 'add';
				ds[d].innerHTML = '<span class="cico cico-plus"></span>';
				ds[d].className = 'comet-eGManager comet-eGAdd';

			}
			return;

		}
		data.manager.name = 'delete';
		data.manager.innerHTML = '<span class="cico cico-trash"></span>';
		data.manager.className = 'comet-eGManager comet-eGDelete';

	}

	function setPosition( ui, position ){
		var tooltip = ui.getElementsByClassName( 'comet-ui-position' );
		position = parseInt( position );

		ui.style.left = 'calc( ' + position + '% - ' + ( options.size / 2 ) + 'px )';
		ui.setAttribute( 'aria-label', position + '%' );

		if( tooltip.length < 1 ){
			tooltip = _d.createElement( 'span' );
			tooltip.className = 'comet-ui-position';
			tooltip.innerHTML = position + '%';
			ui.appendChild( tooltip );
			return;

		}
		tooltip[0].innerHTML = position + '%';

	}

	function onrange( ev, ui, data ){
		var x, width, delta;

		ev.preventDefault();
		ev.stopPropagation();

		if( ev.type !== 'mousemove' || !dragging || !handler ){
			dragging = false;
			handler = false;
			currentSource = false;
			return;

		}

		if( !( width = node( data.range ).width() ) || !( x = data.range.getBoundingClientRect().left ) ){
			dragging = false;
			handler = false;
			currentSource = false;
			return;

		}
		//width = width - options.size;
		//delta = sanitize.number( { value: ( ( ev.pageX - x ) - ( options.size / 2 ) ), min: 0, max: width, default: 0 } );
		//handler.style.left = parseInt( ( ( parseFloat( ( delta / width ) * 100 ).toFixed( 2 ) ) * width ) / 100 ) + 'px';


		delta = sanitize.number( { value: ( ev.pageX - x ), min: 0, max: width, default: 0 } );
		setPosition( handler, ( ( delta / width ) * 100 ) );

		if( typeof options.change === 'function' ){
			options.change( ev, ui, data );

		}

	}

	function onmanager( ev, ui, data ){
		var dgs, width, nb, offset, count, dragger, input, d;

		ev.preventDefault();

		if( ev.type === 'mouseup' ){

			if( ui.name === 'delete' ){

				if( dragging && handler && handler.parentNode.getElementsByClassName( 'comet-eGDragger' ).length > 2 ){
					handler.parentNode.removeChild( handler );

				}
				ui.name = 'add';
				ui.innerHTML = '<span class="cico cico-plus"></span>';
				ui.className = 'comet-eGManager comet-eGAdd';
			}
			return;

		}
		dgs = data.range.getElementsByClassName( 'comet-eGDragger' );
		width = node( data.range ).width() - options.size;
		nb = dgs.length;
		offset = parseInt( width / nb );
		count = 0;

		if( nb > 5 ){
			return;

		}
		dragger = _d.createElement( 'button' );
		dragger.className = 'comet-eGDragger';
		data.range.appendChild( dragger );
		dragger.style.left =  width + 'px';
		handler = false;
		dragging = false;
		input = _d.createElement( 'input' );
		input.type = 'hidden';
		input.value = '#000000';
		dragger.appendChild( input );
		node( dragger ).on( 'mousedown', onstart, data );
		initCP( input, data );

		if( typeof options.add === 'function' ){
			options.add( dragger, data );

		}

		for( d = 0; d < nb; d++ ){

			if( !node( dgs[d] ).isNode() ){
				continue;

			}
			if( count === 0 ){
				dgs[d].style.left = '0';

			}else{
				dgs[d].style.left = ( count * offset ) + 'px';
			}
			count++;

		}

	}

	function onstart( ev, ui, data ){
		ev.preventDefault();
		ev.stopPropagation();

		if( !utils.isObject( data ) || !node( data.source ).isNode() || !node( data.range ).isNode() ){
			return;

		}
		data.value = data.source.value;
		dragging = true;
		handler = ui;
		currentSource = data.source;
		toggleDelete( data );

		if( utils.isFunction( options.start ) ){
			options.start( ev, ui, data );

		}
		
	}

	function onstop( ev ){
		const colors = [];
		//var width, stop;
		var range, draggers, _dragger, x;

		ev.preventDefault();

		if( !dragging ){
			return;

		}

		if( handler && currentSource && handler.parentNode !== null ){
			range = handler.parentNode;
			//width = node( range ).width() - options.size;
			draggers = range.children;

			for( x in draggers ){

				if( !( ( _dragger = node( draggers[x] ) ).isNode() ) || !_dragger.hasClass( 'comet-eGDragger' ) ){
					continue;

				}
				//stop = sanitize.number( { value: draggers[x].style.left, min: 0, max: width, default: 0 } );
				colors[colors.length] = {
					stop: parseInt( draggers[x].getAttribute( 'aria-label' )/*( stop / width ) * 100*/ ),
					color: ( 0 in ( tmp = draggers[x].getElementsByTagName( 'input' ) ) ? sanitize.color( tmp[0].value ) : '' )
				};

			}
			currentSource.value = gradient.encode( colors );

		}

		if( utils.isFunction( options.onchange ) ){
			options.onchange( currentSource, currentSource.value );

		}

		toggleDelete();
		dragging = false;
		handler = false;
		currentSource = false;
		
	}

	function initCP( ui, data ){

		cp( ui, {
			opacity: true,
			input: true,
			clear: false,
			onchange: function(){
				const range = data.range;
				//const width = node( range ).width() - options.size;
				const draggers = range.children;
				const colors = [];
				var x, _dragger;
				//var stop;

				for( x in draggers ){

					if( !( ( _dragger = node( draggers[x] ) ).isNode() ) || !_dragger.hasClass( 'comet-eGDragger' ) ){
						continue;

					}
					//stop = sanitize.number( { value: draggers[x].style.left, min: 0, max: width, default: 0 } );
					colors[colors.length] = {
						stop: parseInt( draggers[x].getAttribute( 'aria-label' ) ),//parseInt( ( stop / width ) * 100 ),
						color: ( 0 in ( tmp = draggers[x].getElementsByTagName( 'input' ) ) ? sanitize.color( tmp[0].value ) : '' )
					};

				}
				data.source.value = gradient.encode( colors );

				if( utils.isFunction( options.onchange ) ){
					options.onchange( data.source, data.source.value );

				}
			}
		});

	}

	function create( ui ){
		const wrap = ui.parentNode;
		const data = {};
		var colors = gradient.decode( ui.value );
		var range, dragger, input, manager, c, item;
		//var width, color, size;

		if( wrap === null ){
			return;

		}
		range = _d.createElement( 'div' );
		range.className = 'comet-eGRange';

		manager = _d.createElement( 'button' );
		manager.className = 'comet-eGManager comet-eGAdd';
		manager.name = 'add';
		manager.innerHTML = '<span class="cico cico-plus"></span>';

		wrap.appendChild( range );
		wrap.appendChild( manager );

		//width = node( range ).width() - options.size;

		data.source = ui;
		data.range = range;
		data.value = ui.value;
		data.manager = manager;

		if( !utils.isArray( colors, 2 ) ){
			colors = [];

		}

		if( !( 1 in colors ) ){
			colors[1] = {
				stop: 100,
				color: '#FFF'

			};

		}

		if( !( 0 in colors ) ){
			colors[0] = {
				stop: 0,
				color: '#000'

			};

		}

		for( c = 0; c < colors.length; c++ ){

			if( !utils.isObject( item = colors[c] ) || sanitize.color( item.color ) === '' ){
				continue;

			}
			dragger = _d.createElement( 'button' );
			dragger.className = 'comet-eGDragger';
			/*size = sanitize.number( { value: item.stop ( ( item.stop * width ) / 100 ), min: 0, default: 0 } );*/
			//dragger.style.left =  'calc(' + item.stop + '% - ' + ( options.size / 2 ) + 'px )'/*size + 'px'*/;
			setPosition( dragger, item.stop );
			range.appendChild( dragger );
			input = _d.createElement( 'input' );
			input.type = 'hidden';
			input.value = colors[c].color;
			dragger.appendChild( input );
			node( dragger ).on( 'mousedown', onstart, data );
			initCP( input, data );

		}
		node( range ).on( 'mousemove', onrange, data );
		node( manager ).on( 'click mouseup', onmanager, data );

	}

	(function(){
		var x, _source;

		if( ( ( _source = node( source ) ).isNode() ) ){

			create( source );

		}else if( ( utils.isObject( tmp = _source.get() ) || utils.isArray( tmp, 1 ) ) && !_source.isView() ){

			for( x in source ){

				if( !node( source[x] ).isNode() ){
					continue;

				}
				create( source[x] );
			}

		}else{
			return;

		}
		node( _d.documentElement ).on( 'mouseup', onstop );

	})();

}