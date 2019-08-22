import utils from '../utils.js';
import node from '../node.js';

export default function( options ){
	var target, t, tmp;

	if( typeof options !== 'object' || !( 'target' in options ) ){
		return;

	}

	if( typeof options.classes !== 'object' ){
		options.classes = {};

	}
	options.active = 'active' in options && typeof ( tmp = parseInt( options.active ) ) === 'number' && !isNaN( tmp ) && tmp > 0 ? tmp : 0;
	options.collapsible = 'collapsible' in options && options.collapsible === false ? false : true;

	options.classes.item = 'item' in options.classes ? utils.toClass( options.classes.item ) : 'item';
	options.classes.header = 'header' in options.classes ? utils.toClass( options.classes.header ) : 'header';
	options.classes.body = 'body' in options.classes ? utils.toClass( options.classes.body ) : 'body';
	options.classes.active = 'active' in options.classes ? utils.toClass( options.classes.active ) : 'active';

	function hide( item ){
		const _item = node( item );
		var dren, ch;

		if( !_item.isNode() || ( dren = _item.children( options.classes.body ) ).length < 1 ){
			return;

		}

		for( ch in dren ){

			if( !node( dren[ch] ).isNode() ){
				continue;

			}
			node( dren[ch] ).slideUp( 50 );

		}
		_item.removeClass( options.classes.active );

	}

	function show( item ){
		const _item = node( item );
		var dren, ch;

		if( !_item.isNode() || ( dren = _item.children( options.classes.body ) ).length < 1 ){
			return;

		}

		for( ch in dren ){

			if( !node( dren[ch] ).isNode() ){
				continue;

			}
			node( dren[ch] ).slideDown( 50 );

		}
		_item.addClass( options.classes.active );

	}

	function init( wrap ){
		const children = wrap.children;
		var i = 1;
		var c, _child;

		for( c in children ){

			if( !( ( _child = node( children[c] ) ).isNode() ) || !_child.hasClass( options.classes.item ) ){
				continue;

			}

			if( i === options.active && !_child.hasClass( options.classes.active ) ){
				show( _child.prop() );

			}else{
				hide( _child.prop() );

			}
			i++;

		}

	}
	target = node( options.target );

	if( target.isNode() ){
		init( target.prop() );

	}else if( ( utils.isObject( tmp = target.get() ) || utils.isArray( tmp, 1 ) ) && !target.isView() ){

		for( t in tmp ){

			if( !node( tmp[t] ).isNode() ){
				continue;

			}
			init( tmp[t] );

		}

	}else{
		return;

	}

	node( '.' + options.classes.header ).on( 'click', function( ev, ui  ){
		var _wrapper, _main, dren, c;
		
		ev.preventDefault();

		if( !( ( _wrapper = node( ui.parentNode ) ).isNode() ) ){
			return;

		}

		if( options.collapsible && ( ( _main = node( _wrapper.prop().parentNode ) ).isNode() ) && ( dren = _main.prop().children ).length > 0 ){

			for( c in dren ){
				hide( dren[c] );

			}

		}

		if( _wrapper.hasClass( options.classes.active ) ){
			hide( _wrapper.prop() );

		}else{
			show( _wrapper.prop() );

		}

	});
	
}