import { isString, isBool, isDefined, isEmpty } from './is.js';

/* global window, Comet */

export default function (){

	window.Comet = typeof Comet !== 'object' ? {} : Comet;

	const CORE = {

		get: function( from ){

			if( !isString( from ) || !( ( from = from.trim() ) in Comet ) ){
				return false;

			}
			return Comet[from];

		},

		set: function( to, data, forceErase ){

			if( !isString( to ) || isEmpty( to = to.trim() ) ){
				return false;

			}
			forceErase = isBool( forceErase ) && forceErase;

			if( ( to in Comet && forceErase ) || !( to in Comet ) ){
				Comet[to] = data;

			}
			return CORE.get( to );

		},

		isSet: function( to ){

			return ( !CORE.get( to ) ? false : true );

		},

		unset: function( to ){

			if( !CORE.isSet( to ) ){
				return false;

			}
			delete Comet[to];
			return true;

		}


	};
	return CORE;

}