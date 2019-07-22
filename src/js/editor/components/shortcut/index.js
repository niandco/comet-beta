import { frame as getFrame, shortcut as getShortcut } from '../stored.js';
import { isObject, isString } from '../../../utils/is.js';
import { CORE, DOCUMENT, WINDOW } from './core.js';
import { getSortParameters } from './sort.js';
import { onButtonsClick } from './buttons.js';
import Global from '../../../utils/global.js';
import node from '../../../dom/element.js';

/* global document, window, __cometi18n */

const MENU = {

    create: function( ev ){
        var fragment, menuNode, target, position;

        MENU.destroy();

        if( ev.type === 'click' || !( target = CORE.getTarget( ev.target ) ) ){
            return;

        }
        ev.preventDefault();
        menuNode = DOCUMENT.createElement( 'div' );
        fragment = DOCUMENT.createDocumentFragment();
        fragment.appendChild( menuNode );

        menuNode.className = CORE.classes.menu;

        MENU.setOptions( target.type, target.target, menuNode );
        DOCUMENT.body.appendChild( fragment );

        position = MENU.setPosition( ev, menuNode );

        MENU.setMenu( {
            target: menuNode,
            destroy: function(){
                node( menuNode ).remove();
                MENU.setMenu( false )
            },
            position

        } );

        return menuNode;

    },

    createButton: function( role, type, name, target ){
        var parameters;
        const button = DOCUMENT.createElement( 'button' );

        button.className = 'comet-item';
        button.innerHTML = name;
        button.dataset.role = role;

        if( role === 'move' ){

            if( !( parameters = getSortParameters( target, type ) ) ){
                return false;

            }
            node( button ).sort( parameters );
            return button;


        }
        node( button ).on( 'click', onButtonsClick, { role, type, target } );
        return button;

    },

    setOptions: function( type, target, menu ){
        const options = __cometi18n.options;
        var body, option, _option, item, count;

        if( !isObject( options ) || !CORE.isTypeDefined( type ) ){
            menu.innerHTML = __cometi18n.messages.error.noMenu;
            return;

        }

        for( option in options ){

            if( !isObject( item = options[option] ) || CORE.preventType( type, option ) ){
                continue;

            }
            count = 0;
            _option = DOCUMENT.createElement( 'div' );
            _option.className = 'comet-option'; 
            _option.innerHTML = '<span>' + item.title + '</span><div class="comet-items"></div>';
            body = _option.lastChild;

            if( 'edit' in item ){
                body.appendChild( MENU.createButton( 'edit', option, item.edit, target ) );
                count++;

            }

            if( 'move' in item ){
                body.appendChild( MENU.createButton( 'move', option, item.move, target ) );
                count++;

            }

            if( 'dup' in item ){
                body.appendChild( MENU.createButton( 'dup', option, item.dup, target ) );
                count++;

            }

            if( 'del' in item ){
                body.appendChild( MENU.createButton( 'del', option, item.del, target ) );
                count++;

            }

            if( count > 0 ){
                _option.firstChild.innerHTML = item.title + '<span class="cico cico-arrow-right"></span>';

            }
            menu.appendChild( _option );

        }

    },

    destroy: function(){
        const SHORTCUT = getShortcut();

        if( SHORTCUT ){
            SHORTCUT.destroy();

        }

    },

    setPosition: function( e, menu ){

        const frame = getFrame();

        var clickCoords = CORE.getPosition( e );
        var clickCoordsX = clickCoords.x;
        var clickCoordsY = clickCoords.y;

        var menuWidth = menu.offsetWidth + 154;
        var menuHeight = menu.offsetHeight + 4;

        var windowWidth = frame.target.offsetWidth;
        var windowHeight = frame.target.offsetHeight;

        var left = 0;
        var top = 0;

        if( ( windowWidth - clickCoordsX ) < menuWidth ){
            menu.style.left = ( left = windowWidth - menuWidth ) + 'px';

        }else{
            menu.style.left = ( left = clickCoordsX ) + 'px';
        }

        if( ( windowHeight - clickCoordsY ) < menuHeight ){
            menu.style.top = ( top = windowHeight - menuHeight ) + 'px';

        }else{
            menu.style.top = ( top = clickCoordsY ) + 'px';

        }

        return { top, left };

    },

    setMenu: function( data ){
        return Global().set( 'shortcut', data, true );

    }

};

export default function(){

    const FRAME = getFrame();

    if( !FRAME ){
        return;

    }
    node( DOCUMENT.documentElement ).on( 'contextmenu click', MENU.create );
    node( WINDOW ).on( 'resize', MENU.destroy );
    FRAME.targetNode.on( 'scroll', MENU.destroy );

}