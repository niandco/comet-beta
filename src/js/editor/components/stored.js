import { isObject, isString } from '../../utils/is.js';
import { inArray } from '../../utils/fill.js';
import GLOBAL from '../../utils/global.js';

const Global = GLOBAL();

function get( slug ){
	const GET = Global.get( slug );

	return isObject( GET ) ? GET : false;

}

function getObject( slug ){
	const GET = get( slug );

	return !GET ? {} : GET;

}

export function frameset(){

	return get( 'frameset' );
	
}

export function frame(){

	return get( 'frame' );
	
}

export function cockpit(){

	return get( 'cockpit' );
	
}

export function panel(){

	return get( 'panel' );
	
}

export function shortcut(){

	return get( 'shortcut' );
	
}

export function generalSettings(){

	return get( 'generalSettings' );
	
}

export function notifications(){

	return get( 'notifications' );

}

export function getDeviceType(){
	var device = Global.get( 'deviceType' );
	const DEVICES = [ 'tablet', 'mobile' ];

	return isString( device ) && inArray( DEVICES, ( device = ( device.trim() ).toLowerCase() ) ) ? device : 'desktop';

}

export function getSvgSets(){

	return getObject( 'svgSets' );

}

export function getPost(){

	return getObject( 'post' );

};

export function getPostMeta(){
	const POST = getPpost();

	return !isObject( POST.meta ) ? {} : POST.meta;

}

export function getSettings(){

	return getObject( 'settings' );

}

export function getSettingsFrom( slug ){
	const SETTINGS = getSettings();
	const TYPES = [ 'section', 'row', 'column', 'elements' ];

	return isString( slug ) && inArray( TYPES, ( slug = slug.trim() ) ) && isObject( SETTINGS[slug] ) ? SETTINGS[slug] : false;

}

export function getElements(){

	return getSettingsFrom( 'elements' );

}

export function getElement( slug ){
	const ELEMENTS = getElements();

	return isString( slug ) && isObject( ELEMENTS[( slug = slug.trim() )] ) ? ELEMENTS[slug] : false;

}
