import { escUrl, encodeChars, decodeChars, jsonEncode } from '../../utils/fill.js';
import { isString, isObject, isNode } from '../../utils/is.js';
import { ClassName } from '../../utils/className.js';
import { __class, __elt } from './classes.js';
import Node from '../../dom/element.js';
import Ajax from '../../utils/ajax.js';

const DOCUMENT = document;

var saving = false;

export default class Settings {

	constructor( response ){

		this.response = response;
		this.fragment = null;
		this.settings = {};

	}

	render(){
		this.fragment = DOCUMENT.createDocumentFragment();

		if( isObject( this.response.settings ) ){
			this.controls( this.response.settings );
			this.save();

		}
		return this.fragment;

	}

	controls ( data ){
		var ui, key, inner;

		for( key in data ){

			if( !isObject( data[key].settings ) ){
				continue;

			}
			ui = DOCUMENT.createElement( 'div' );

			this.fragment.appendChild( ui );

			inner = '<div class="' + __class.meta.wrap + '">';

			if( isString( data[key].label ) ){
				inner += '<h4 class="' + __class.meta.title + '">' + data[key].label + '</h4>';

			}

			if( isString( data[key].desc ) ){
				inner += '<p class="' + __class.meta.desc + '">' + data[key].desc + '</p>';

			}
			inner += '</div>';
			inner += '<div class="' + __class.controls + '"></div>';

			ui.innerHTML = inner;
			ui.className = __class.section;

			this.fields( ui.lastChild, data[key].settings );


		}

	}

	fields ( ui, data ){
		var id;

		for( id in data ){

			this.settings[id] = data[id];

			ui.appendChild( this.field( id ) );

		}

	}

	field ( id ){
		const C = ClassName( __class.control.wrap );
		const ui = DOCUMENT.createElement( 'div' );
		var value = this.getValue( id );
		var inner = '';
		var type = 'text';

		switch ( ( type = this.settings[id].type ) ){

			case 'checkbox':
				inner += '<input type="checkbox" name="' + id + '" class="' + __class.control.field + '" value="1"' + ( value === '1' ? ' checked="checked"' : '' ) + ' />';
				break;

			default:
				type = 'text';
				inner += '<input type="text" name="' + id + '" class="' + __class.control.field + '" value="' + value + '" />';
				break;

		}

		if( isString( this.settings[id].label ) ){
			inner += '<label class="' + __class.control.label + '">' + this.settings[id].label + '</label>';

		}
		ui.className = C.combineWith( [ C.modifier( type ) ] );
		ui.innerHTML = inner;

		this.settings[id].ui = ui.firstChild;

		return ui;

	}

	update ( ev, ui, self ){
		const data = {};
		var id;

		ev.preventDefault();

		if( saving ){
			return;

		}
		saving = true;
		ui.innerHTML = '<span class="cico cico-update comet-spinner"></span>';

		for( id in self.settings ){

			if( !isNode( self.settings[id].ui ) ){
				continue;

			}

			if( self.settings[id].type === 'checkbox' ){

				if( self.settings[id].ui.checked ){
					data[id] = '1';

				}
				continue;

			}
			data[id] = encodeChars( self.settings[id].ui.value );

		}

		Ajax({
			do: 'settings',
			data: jsonEncode( data )

		}).done( function( response ){
			saving = false;
			ui.innerHTML = self.response.save;

		});

	}

	getValue( id ){

		if( !isObject( this.response.options ) || !( id in this.response.options ) ){
			return 'std' in this.settings[id] ? this.settings[id].std : '';

		}
		return this.response.options[id];


	}

	save (){
		const UI = DOCUMENT.createElement( 'button' );

		this.fragment.appendChild( UI );

		UI.type = 'submit';
		UI.className = ClassName( __class.submit ).combineWith( [ 'comet-button', 'comet-button--primary', 'comet-button--rounded' ] );
		UI.innerHTML = this.response.save;

		Node( UI ).on( 'click', this.update, this );


	}

}