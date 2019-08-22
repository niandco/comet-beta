

function setDefault( self, name, entry ){

	if( isNode( self.data[name] ) ){
		return self.data[name];

	}

	if( !isNode( entry ) ){
		return false;

	}
	self.data[name] = entry;
	return self.data[name];


}

function setIsBoolean( self, propName, value ){

	if( !( propName in self.data ) ){
		return false;

	}

	if( !isBool( value ) ){
		return self.propName();

	}
	self.data[propName] = value;
	return value;

}

export default function( self ){

	if( isObject( self ) ){

		return {

			setDefault: function( name, entry ){
				return setDefault( self, name, entry );

			},

			setIsBoolean: function( name, entry ){
				return setIsBoolean( self, name, entry );

			}

		};

	}
	return false;

}