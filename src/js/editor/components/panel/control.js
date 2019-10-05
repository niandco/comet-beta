import { isNode, isString, isObject, isFunction, isArray, isBool, isNumber } from '../../../utils/is.js';
import { __numbers, __range, __gradient, __colorPicker, __icon, __image } from '../../../ui/index.js';
import { sanitizeNumber } from '../../../utils/sanitize.js';
import { ClassName } from '../../../utils/className.js';
import { stripTags } from '../../../utils/fill.js';
import update from '../../control/update.js';
import nodes from '../../../dom/elements.js';
import node from '../../../dom/element.js';

const DOCUMENT = document;

const FRAGMENT = DOCUMENT.createDocumentFragment();

const E_CLASSNAME = ClassName( 'comet-panel' ).element( 'field' );

const BClassName = ClassName( E_CLASSNAME );

const CORE = {

	classes: {
		default: E_CLASSNAME,
		unit: ClassName( 'comet-panel__control' ).element( 'unit' ),
		variants: {
			active: BClassName.modifier( 'active' ),
			radio: BClassName.modifier( 'radio' ),
			text: BClassName.modifier( 'text' ),
			textarea: BClassName.modifier( 'textarea' ),
			select: BClassName.modifier( 'select' ),
			checkbox: BClassName.modifier( 'checkbox' ),
			color: BClassName.modifier( 'color' ),
			gradient: BClassName.modifier( 'gradient' ),
			range: BClassName.modifier( 'range' ),
			icon: BClassName.modifier( 'icon' ),
			image: BClassName.modifier( 'image' ),
			number: BClassName.modifier( 'number' ),
			numbers: BClassName.modifier( 'numbers' ),
			editor: BClassName.modifier( 'editor' ),
		},



	},

	utils: {

		onradio: function( ev, ui ){
			const parentNode = ui.parentNode;
			var dren;

			if( parentNode === null || ( dren = parentNode.children ).length < 1 ){
				return;

			}
			nodes( dren ).removeClass( CORE.classes.variants.active );
			node( ui ).addClass( CORE.classes.variants.active );
			update( ui.firstElementChild );

			/*if( isSwitch ){ __core.actions.switch( ui.firstElementChild, field ); }*/

		},

		joinAttributes: function( object ){
			var str = '';
			var a, b;

			if( !isObject( object ) ){
				return str;

			}

			for( a in object ){

				if( a === 'dataset' && isObject( object[a] ) ){

					for( b in object[a] ){
						str += 'data-' + b + '="' + object[a][b] + '" ';

					}
					continue;

				}
				str += a + '="' + object[a] + '" ';

			}
			return str.trim();

		},

	},

	create: {

		input: function( type, name, value, classes, extra ){

			const attr = {
				type,
				class: classes,
				name,
				value
			};
			var a;

			if( isObject( extra ) ){

				for( a in extra ){

					if( a in attr ){
						continue;

					}
					attr[a] = extra[a];

				}

			}
			return '<input ' + CORE.utils.joinAttributes( attr ) + ' />';

		},

		textarea: function( name, value, classes ){
			const attr = {
				name,
				class: classes

			};

			return '<textarea ' + CORE.utils.joinAttributes( attr ) + '>' + value + '</textarea>';

		},
	},

	fields: {

		text: function( data ){

			data.control.innerHTML = CORE.create.input(
				'text',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.text ] )
				);

			CORE.update( data.control.firstChild );

			return data.control.firstChild;


		},

		textarea: function( data ){

			data.control.innerHTML = CORE.create.textarea(
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.textarea ] )
				);

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		select: function( data ){
			var v, values, select;

			if( !isObject( values = data.data.values ) ){
				return null;

			}
			select = '<select name="' + data.id + '" class="' + BClassName.combineWith( [ CORE.classes.variants.select ] ) + '">';

			for( v in values ){

				if( !isString( values[v] ) && !isNumber( values[v] ) ){
					continue;

				}
				select += '<option value="' + v + '"' + ( v === data.value ? ' selected' : '' ) + '>';
				select += stripTags( values[v].toString() );
				select += '</option>';

			}
			select += '</select>';

			data.control.innerHTML = select;

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		checkbox: function( data ){
			const extra = data.value === 'true' ? { checked: true } : null;

			data.control.innerHTML = CORE.create.input(
				'checkbox',
				data.id,
				'true',
				BClassName.combineWith( [ CORE.classes.variants.checkbox ] ),
				extra
				);

			CORE.update( data.control.firstChild );
			
			return data.control.firstChild;

		},

		radio: function( data ){
			var radio, values, v, inner, extra, checked;

			if( !isObject( values = data.data.values ) ){
				return false;

			}

			for( v in values ){

				if( !isObject( values[v] ) || !isString( values[v].title ) || !isString( values[v].icon ) ){
					continue;

				}
				checked = v === data.value;
				extra = checked ? { checked: true } : null;
				radio = DOCUMENT.createElement( 'label' );
				radio.className = 'comet-label comet-ui' + ( v === data.value ? ' ' + CORE.classes.variants.active : '' );
				inner = CORE.create.input(
					'radio',
					data.id,
					v,
					BClassName.combineWith( [ CORE.classes.variants.radio ] ),
					extra
					);

				inner += '<span class="comet-icon ' + ( stripTags( values[v].icon ) ).trim() + '"></span>';
				inner += '<span class="comet-title">' + ( stripTags( values[v].title, '<b><strong><i><span><u><ins>' ) ).trim() + '</span>';
				radio.innerHTML = inner;

				FRAGMENT.appendChild( radio );
				node( radio ).on( 'click', CORE.utils.onradio );

			}

			data.control.appendChild( FRAGMENT );

			return true;

		},

		range: function( data ){

			data.control.innerHTML = CORE.create.input(
				'hidden',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.range ] ),
				{
					min: sanitizeNumber({ value: data.data.min, min: 0 }),
					max: sanitizeNumber({ value: data.data.max, min: data.data.min }),
					step: sanitizeNumber({ value: data.data.step, min: 0.01 }),
					dataset: {
						unit: isString( data.data.unit ) ? stripTags( data.data.unit ) : '',
					}
				}
				);

			__range(
				data.control.firstChild,
				{
					buttons: true,
					change: function(){
						update( data.control.firstChild );

					}
				}
				);

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		number: function( data ){

			var inner = CORE.create.input(
				'number',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.number ] )
				);

			if( isString( data.data.unit ) ){
				inner += '<span class="' + CORE.classes.unit + '">' + stripTags( data.data.unit ) + '</span>';

			}
			data.control.innerHTML = inner;

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		numbers: __numbers,

		color: function( data ){

			data.control.innerHTML = CORE.create.input(
				'text',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.color ] )
				);

			__colorPicker( data.control.firstChild, {
				onchange: update,
				clear: true

			});

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		editor: function( data ){

			data.control.innerHTML = CORE.create.textarea(
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.editor ] )
				);

			CORE.update( data.control.firstChild );

			return data.control.firstChild;

		},

		gradient: function( data ){

			data.control.innerHTML = CORE.create.input(
				'hidden',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.gradient ] )
				);

			CORE.update( data.control.firstChild );

			__gradient( data.control.firstChild, {
				size: 20,
				onchange: function( ui ){
					update( ui );

				}

			} );

			return data.control.firstChild;

		},

		icon: function( data ){

			data.control.innerHTML = CORE.create.input(
				'hidden',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.icon ] ),
				);

			__icon( data.control.firstChild, data );

			return data.control.firstChild;

		},

		image: function( data ){

			data.control.innerHTML = CORE.create.input(
				'hidden',
				data.id,
				data.value,
				BClassName.combineWith( [ CORE.classes.variants.image ] ),
				);

			__image( data.control.firstChild, data );

			return data.control.firstChild;

		}


	},

	switch: function(){

	},

	update: function( source ){

		node( source ).on( 'input', function( ev, ui ){
			update( ui );

		});

	}

};

export function createInputField( type, name, value, classes, extra ){

	return CORE.create.input( type, name, value, classes, extra );

}

export function createTextareaField( type, name, value, classes, extra ){

	return CORE.create.textarea( name, value, classes );
	
}

export function createControl( controlData ){
	var field = null;
	var value;

	if( !isObject( controlData.data ) ){
		controlData.control.parentNode.parentNode.removeChild( controlData.control.parentNode );
		return;

	}

	if( !isObject( controlData.current ) ){
		controlData.current = {};

	}
	value = 'std' in controlData.data ? controlData.data.std : '';
	value = controlData.id in controlData.current ? controlData.current[controlData.id] : value;
	controlData.value = value;

	if( isFunction( CORE.fields[controlData.data.type] ) ){
		field = CORE.fields[controlData.data.type]( controlData );

	}
	return field;

}