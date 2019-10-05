import { isArray, isObject, isString, isEmpty } from '../utils/is.js';
import { parseType, parseId, parseIds } from '../utils/parse.js';
import { xtrim } from '../utils/fill.js';
import { DATA } from './data.js';

const CORE = {

	remove: function( id, str ){
		const nids = [];
		var a, cid, ids;

		if( !isArray( ids = parseIds( str, 'array' ) ) || ids.length < 1 ){
			return false;

		}

		for( a = 0; a < ids.length; a++ ){

			if( !( cid = parseId( ids[a] ) ) || cid === id  ){
				continue;

			}
			nids[nids.length] = cid;

		}
		return nids.join( ',' );

	},

	insert: function( id, position, str ){
		var tp, a, b;

		if( str.length < 1 ){
			return id.toString();

		}

		if( position === 'last' ){

			if( str.substring( -1, 1 ) !== ',' ){
				str += ',';

			}
			str += id;

		}else if( position === 'first' ){

			if( str.substring( 0, 1 ) !== ',' ){
				str = ',' + str;

			}
			str = id + str;

		}else if( ( position = parseId( position ) ) !== false && ( tp = str.indexOf( position, 0 ) ) > -1 ){
			b = str.slice( 0, tp );
			a = str.slice( tp );
			str = b + id + ',' + a;

		}
		return str;

	}

};

function IdsString( str ){

	if( !isString( str ) ){
		str = '';

	}else{
		str = str.trim();

	}

	return {

		remove: function( id ){
			return CORE.remove( id, str );

		},

		insert: function( id, position ){
			return CORE.insert( id, position, str );

		}

	};

}

export const ID = {

	create: function( type ){
		const metaData = DATA.getData();
		var max = 0;

		if( !( type = parseType( type ) ) ){
			return false;

		}

		if( !isObject( metaData[type] ) ){
			metaData[type] = {};

		}
		max = !( max = parseId( metaData[type]._max ) ) || max < 0 ? 0 : max;
		max = max + 1;

		metaData[type]._max = max;
		metaData[type][max] = {};
		DATA.setData( metaData );

		return max;

	},

	insert: function( id, type, catId, position ){
		const metaData = DATA.getData();
		var _in, cat, ids, r;

		if( !( id = parseId( id ) ) || ( catId = parseId( catId ) ) === false || !( type = DATA.hasType( type ) ) ){
			return false;

		}

		if( !( id in metaData[type] ) || !( cat = DATA.getParent( type ) ) ){
			return false;

		}
		_in = '_' + type;

		if( type === 'sections' ){
			ids = isString( ids = metaData[_in] ) ? ids : '';

			if( ( r = IdsString( ids ).insert( id, position ) ) !== ids ){
				metaData[_in] = r;
				DATA.setData( metaData );
				return true;

			}
			return false;

		}

		if( !isObject( metaData[cat] ) || !( catId in metaData[cat] ) ){
			return false;

		}

		if( !isObject( metaData[cat][catId] ) ){
			metaData[cat][catId] = {};

		}
		ids = isString( ids = metaData[cat][catId][_in] ) ? ids : '';

		if( ( r = IdsString( ids ).insert( id, position ) ) !== ids ){
			metaData[cat][catId][_in] = r;
			DATA.setData( metaData );
			return true;

		}
		return false;

	},

	remove:function( id, type, pid ){
		const metaData = DATA.getData();
		var _in, parent, tmp; 

		if( !( id = parseId( id ) ) || !( type = parseType( type ) ) ){
			return false;

		}
		parent = DATA.getParent( type );
		_in = '_' + type;

		if( type === 'sections' && isString( metaData[_in] ) && !isEmpty( metaData[_in] ) ){

			if( !( tmp = IdsString( xtrim( metaData[_in], ',' ) ).remove( id ) ) ){
				return false;

			}
			metaData[_in] = tmp;
			DATA.setData( metaData );
			return true;

		}else if( ( pid = DATA.hasId( parent, pid ) ) && isString( metaData[parent][pid][_in] ) && !isEmpty( metaData[parent][pid][_in] ) ){

			if( !( tmp = IdsString( xtrim( metaData[parent][pid][_in], ',' ) ).remove( id ) ) ){
				return false;

			}
			metaData[parent][pid][_in] = tmp;
			DATA.setData( metaData );
			return true;

		}
		return false;

	},

	replace: function( id, nid, type, pid ){
		const metaData = DATA.getData();
		var _in, parent, str;

		if( !( id = parseId( id ) ) || !( nid = parseId( nid ) ) || ( pid = parseId( pid ) ) === false || !( type = parseType( type ) ) ){
			return false;

		}
		parent = DATA.getParent( type );
		_in = '_' + type;

		if( type === 'sections' ){
			str = isString( metaData[_in] ) ? metaData[_in] : '';
			str = ( xtrim( str, ',' ) ).replace( id, nid );
			metaData[_in] = str;
			DATA.setData( metaData );
			return true;

		}else if( ( pid = DATA.hasId( parent, pid ) ) ){
			str = isString( metaData[parent][pid][_in] ) ? metaData[parent][pid][_in] : '';
			str = ( xtrim( str, ',' ) ).replace( id, nid );
			metaData[parent][pid][_in] = str;
			DATA.setData( metaData );
			return true;

		}
		return false;

	}

};