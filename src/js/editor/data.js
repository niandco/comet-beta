import { parseJson, parseId, parseType, parseIds } from '../utils/parse.js';
import { isObject, isArray, isEmpty, isString } from '../utils/is.js';
import { getElement } from './components/stored.js';
import { extend } from '../utils/fill.js';
import GLOBAL from '../utils/global.js';
import { ID } from './id.js';

const CORE = {

	removeChildren: function( metaData, type ){
		const children = DATA.getChild( type );
		var ids, _children, cid, a;

		if( children || !isObject( metaData[children] ) || !isObject( metaData[type][id] ) ){
			return;

		}

		if( !( ( _children = '_' + children ) in metaData[type][id] ) ){
			return;

		}

		if( !isArray( ( ids = parseIds( metaData[type][id][_children], 'array' ) ) ) || ids.lenght < 1 ){
			return;

		}
		for( a in ids ){

			if( !( cid = parseId( ids[a] ) ) || !( cid in metaData[children] ) ){
				continue;

			}
			DATA.remove( cid, children );
			delete metaData[children][cid];

		}

	}

};

export const DATA = {

	getData: function(){
		var data = GLOBAL().get( 'data' );
		return ( isObject( data ) ? data : DATA.setData( {} ) );

	},

	setData: function( data ){

		if( !isObject( data ) ){
			return false;

		}
		return GLOBAL().set( 'data', data );

	},

	hasType: function( type ){
		const metaData = DATA.getData();

		return ( !isObject( metaData ) || !( type = parseType( type ) ) || !isObject( metaData[type] ) ? false : type );

	},

	hasId: function( type, id ){
		const metaData = DATA.getData();

		return ( !( type = DATA.hasType( type ) ) || !( id = parseId( id ) ) || !( id in metaData[type] ) ? false : id );

	},

	getParent: function( type ){

		switch( type = parseType( type ) ){
			case 'rows':
			case 'sections':
			return 'sections';

			case 'columns':
			return 'rows';

			case 'elements':
			return 'columns';

			case 'items':
			return 'elements';

			default:
			return false;
		}

	},

	getChild: function( type ){

		switch( type = parseType( type ) ){
			case 'sections':
			return 'rows';

			case 'rows':
			return 'columns';

			case 'columns':
			return 'elements';

			case 'elements':
			return 'items';
			
			default:
			return false;
		}

	},

	create: function( type, pid, index, dd ){
		var metaData = DATA.getData();
		var data, id, st;

		if( ( pid = parseId( pid ) ) === false || !isString( type ) || isEmpty( type ) ){
			return false;

		}

		if( !isObject( dd ) ){
			dd = {};

		}

		switch( type ){

			case 'sections':
			//data = utils.getSettingsFrom( 'section' );
			break;

			case 'rows':
			//data = utils.getSettingsFrom( 'row' );
			break;

			case 'columns':
			//data = utils.getSettingsFrom( 'column' );
			break;

			case 'items':

			if( !isObject( metaData.elements ) || !isObject( metaData.elements[pid] ) ){
				return false;

			}

			if( !isString( st = metaData.elements[pid]._type ) || !isObject( st = getElement( st ) ) ){
				return false;

			}

			if( !isObject( st.tabs ) || !isObject( st.tabs.items ) ){
				return false;

			}
			//data = st.tabs.items;
			break;

			default:

			if( !isObject( data = getElement( type ) ) || !isObject( data.tabs ) ){
				return false;

			}
			dd._type = type;
			//data = data.tabs;
			type = 'elements';
			break;

		}

		if( !( id = ID.create( type ) ) || !ID.insert( id, type, pid, index ) ){
			return false;

		}
		metaData = DATA.getData();

		if( !isObject( metaData[type] ) ){
			metaData[type] = {};

		}

		if( !isObject( metaData[type][id] ) ){
			metaData[type][id] = {};

		}
		metaData[type][id] = extend( {}, dd );
		DATA.setData( metaData );
		return id;

	},

	insert: function( id, type, data ){
		var metaData = DATA.getData();

		if( !( type = parseType( type ) ) || !( id = parseId( id ) ) ){
			return false;

		}

		if( !isObject( metaData ) ){
			metaData = {};

		}

		if( !isObject( metaData[type] ) ){
			metaData[type] = {};

		}

		if( !( id in metaData[type] ) ){
			metaData[type][id] = {};

		}
		metaData[type][id] = extend( {}, data );
		DATA.setData( metaData );
		return metaData[type][id];

	},

	set: function( id, type, data ){
		var metaData = DATA.getData();
		var a;

		if( !( type = DATA.hasType( type ) ) || !( id = parseId( id ) ) || !isObject( data ) ){
			return false;

		}

		if( !isObject( metaData[type][id] ) ){
			metaData[type][id] = {};

		}

		for( a in data ){
			metaData[type][id][a] = data[a];

		}
		DATA.setData( metaData );
		return metaData[type][id];

	},

	get: function( id, type ){
		const metaData = DATA.getData();

		return ( !( id = parseId( id ) ) || !( type = this.hasType( type ) ) || !isObject( metaData[type][id] ) ? false : metaData[type][id] );

	},

	remove: function( id, type, pid ){
		const metaData = DATA.getData();

		if( !( id = parseId( id ) ) || !( type = DATA.hasType( type ) ) || !( id in metaData[type] ) ){
			return false;

		}
		CORE.removeChildren( metaData, type );
		ID.remove( id, type, pid );
		
		delete metaData[type][id];
		DATA.setData( metaData );
		return true;

	},

	removeIds: function( id, type ){
		const metaData = DATA.getData();
		var children, _children;

		if( !( id = DATA.hasId( type, id ) ) || !( type = parseType( type ) ) || !( children = DATA.getChild( type ) ) ){
			return false;

		}
		_children = '_' + children;
		metaData[type][id][_children] = '';
		DATA.setData( metaData );
		return true;

	},

	clone: function( id, type, pid ){
		const metaData = DATA.getData();
		var tmp = {};
		var children, _children, cid, ids, nid, nnid, i;

		pid = pid && ( pid = parseId( pid ) ) ? pid : 0;

		if( !( id = parseId( id ) ) || !( type = DATA.hasType( type ) ) || !( id in metaData[type] ) ){
			return false;

		}

		if( !( nid = ID.create( type ) ) || !ID.insert( nid, type, pid, 'last' ) ){
			return false;

		}

		if( isObject( metaData[type][id] ) ){
			tmp = metaData[type][id];

		}

		if( !DATA.insert( nid, type, tmp ) ){
			return false;

		}


		if( !isObject( metaData[type][id] ) || !( children = DATA.hasType( DATA.getChild( type ) ) ) ){
			return nid;

		}
		_children = '_' + children;
		
		if( !isString( metaData[type][id][_children] ) || isEmpty( metaData[type][id][_children] ) ){
			return nid;

		}

		if( !isArray( ids = parseIds( metaData[type][id][_children], 'array' ) ) || ids.lenght < 1 ){
			return nid;

		}

		for( i in ids ){

			if( !( cid = parseId( ids[i] ) ) || !isObject( metaData[children][cid] ) || !( nnid = DATA.clone( cid, children ) ) ){
				continue;

			}
			ids[i] = nnid;
			metaData[type][nid][_children] = ids.join( ',' );

		}
		DATA.setData( metaData );
		return nid;

	}

};