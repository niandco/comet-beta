import { isObject, isString, isEmpty, isNode } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import { frameset as getFrameset } from '../stored.js';
import { encodeChars } from '../../../utils/fill.js';
import Global from '../../../utils/global.js';
import nodes from '../../../dom/elements.js';
import node from '../../../dom/element.js';

const DOCUMENT = document;

const SLUG = 'generalSettings';

const BASE = 'comet-general-settings';

const GS_CLASSNAME = ClassName( BASE );

const CORE = {

	classes: {
		form: GS_CLASSNAME.element( 'form' ),
		close: GS_CLASSNAME.element( 'close' ),
		open: GS_CLASSNAME.modifier( 'open' )

	}

};

export default function(){

	const GLOBAL = Global();

	const FRAMESET = getFrameset();

	const DATA = {

		target: null,

		form: null,

		open: false,

		toggle: function( ev ){

			var n_target;

			if( isObject( ev ) ){
				ev.preventDefault();

			}

			if( DATA.target === null || !isNode( DATA.target ) ){
				return;

			}
			n_target = node( DATA.target );

			if( n_target.hasClass( CORE.classes.open ) && DATA.open ){
				n_target.removeClass( CORE.classes.open );
				DATA.open = false;
				return;

			}
			n_target.addClass( CORE.classes.open );
			DATA.open = true;

		},

		destroy: function(){

			if( DATA.target === null || DATA.target.parentNode === null ){
				return false;

			}
			DATA.target.parentNode.removeChild( DATA.target );
			GLOBAL.unset( SLUG );

		},

		getFormData: function(){
			const n_names = [ 'input', 'select', 'textarea' ];
			const i_types = [ 'text', 'number', 'range', 'hidden', 'date', 'color', 'checkbox', 'radio', 'email', 'image', 'file', 'month', 'password', 'search', 'tel', 'time', 'url', 'week' ];
			const f_data = {};
			var fields, field, a, index;

			if( DATA.form === null || ( fields = DATA.form.elements ).length < 1 ){
				return f_data;

			}

			for( a = 0; a < fields.length; a++ ){

				if( !isNode( field = fields[a] ) || ( index = n_names.indexOf( field.nodeName.toLowerCase() ) ) < 0 ){
					continue;

				}

				if( !isString( field.name ) || isEmpty( field.name ) ){
					continue;

				}

				if( index === 0 && i_types.indexOf( field.type.toLowerCase() ) < 0 ){
					continue;

				}
				f_data[field.name] = encodeChars( field.value );

			}
			return f_data;

		}

	};

	var target, form, xTarget;

	if( !FRAMESET || ( target = FRAMESET.target.getElementsByClassName( BASE ) ).length < 1 ){
		return;

	}
	target = target[0];
	DATA.target = target;

	if( ( form = target.getElementsByClassName( CORE.classes.form ) ).length < 1 ){
		return;

	}
	form = form[0];
	DATA.form = form;
	xTarget = nodes( target.getElementsByClassName( CORE.classes.close ) );

	if( xTarget ){
		xTarget.on( 'click', DATA.toggle );

	}
	GLOBAL.set( SLUG, DATA, true );

	return DATA;
	
}