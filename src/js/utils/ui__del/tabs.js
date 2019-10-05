import utils from '../utils.js';
import node from '../node.js';

export default function( options ){
	var target, t, tmp;

	if( !utils.isObject( options ) || !( 'target' in options ) ){
		return;

	}

	if( !utils.isObject( options.classes ) ){
		options.classes = {};

	}
	options.classes.active = 'active' in options.classes ? utils.toClass( options.classes.active ) : 'active';
	options.classes.ref = 'ref' in options.classes ? utils.toClass( options.classes.ref ) : 'ref';
	options.classes.tabs = 'tabs' in options.classes ? utils.toClass( options.classes.tabs ) : 'tabs';
	options.classes.tab = 'tab' in options.classes ? utils.toClass( options.classes.tab ) : 'tab';
	options.classes.body = 'body' in options.classes ? utils.toClass( options.classes.body ) : 'body';

	function init( wrap ){
		const body = wrap.getElementsByClassName( options.classes.body );
		const tabs = wrap.getElementsByClassName( options.classes.tabs );
		var current = false;
		var b, c, dren, i, ref, _child, _pchild;

		if( body.length < 1 || tabs.length < 1 ){
			return;

		}
		i = 0;

		for( b in body ){

			if( !node( body[b] ).isNode() || ( dren = body[b].getElementsByClassName( options.classes.tab ) ).length < 2 ){
				continue;

			}

			for( c in dren ){

				if( !( ( _child = node( dren[c] ) ).isNode() ) || typeof ( ref = _child.prop().id ) !== 'string' ){
					continue;

				}

				if( i === 0 ){

					if( !_child.hasClass( options.classes.active ) ){
						_child.addClass( options.classes.active );

					}
					current = ref;
					dren[c].style.display = 'block';
					i++;
					continue;


				}
				_child.removeClass( options.classes.active );
				dren[c].style.display = 'none';
				i++;

			}

		}

		if( !current ){
			return;

		}

		for( t in tabs ){

			if( !node( tabs[t] ).isNode() || ( dren = tabs[t].getElementsByClassName( options.classes.ref ) ).length < 1 ){
				continue;

			}

			for( c in dren ){

				if( !( ( _child = node( dren[c] ) ).isNode() ) || !( ( _pchild = node( _child.prop().parentNode ) ).isNode() ) || typeof ( ref = _child.prop().hash ) !== 'string' ){
					continue;

				}
				ref = ref.charAt(0) === '#' ? ref.substring(1) : ref;

				if( ref === current ){

					if( !_pchild.hasClass( options.classes.active ) ){
						_pchild.addClass( options.classes.active );

					}
					continue;

				}
				_pchild.removeClass( options.classes.active );

			}


		}

	}

	target = node( options.target );

	if( target.isNode() ){
		init( target.prop() );

	}else if( ( utils.isObject( tmp = target.get() ) || utils.isArray( tmp, 1 ) ) && !target.isView() ){

		for( t in tmp ){

			if( node( tmp[t] ).isNode() ){
				init( tmp[t] );

			}

		}

	}else{
		return;

	}

	node( '.' + options.classes.ref ).on( 'click', function( ev, ui ){
		var current = false;
		var ref, _pt, _tmp, _tabs, tabs, _wrap, body, t_, b, c, dren, _child;
		
		ev.preventDefault();

		if( typeof ui.hash !== 'string' || !( ( _pt = node( ui.parentNode ) ).isNode() ) || _pt.hasClass( options.classes.active ) ){
			return;

		}
		if( !( ( _tabs = node( _pt.prop().parentNode ) ).isNode() ) || !( ( _tmp = node( _tabs.prop().parentNode ) ).isNode() ) || !( ( _wrap = node( _tmp.prop().parentNode ) ).isNode() ) ){
			return;

		}

		if( ( body = _wrap.prop().getElementsByClassName( options.classes.body ) ).length < 1 || ( tabs = _tabs.prop().children ).length < 1 ){
			return;

		}
		ref = ( ref = utils.trim( ui.hash ) ).charAt(0) === '#' ? ref.substring( 1 ) : ref;

		for( b in body ){

			if( !node( body[b] ).isNode() || ( dren = body[b].getElementsByClassName( options.classes.tab ) ).length < 2 ){
				continue;

			}

			for( c in dren ){

				if( !( ( _child = node( dren[c] ) ).isNode() ) || typeof dren[c].id !== 'string' ){
					continue;

				}

				if( utils.trim( dren[c].id ) === ref  ){

					if( !_child.hasClass( options.classes.active ) ){
						_child.addClass( options.classes.active );

					}
					dren[c].style.display = 'block';
					current = true;
					continue;

				}
				_child.removeClass( options.classes.active );
				dren[c].style.display = 'none';

			}


		}

		if( !current ){
			return;

		}

		for( t_ in tabs ){

			if( !node( tabs[t_] ).isNode() ){
				continue;

			}
			node( tabs[t_] ).removeClass( options.classes.active );

		}
		_pt.addClass( options.classes.active );

	});
	
}