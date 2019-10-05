import { isArray, isObject, isString, isBool, isNumber, isEmpty, isTrueValue } from './is.js';
import { sanitizeData, sanitizeColor, sanitizeNumber } from './sanitize.js';
import { stripTags, capitalize, escUrl, inArray } from './fill.js';
import { parseId, parseIds } from './parse.js';
import { TARGET } from '../editor/target.js';
import Element from './element.js';
import style from './style.js';
import {
	ruleset as __Ruleset,
	responsive as __Responsive,
	background as __Background,
	border as __Border,
	borderRadius as __BorderRadius,
	margin as __Margin,
	padding as __Padding,
	property as __Property
} from './css/properties.js';

/* global document */

const DOCUMENT = document;

const CORE = {

	isEntry: function( value ){

		if( isString( value ) || isBool( value ) || isNumber( value ) ){
			value = ( ( value.toString() ).toLowerCase() ).trim();

		}
		return inArray( [ 'true', '1', 'yes', 'y', 't' ], value );

	},

	hasConnection: function( data, connection ){
		return isObject( data ) && isObject( data[connection] );

	},

	css: function( id, type, dt ){
		var o, tmp, classe, br, bo, bg, pad, mar;

		if( !isObject( dt ) ){
			return '';

		}

		classe = '.cpb-';

		switch( type ){
			case 'sections':
			classe += 'section-' + id + '.cpb-section > .cpb-sectionContent';
			break;

			case 'rows':
			classe += 'row-' + id + '.cpb-row';
			break;

			case 'columns':
			classe += 'column-' + id + '.cpb-column';
			break;

			default:
			return '';

		}

		bg = __Background({
			type: dt.bgt,
			gradient: {
				type: dt.bgor,
				gradient: dt.gradient,
				angle: dt.bgor === 'radial' ? dt.shape : dt.angle

			},
			color: dt.bgc,
			url: dt.image,
			position: dt.pos,
			repeat: dt.repeat,
			size: dt.size,
			att: dt.att,

		});

		bo = __Border({
			color: dt.bc,
			style: dt.bs,
			top: dt.bwt,
			right: dt.bwr,
			bottom: dt.bwb,
			left: dt.bwl,
		});

		br = __BorderRadius( dt.bradt, dt.bradr, dt.bradb, dt.bradl );
		pad = __Padding( dt.padt, dt.padr, dt.padb, dt.padl, 'px', 'px' );
		mar = __Margin( dt.mart, dt.marr, dt.marb, dt.marl, 'px', 'px' );

		switch( type ){

			case 'sections':
			o = __Ruleset( classe, ( bg + bo + mar + pad + br ) );
			break;

			case 'rows':
			o = '';

			if( dt.width === 'cust' && ( tmp = sanitizeNumber({ value: dt.wsize, min: 300 }) ) !== null && tmp >= 300 ){
				o += __Ruleset( classe, __Property( 'max-width', ( tmp + 'px' ) ) );

			}
			classe += ' .cpb-rowContent';
			tmp = bg + bo + pad + br + mar;

			switch( dt.alg ){

				case 't':
				tmp += __Property( 'align-items', 'flex-start' );
				break;

				case 'b':
				tmp += __Property( 'align-items', 'flex-end' );
				break;

				case 'c':
				tmp += __Property( 'align-items', 'center' );
				break;
			}
			o += __Ruleset( classe, tmp );
			break;

			case 'columns':
			o = '';

			if( ( tmp = sanitizeNumber({ value: dt.wsize, min: 10, max: 100 }) ) !== null ){
				o += __Ruleset( classe, __Property( 'width', ( tmp + '%' ) ) );

			}
			classe += ' .cpb-columnContent';
			o += __Ruleset( classe, ( bg + bo + pad + br + mar ) );
			break;

			default:
			return '';
		}

		if( 'ov' in dt && 'ovc' in dt ){

			if( CORE.isEntry( dt.ov ) && !isEmpty( tmp = sanitizeColor( dt.ovc ) ) ){

				o += classe + ' > .cpb-backgroundComponents > .cpb-backgroundOverlay{background:' + tmp + ';}';

				if( br !== '' ){
					o += classe + ' > .cpb-backgroundComponents{' + br + '}';
				}
			}
		}
		pad = __Padding( dt.padtt, dt.padrt, dt.padbt, dt.padlt, 'px', 'px' );
		mar = __Margin( dt.martt, dt.marrt, dt.marbt, dt.marlt, 'px', 'px' );

		if( pad !== '' || mar !== '' ){
			o += __Ruleset( classe, ( pad + mar ), 't' );
			o += __Responsive( 't', __Ruleset( classe, ( pad + mar ) ) );


		}
		pad = __Padding( dt.padtm, dt.padrm, dt.padbm, dt.padlm, 'px', 'px' );
		mar = __Margin( dt.martm, dt.marrm, dt.marbm, dt.marlm, 'px', 'px' );

		if( pad !== '' || mar !== '' ){
			o += __Ruleset( classe, ( pad + mar ), 'm' );
			o += __Responsive( 'm', __Ruleset( classe, ( pad + mar ) ) );

		}
		style( id, type ).insert( o );

	},

	backgroundTags: function( dt ){
		const url = isString( dt.vurl ) ? ( stripTags( dt.vurl ) ).trim() : '';
		var o = '<div class="cpb-backgroundComponents">';

		if( isTrueValue( dt.vid ) && !isEmpty( url ) ){
			o += '<video class="cpb-backgroundVideo" src="' + escUrl( url ) + '" muted loop autoplay preload="auto"></video>';

		}

		if( isTrueValue( dt.ov ) && 'ovc' in dt ){
			o += '<div class="cpb-backgroundOverlay"></div>';

		}
		o += '</div>';

		return o;

	}

};

