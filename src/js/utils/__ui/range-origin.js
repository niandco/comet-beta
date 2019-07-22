import node from '../node.js';

/* global document, window */

export default function( source, options ){
	const _d = document;
	var dragging = false;
	var x;

	if( !source ){
		return;

	}

	if( typeof options !== 'object' ){
		options = {};

	}

	function getValues( from ){
		var tmp, min, max;

		if( !node( from ).isNode() ){
			return {
				min: 0,
				max: 360,
				step: 1,
				value: 0
			};

		}

		return {
			min: ( min = sanitizeValue( from.getAttribute( 'min' ) ) ),
			max: ( max = ( tmp = sanitizeValue( from.getAttribute( 'max' ) ) ) <= min ? min + 10 : tmp ),
			step: ( tmp = sanitizeValue( from.getAttribute( 'step' ) ) ) <= 0 ? 0.1 : tmp,
			value: ( tmp = sanitizeValue( from.value ) ) >= min && tmp <= max ? tmp : min

		};

	}

	function sanitizeValue( value ){

		if( typeof value !== 'number' && typeof value !== 'string' ){
			return 0;

		}

		if( typeof ( value = parseFloat( value ) ) !== 'number' || isNaN( value ) ){
			return 0;

		}
		return value;

	}

	function initDragger( dragger, value, min, max, step ){
		var width, dwidth, r;

		if( !node( dragger ).isNode() || !( width = node( dragger.parentNode ).width() ) ){
			return false;

		}
		width = dragger.parentNode.scrollWidth;
		dwidth = ( dwidth = sanitizeValue( node( dragger ).width() ) ) > 0 ? dwidth : 0;
		width = width - dwidth;
		r = parseInt( ( value / ( step * ( ( max - min ) / step ) + min ) ) * width );
		dragger.style.left = r + 'px';
		return r;

	}

	function onDecInc( ev, ui, data, increase ){
		var v, val;

		ev.preventDefault();

		if( typeof data !== 'object' || !node( data.source ).isNode() || !node( data.dragger ).isNode() ){
			return false;

		}
		v = getValues( data.source );
		val = Number( ( increase ? v.value + v.step : v.value - v.step ).toFixed( 2 ) );
		val = val < v.min ? v.min : ( val > v.max ? v.max : val );
		data.source.value = val;
		data.value = val;

		initDragger( data.dragger, val, v.min, v.max, v.step );

		if( typeof options.change === 'function' ){
			options.change( ev, ui, data );

		}
		return true;

	}

	function onrange( ev, ui, data ){
		var _x, width, dwidth, val, delta, per, v;
		
		ev.preventDefault();
		ev.stopPropagation();

		if( ( ev.type !== 'mousemove' || !dragging ) && ev.type !== 'click' ){
			return;

		}

		if( !( width = node( data.range ).width() ) || !( _x = data.range.getBoundingClientRect().left ) ){
			return;

		}
		v = getValues( data.source );
		dwidth = ( dwidth = sanitizeValue( node( data.dragger ).width() ) ) > 0 ? dwidth : 0;

		if( typeof ( delta = parseInt( ev.pageX - _x ) ) !== 'number' || isNaN( delta ) ){
			delta = 0;

		}
		delta = delta - ( dwidth / 2 );
		width = width - dwidth;

		if( delta > width ){
			delta = width;

		}

		if( delta < 0 ){
			delta = 0;

		}
		data.dragger.style.left = parseInt( delta ) + 'px';
		per = ( ( delta ) / ( width || 1 ) );
		val = v.step * Math.round( per * ( v.max - v.min ) / v.step ) + v.min;
		val = Number( (val).toFixed(2) );
		data.source.value = val;
		data.value = val;

		if( typeof options.change === 'function' ){
			options.change( ev, ui, data );

		}

	}

	function onstart( ev, ui, data ){
		ev.preventDefault();

		if( typeof data !== 'object' || !node( data.source ).isNode() || !node( data.range ).isNode() ){
			return;

		}

		if( typeof options.start === 'function' ){
			options.start( ev, ui, data );

		}
		data.value = sanitizeValue( data.source.value );
		dragging = true;
		
	}

	function onstop( ev, ui ){
		ev.preventDefault();

		if( typeof options.stop === 'function' ){
			options.stop( ev, ui );

		}
		dragging = false;
		
	}

	function onincrease( ev, ui, data ){
		const _on = onDecInc( ev, ui, data, true );

		if( !_on ){
			return;

		}

		if( typeof options.increase === 'function' ){
			options.increase( ev, ui, data );

		}

	}

	function ondecrease( ev, ui, data ){
		const _on = onDecInc( ev, ui, data, false );

		if( !_on ){
			return;

		}

		if( typeof options.decrease === 'function' ){
			options.decrease( ev, ui, data );

		}

	}

	function create( _ui ){
		const wrap = _ui.parentNode;
		const data = {};
		var range, dragger, dec, inc, v;

		if( !wrap ){
			return;

		}
		range = _d.createElement( 'div' );
		range.className = 'comet-eRange';

		dragger = _d.createElement( 'button' );
		dragger.className = 'comet-eRDragger';
		range.appendChild( dragger );

		data.source = _ui;
		data.range = range;
		data.dragger = dragger;

		if( options.buttons ){
			dec = _d.createElement( 'button' );
			dec.className = 'comet-eRDecrease comet-button';
			dec.innerHTML = '-';

			inc = _d.createElement( 'button' );
			inc.className = 'comet-eRIncrease comet-button';
			inc.innerHTML = '+';

			wrap.appendChild( dec );
			wrap.appendChild( range );
			wrap.appendChild( inc );
			data.decrease = dec;
			data.increase = inc;

			node( dec ).on( 'click', ondecrease, data );
			node( inc ).on( 'click', onincrease, data );

		}else{
			wrap.appendChild( range );

		}
		v = getValues( _ui );
		initDragger( data.dragger, v.value, v.min, v.max, v.step );
		node( dragger ).on( 'mousedown', onstart, data );
		node( range ).on( 'click mousemove', onrange, data );
		node( _ui ).on( 'setValue', function(){
			const gv = getValues( _ui );
			initDragger( data.dragger, gv.value, gv.min, gv.max, gv.step );

		});


	}

	if( node( source ).isNode() ){
		
		create( source );

	}else if( source !== _d && source !== window && typeof source === 'object' && source.length > 0 ){

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

}