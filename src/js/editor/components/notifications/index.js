import { isString, isObject, isNode } from '../../../utils/is.js';
import { ClassName } from '../../../utils/className.js';
import { frameset as getFrameset } from '../stored.js';
import Global from '../../../utils/global.js';
import node from '../../../dom/element.js';

const DOCUMENT = document;

const SLUG = 'notifications';

const BASE = 'comet-' + SLUG;

const NOTE_CLASSNAME = ClassName( BASE );

const CORE = {

	classes: {
		open: NOTE_CLASSNAME.modifier( 'open' ),
		header: NOTE_CLASSNAME.element( 'header' ),
		close: {
			main: NOTE_CLASSNAME.element( 'close' ),
			icon: NOTE_CLASSNAME.element( 'close__icon' ),
			tooltip: NOTE_CLASSNAME.element( 'close__tooltip' )

		},
		list: NOTE_CLASSNAME.element( 'list' ),
		note: {
			main: NOTE_CLASSNAME.element( 'note' ),
			text: NOTE_CLASSNAME.element( 'note__text' ),
			remove: {
				main: NOTE_CLASSNAME.element( 'note__remove' ),
				icon: NOTE_CLASSNAME.element( 'note__remove__icon' ),
				tooltip: NOTE_CLASSNAME.element( 'note__remove__tooltip' )
			}

		},
		clear: NOTE_CLASSNAME.element( 'clear' )

	},

	removeNote: function( ev, ui ){
		const notification = ui.parentNode;

		ev.preventDefault();

		if( notification === null || notification.parentNode === null ){
			return;

		}
		notification.parentNode.removeChild( notification );

	},

	clearBoard: function( ev, ui, target ){
		ev.preventDefault();

		target.innerHTML = '';

	}

};

export default function(){

	const FRAGMENT = DOCUMENT.createDocumentFragment();

	const NOTIFICATIONS = DOCUMENT.createElement( 'div' );

	const FRAMESET = getFrameset();

	const GLOBAL = Global();

	const DATA = {
		target: null,
		open: false,
		classes: [],
		notifications: null

	};

	const EVENTS = {

		toggle: function( ev ){
			var _target;

			if( isObject( ev ) ){
				ev.preventDefault();

			}

			if( !isNode( DATA.target ) ){
				return false;

			}
			_target = node( DATA.target )

			if( _target.hasClass( CORE.classes.open ) && DATA.open ){
				_target.removeClass( CORE.classes.open );
				DATA.open = false;
				return;

			}
			_target.addClass( CORE.classes.open );
			DATA.open = true;

		},

		destroy: function(){

			if( DATA.target === null || DATA.target.parentNode === null ){
				return false;

			}
			DATA.target.parentNode.removeChild( DATA.target );
			GLOBAL.unset( SLUG );

		},

		add: function( note, status ){
			var mainClass, notification, ninner, statusClass;

			if( !isString( note ) ){
				return false;

			}

			switch( parseInt( status ) ){
				case 100:
				status = 'note';
				break;
				case 200:
				status = 'success';
				break;
				case 300:
				status = 'warning';
				break;
				default:
				status = 'error';

			}
			statusClass = ClassName( CORE.classes.note.main ).modifier( status );
			notification = DOCUMENT.createElement( 'div' );
			notification.className = ClassName( CORE.classes.note.main ).combineWith( [ statusClass ] );

			ninner = '<p class="' + CORE.classes.note.text + '">' + note + '</p>';
			ninner += '<button class="' + CORE.classes.note.remove.main + '" aria-label="' + __cometi18n.ui.remove + '">';
			ninner += '<span class="' + ClassName( CORE.classes.note.remove.icon ).combineWith( [ 'cico', 'cico-x' ] ) + '"></span>';
			ninner += '<span class="' + CORE.classes.note.remove.tooltip + '">' + __cometi18n.ui.remove + '</span>';
			ninner += '</button>';

			notification.innerHTML = ninner;

			DATA.notifications.appendChild( notification );

			node( notification.lastChild ).on( 'click', CORE.removeNote );

			EVENTS.toggle();

		},

	};

	var inner;

	if( !FRAMESET ){
		return false;

	}

	FRAGMENT.appendChild( NOTIFICATIONS );

	inner = '<header class="' + CORE.classes.header + '">';
	inner += '<h4>' + __cometi18n.ui.notifications + '</h4>';
	inner += '<button class="' + CORE.classes.close.main + '">';
	inner += '<span class="' + ClassName( CORE.classes.close.icon ).combineWith( [ 'cico', 'cico-x' ] ) + '"></span>';
	inner += '<span class="' + CORE.classes.close.toggle + '">' + __cometi18n.ui.close + '</span>';
	inner += '</button>';
	inner += '<p>';
	inner += '<button class="' + CORE.classes.clear + '">' + __cometi18n.ui.clearNx + '</button>';
	inner += '</p>';
	inner += '</header>';
	inner += '<section class="' + CORE.classes.list + '"></section>';

	NOTIFICATIONS.className = BASE;
	NOTIFICATIONS.innerHTML = inner;


	DATA.target = NOTIFICATIONS;
	DATA.notifications = NOTIFICATIONS.lastChild;

	EVENTS.target = NOTIFICATIONS;

	GLOBAL.set( SLUG, EVENTS, true );

	node( NOTIFICATIONS.firstChild.children[1] ).on( 'click', EVENTS.toggle );
	node( NOTIFICATIONS.firstChild.lastChild.lastChild ).on( 'click', CORE.clearBoard, DATA.notifications );

	FRAMESET.append( FRAGMENT );

	return EVENTS;

}