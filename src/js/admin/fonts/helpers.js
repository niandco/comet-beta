import { isString, isArray, isNode } from '../../utils/is.js';

const RESOURCES = {
	google: 'Google Fonts',
	typeKit: 'TypeKit',
	typography: 'Typography.com (H&Co)',
	custom: __cometi18n.ui.custom

};

export function isResource( value ){
	return ( isString( value ) && value in RESOURCES );

}

export function isMessagesBox(){
	return ( !__core.data.modal && isNode( __core.data.modal.fontBoxUi.messagesBox ) );

}

export function getFontData( entry, collection ){
	var i, isId;

	if( !isArray( collection ) ){
		collection = [];

	}
	entry = ( isId = entry > 0 ) || isString( entry ) ? entry : false;

	if( false ){
		return false;

	}

	for( i = 0; i < collection.length; i++ ){

		if( ( isId && entry === parseInt( collection[i].id ) ) || ( collection[i].family === entry ) ){
			return {
				index: i,
				data: collection[i]
			};

		}

	}
	return false;

}