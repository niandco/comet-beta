import utils from '../utils.js';
import node from '../node.js';

export default function( viewport, target, view ){

	var width, height;

	const _viewport = node( viewport );

	const _target = node( target );

	const triggers = [ 'scroll', 'load' ];

	const __ = {

		check: function( element ){
			const x = element.getBoundingClientRect();

			return ( x.top >= 0 && x.left >= 0 && x.right <= width && x.bottom <= height );

		},

		view: function(){
			var ctr, a;

			if( _target.isView() ){
				return;

			}

			if( _target.isNode() ){
				view( __.check( _target.prop() ), _target.prop() );
				return;

			}

			if( ( ctr = _target.get() ).length < 1 ){
				return;

			}

			for( a = 0; a < ctr.length; a++ ){

				if( node( ctr[a] ).isNode() ){
					view( __.check( ctr[a] ), ctr[a] );

				}

			}


		}

	};

	if( ( !_viewport.isNode() && !_viewport.isView() ) || !utils.isFunction( view ) ){
		return false;

	}
	width = _viewport.width();
	height = _viewport.height();

	triggers.forEach(function( trigger ){

		_viewport.on( trigger, __.view );

	});

	node( window ).on( 'resize', __.view );
	
}