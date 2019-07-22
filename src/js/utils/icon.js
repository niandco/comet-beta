import { isString, isObject, isArray, isEmpty } from './is.js';
import { getSvgSets } from '../editor/components/stored.js';

const ICON = {

	get_set: function( set_id ){
		const sets = getSvgSets();

		return ( isObject( sets ) && isString( set_id ) && isObject( sets[set_id] ) ? sets[set_id] : {} );

	},

	get_icon: function( set_id, icon_id ){
		var set;

		if( !ICON.icon_exists( set_id, icon_id ) ){
			return false;

		}
		set = ICON.get_set( set_id );

		return set.set[icon_id];

	},

	get_svg: function( set_id, icon_id ){
		const icon = ICON.get_icon( set_id, icon_id );

		return ( !icon ? '' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + icon.width + ' ' + icon.height + '">' + icon.path + '</svg>' );

	},

	get_svg_from_data: function( data ){

		if( isObject( data ) && 'width' in data && 'height' in data && 'path' in data ){
			return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + data.width + ' ' + data.height + '">' + data.path + '</svg>';

		}
		return '';

	},

	set_exists: function( set_id ){
		const sets = getSvgSets();

		return ( isObject( sets ) && isString( set_id ) && isObject( sets[set_id] ) );

	},

	icon_exists: function( set_id, icon_id ){
		const set = ICON.get_set( set_id );

		return ( isString( icon_id ) && isObject( set ) && isObject( set.set ) && isObject( set.set[icon_id] ) );

	},

	decode: function( entry ){

		if( !isString( entry ) || isEmpty( entry = entry.trim() ) || !isArray( entry.split( ':' ) ) || entry.length < 2 ){
			return false;

		}

		return {
			set_id: entry[0],
			icon_id: entry[1]
		};

	},

	encode: function( set_id, icon_id ){

		return ( !ICON.icon_exists( set_id, icon_id ) ? false : set_id + ':' + icon_id );

	}
	
};

export default ICON;