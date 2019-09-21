import { isObject, isNode, isBool } from '../../utils/is.js';

function setDefault( data, name, entry ){

	if( isNode( data[name] ) ){
		return data[name];

	}

	if( !isNode( entry ) ){
		return false;

	}
	data[name] = entry;
	return data[name];


}

function setIsBoolean( data, propName, value ){

	if( !( propName in data ) ){
		return false;

	}

	if( !isBool( value ) ){
		return data.propName();

	}
	data[propName] = value;
	return value;

}

export default function( data ){

	if( isObject( data ) ){

		return {

			setDefault: function( name, entry ){
				return setDefault( data, name, entry );

			},

			setIsBoolean: function( name, entry ){
				return setIsBoolean( data, name, entry );

			}

		};

	}
	return false;

}