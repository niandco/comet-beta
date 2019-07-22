import { isString, isObject, isArray, isBool, isFunction } from '../is.js';
import { escUrl, stripTags, jsonEncode } from '../fill.js';
import { sanitizeNumber } from '../sanitize.js';
import { parseId } from '../parse.js';
import Icon from '../icon.js';
import ajax from '../ajax.js';

const DOCUMENT = document;

export { default as renderEditor } from './editor.js';

export function renderImage( entry ){
	var classe, tmp, src, img;

	if( !isObject( entry ) || !isString( entry.src ) || ( src = ( stripTags( entry.src ) ).trim() ).length < 1 ){
		return false;

	}
	classes = isArray( entry.classes ) ? entry.classes : [];
	classes[classes.length] = 'cpb-image';

	img = DOCUMENT.createElement( 'img' );
	img.className = classes.join( ' ' );
	img.src = escUrl( src );

	if( ( tmp = sanitizeNumber({ value: entry.width, min: 0 }) ) > 0 ){
		img.width = tmp;

	}

	if( ( tmp = sanitizeNumber({ value: entry.height, min: 0 }) ) > 0 ){
		img.height = tmp;

	}

	if( isString( entry.alt ) && ( tmp = ( stripTags( entry.alt ) ).trim() ).length > 0  ){
		img.alt = tmp;

	}

	if( isBool( entry.auto ) && entry.auto ){

		img.onload = function(){
			this.width = this.naturalWidth;
			this.height = this.naturalHeight;

		};

	}
	return img;

}

export function renderIcon( entry ){
	const decoded = Icon.decode( entry );

	return ( !decoded ? '' : Icon.get_svg( decoded.set_id, decoded.icon_id ) );

}

export function renderElement( opts, ondone ){
	var id;

	if( !isObject( opts ) || !isFunction( ondone ) || !( id = parseId( opts.id ) ) ){
		return false;

	}

	ajax({
		do: 'element',
		element: opts.element.trim(),
		id: id,
		data: jsonEncode( isObject( opts.data ) ? opts.data : {} )

	}).done( ondone );

}

export function renderPlaceholder(){
	return '<div class="cpb-empty cpb-placeholder"><span>Placeholder</span></div>';

}
