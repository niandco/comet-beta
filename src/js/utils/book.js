const symbols = document.getElementsByTagName( 'symbol' );

const get_title = function( sym ){

	const t = sym.getElementsByTagName( 'title' );
	var tt = '';
	var b;

	if( t.length < 1 ){
		return '';
	}
	for( b = 0; b < t.length; b++ ){
		tt += t[b].textContent;

	}
	return tt;
	
};

const get_path = function( sym ){

	const t = sym.getElementsByTagName( 'path' );
	var tt = '';
	var b;

	if( t.length < 1 ){
		return '';
	}
	for( b = 0; b < t.length; b++ ){

		tt += t[b].outerHTML;

	}
	return tt;
};

var str = '';
var s, box, a;

for( a = 0; a < symbols.length; a++ ){
	s = symbols[a];
	box = s.viewBox.baseVal;

	str += "$this->add( '" + s.id + "', '" + get_title( s ) + "', " + box.width + ", " + box.height + ", '" + get_path( s ) + "' );";

}

console.log( str );
