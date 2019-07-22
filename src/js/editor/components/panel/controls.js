import { isString, isEmpty, isObject, isNode } from '../../../utils/is.js';
import { stripTags, inArray } from '../../../utils/fill.js';
import { ClassName } from '../../../utils/className.js';


const DOCUMENT = document;

const CORE = {

	classes: {
		control: {
			default: 'comet-panel__control',
			field: 'comet-panel__control__field'

		},
		meta: {
			default: 'comet-panel__control__meta',
			label: 'comet-panel__control__meta__label',
			tooltip: 'comet-panel__control__meta__tooltip',
			desc: 'comet-panel__control__meta__desc',
			icon: 'comet-panel__control__meta__icon',
		},
	},

	createControl: function( id, data ){
		const control = DOCUMENT.createElement( 'div' );
		const class_className = ClassName( CORE.classes.control.default );
		var controlInner = '<div class="' + CORE.classes.meta.default + '">';

		controlInner += '<label class="' + CORE.classes.meta.label + '">' + data.label + '</label>';

		if( isString( data.desc ) && !isEmpty( data.desc ) ){
			controlInner += '<div class="' + CORE.classes.meta.tooltip + '">';
			controlInner += '<span class="' + CORE.classes.meta.icon + '">?</span>';
			controlInner += '<span class="' + CORE.classes.meta.desc + '">';
			controlInner += stripTags( data.desc, '<b><strong><i><a><span><sub><sup><ins>' );
			controlInner += '</span>';
			controlInner += '</div>';

		}
		controlInner += '</div>';
		controlInner += '<div class="' + CORE.classes.control.field + '"></div>';
		control.innerHTML = controlInner;
		control.className = class_className.combineWith( [ class_className.modifier( data.type ) ] );

		return { id, data, control: control.lastChild, wrapper: control };

	}

};

export function createControls( sectionBody, data ){
	const controls = [];
	var id, response, controlData;

	if( !isNode( sectionBody ) || !isObject( data ) ){
		return false;

	}

	for( id in data ){

		if( !isObject( controlData = data[id] ) || !isString( controlData.type ) || !isString( controlData.label ) ){
			continue;

		}
		controlData.type = ( stripTags( controlData.type.toLowerCase() ) ).trim();
		controlData.label = ( stripTags( controlData.label ) ).trim();
		controlData.responsive = isString( controlData.responsive ) && inArray( [ 'true', 'yes' ], ( controlData.responsive.toLowerCase() ).trim() );
		response = CORE.createControl( id, controlData );
		sectionBody.appendChild( response.wrapper );
		delete response.wrapper;
		controls[controls.length] = response;

	}
	return controls;

}