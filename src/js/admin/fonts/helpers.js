import { isString, isNode } from '../../utils/is.js';

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