const METHODS = {

	init: function( data, css, parent, from ){
		var _do, ids, s, fragment, section;

		if( !isObject( data ) || !isString( data._sections ) || !CORE.hasConnection( data, 'sections' ) ){
			return false;

		}

		if( !isArray( ids = parseIds( data._sections.trim(), 'array' ) ) || ids.length < 1 ){
			return false;

		}
		_do = 0;
		from = parseId( from );
		fragment = DOCUMENT.createDocumentFragment();

		for( s = 0; s < ids.length; s++ ){

			if( _do !== 1 && from !== false && from !== ids[s] ){
				continue;

			}

			if( !( section = METHODS.section( data, css, ids[s] ) ) ){
				continue;

			}
			fragment.appendChild( section );
			_do = 1;

		}
		parent.appendChild( fragment );
		return true;

	},

	section: function( data, css, id ){
		var html, section, cl, r, ids, fragment, row;

		if( !CORE.hasConnection( data, 'sections' ) || !( id = parseId( id ) ) || !isObject( data.sections[id] ) ){
			return false;

		}
		CORE.css( id, 'sections', data.sections[id] );

		if( css ){
			return true;

		}
		cl = 'cpb-section-' + id;
		cl += ' cpb-section';

		html = '<div class="cpb-rows cpb-sectionContent">';
		html += CORE.backgroundTags( data.sections[id] );
		html += '</div>';

		section = DOCUMENT.createElement( 'div' );
		section.className = cl;
		section.dataset.id = id;
		section.innerHTML = html;

		if( CORE.hasConnection( data, 'rows' ) && isString( data.sections[id]._rows ) && isArray( ids = parseIds( data.sections[id]._rows.trim(), 'array' ) ) && ids.length > 0 ){
			fragment = DOCUMENT.createDocumentFragment();

			for( r = 0; r < ids.length; r++ ){

				if( !( row = METHODS.row( data, css, ids[r] ) ) ){
					continue;

				}
				fragment.appendChild( row );

			}
			section.firstChild.appendChild( fragment );

		}
		return section;

	},

	row: function( data, css, id ){
		var c, html, row, ids, cl, nb, fragment, column;

		if( !CORE.hasConnection( data, 'rows' ) || !( id = parseId( id ) ) || !isObject( data.rows[id] ) ){
			return false;

		}
		CORE.css( id, 'rows', data.rows[id] );

		if( css ){
			return true;

		}

		cl = 'cpb-row';
		cl += ' cpb-row-' + id;

		html = '<div class="cpb-rowContent" data-ncol="0">';
		html += CORE.backgroundTags( data.rows[id] );
		html += '</div>';

		row = DOCUMENT.createElement( 'div' );
		row.className = cl;
		row.dataset.id = id;
		row.innerHTML = html;

		nb = 0;

		if( CORE.hasConnection( data, 'columns' ) && isString( data.rows[id]._columns ) && isArray( ids = parseIds( data.rows[id]._columns.trim(), 'array' ) ) && ids.length > 0 ){
			fragment = DOCUMENT.createDocumentFragment();

			for( c = 0; c < ids.length; c++ ){

				if( !( column = METHODS.column( data, css, ids[c] ) ) ){
					continue;

				}
				fragment.appendChild( column );
				nb++;
			}
			row.firstChild.appendChild( fragment );

		}
		row.firstChild.dataset.ncol = nb;
		return row;

	},

	column: function( data, css, id ){
		var e, html, column, ids, cl, fragment, element;

		if( !CORE.hasConnection( data, 'columns' ) || !( id = parseId( id ) ) || !isObject( data.columns[id] ) ){
			return false;

		}
		CORE.css( id, 'columns', data.columns[id] );

		if( css ){
			return true;

		}

		cl = 'cpb-column';
		cl += ' cpb-column-' + id;

		html = '<div class="cpb-columnContent">';
		html += CORE.backgroundTags( data.columns[id] );
		html += '</div>';

		column = DOCUMENT.createElement( 'div' );
		column.className = cl;
		column.dataset.id = id;
		column.innerHTML = html;

		if( CORE.hasConnection( data, 'elements' ) && isString( data.columns[id]._elements ) && isArray( ids = parseIds( data.columns[id]._elements.trim(), 'array' ) ) && ids.length > 0 ){
			fragment = DOCUMENT.createDocumentFragment();

			for( e = 0; e < ids.length; e++ ){

				if( !( element = METHODS.element( data, css, ids[e] ) ) ){
					continue;

				}
				fragment.appendChild( element );
			}
			column.firstChild.appendChild( fragment );

		}
		return column;

	},

	element: function( data, css, id, state ){
		var cl, element, fragment, el;

		if( !CORE.hasConnection( data, 'elements' ) || !( id = parseId( id ) ) || !isObject( data.elements[id] ) || !isString( data.elements[id]._type ) ){
			return false;

		}

		if( !( el = Element( data.elements[id]._type.trim(), id, sanitizeData( data, id ) ) ) ){
			return false;

		}
		style( id, 'elements' ).insert( el.css() );

		if( css || ( [ 'view', 'VIEW' ].indexOf( state ) > -1 && !el.force_js ) ){
			return true;

		}
		fragment = DOCUMENT.createDocumentFragment();
		element = DOCUMENT.createElement( 'div' );
		fragment.appendChild( element );

		cl = 'cpb-element';
		cl += ' cpb-element' + capitalize( data.elements[id]._type.trim() );
		cl += ' cpb-elementNode' + id;

		element.className = cl;
		element.dataset.id = id;
		element.innerHTML = '<div class="cpb-elementContent"></div>';
		el.view( element );

		if( [ 'update', 'UPDATE', 'updating', 'UPDATING', true, 1 ].indexOf( state ) > -1 ){
			TARGET.set({node: element });

		}
		return fragment;

	},

};

export default function( data, css ){

	css = CORE.isEntry( css );

	if( !isObject( data ) ){
		data = {};

	}

	if( !isObject( data.sections ) ){
		data.sections = {};

	}

	if( !isObject( data.rows ) ){
		data.rows = {};

	}

	if( !isObject( data.columns ) ){
		data.columns = {};

	}

	if( !isObject( data.elements ) ){
		data.elements = {};

	}

	return {
		css,

		init: function( parent, from ){
			return METHODS.init( data, css, parent, from );

		},

		section: function( id ){
			return METHODS.section( data, css, id );

		},

		row: function( id ){
			return METHODS.row( data, css, id );

		},

		column: function( id ){
			return METHODS.column( data, css, id );

		},

		element: function( id, state ){
			return METHODS.element( data, css, id, state );

		}

	};

}