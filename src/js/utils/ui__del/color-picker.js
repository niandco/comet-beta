import utils from '../utils.js';
import range from './range.js';
import node from '../node.js';

/* global document, window */

export default function( source, options ){

    const _d = document;

    const __picker = {
        isUsing: false,
        isOpen: false,
        isDragging: false,
        node: false,
        isset: function(){
            return node( __picker.node ).isNode();

        },
        viewer: false,
        cleaner: false,

    };

    const __color = {
        value: '#FFFFFF',
        data: [ '#', 'FFFFFF' ],
        alpha: 1,
        hsb: {
            values: [ 0, 0, 1 ],
            toColor: function(){
                const hsb = __color.hsb.values;
                var alpha, x;

                if( !utils.isArray( hsb, 3 ) ){
                    return '';

                }
                alpha = utils.isSet( hsb[3] ) ? __core.parse.value( hsb[3], 0, 1, 1, true ) : 1;

                if( alpha === 1 ){
                    x = __core.convert.hsbhex( [ hsb[0], hsb[1], hsb[2] ] );
                    return __core.utils.strcolor( 'hex', x );

                }
                x = __core.convert.hsbrgb( [ hsb[0], hsb[1], hsb[2] ] );
                return __core.utils.strcolor( 'rgba', [ x[0], x[1], x[2], alpha ] );

            }

        },
    };

    const __core = {

        parse: {

            value: function( x, min, max, dft, float ){

                if( utils.isString( x ) || utils.isNumber( x ) ){
                    x = float ? parseFloat( x ) : parseInt( x );

                    if( x >= min && x <= max ){
                        return x;

                    }

                }
                return dft;

            },

            color: function( x ){

                return ( utils.isString( x ) && ( __core.parse.rgb( x ) || __core.parse.hex( x ) ) );

            },

            hex: function( x ){
                const regex = /([0-9a-f]{6}|[0-9a-f]{3})/i;
                var match, value, last, a;

                if( utils.isString( x ) ){

                    if( ( match = x.match( regex ) ) !== null && utils.isString( match[1] ) ){
                        value = match[1];

                        if( value.length === 3 ){
                            last = value.charAt(2);

                            for( a = 0; a < 3; a++ ){
                                value += last;

                            }

                        }
                        __color.type = 'hex';
                        __color.value = __core.utils.strcolor( 'hex', value );
                        __color.data = [ '#', value ];
                        __color.hsb.values = __core.convert.hexhsb( value );
                        __color.alpha = 1;
                        return true;

                    }

                }
                return false;

            },

            rgb: function( x ){
                const regex = /(rgba?)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0?\.\d*)|\d?)\s*)?\)/i;
                var match, type, r, g, b, a;

                if( utils.isString( x ) ){

                    if( ( match = x.match( regex ) ) !== null && utils.isString( match[1] ) && ( ( type = match[1].toLowerCase() ) === 'rgba' || type === 'rgb' ) ){

                        r = __core.parse.value( match[2], 0, 255, 0 );
                        g = __core.parse.value( match[3], 0, 255, 0 );
                        b = __core.parse.value( match[4], 0, 255, 0 );
                        a = __core.parse.value( match[6], 0, 1, 1, true );

                        __color.type = type;
                        __color.value = __core.utils.strcolor( type, [ r, g, b, a ] );
                        __color.data = [ type, r, g, b, a ];
                        __color.hsb.values = __core.convert.rgbhsb( [ r, g, b ] );
                        __color.alpha = a;
                        return true;

                    }

                }
                return false;

            },

        },

        convert: {

            hexrgb: function( x ){

                if( !utils.isString( x ) || x.length !== 6 ){
                    return null;

                }

                return [
                parseInt( x.substring( 0, 2 ), 16 ),
                parseInt( x.substring( 2, 4 ), 16 ),
                parseInt( x.substring( 4, 6 ), 16 )
                ];

            },

            rgbhex: function( x ){
                var s;

                if( !utils.isArray( x, 3 ) ){
                    return '';

                }
                s = +x[2] | ( +x[1] << 8 ) | ( +x[0] << 16 );
                s = '000000' + s.toString( 16 );
                return s.slice( -6 );

            },

            rgbhsb: function( x ){
                const r = +x[0];
                const g = +x[1];
                const b = +x[2];
                const max = Math.max( r, g, b );
                const min = Math.min( r, g, b );
                const d = max - min;
                const s = ( max === 0 ? 0 : d / max );
                const v = max / 255;
                var h;

                switch ( max ){
                    case min:
                    h = 0;
                    break;

                    case r:
                    h = ( g - b ) + d * ( g < b ? 6 : 0 );
                    h /= 6 * d;
                    break;

                    case g:
                    h = ( b - r ) + d * 2;
                    h /= 6 * d;
                    break;

                    case b:
                    h = ( r - g ) + d * 4;
                    h /= 6 * d;
                    break;

                }
                return [h, s, v];

            },

            hsbrgb: function( x ){
                var r, g, b;
                const h = +x[0];
                const s = +x[1];
                const v = +x[2];
                var i = Math.floor( h * 6 );
                const f = h * 6 - i;
                const p = v * ( 1 - s );
                var q = v * ( 1 - f * s );
                var t = v * ( 1 - ( 1 - f ) * s );

                r = g = b = 0;

                i = i || 0;
                q = q || 0;
                t = t || 0;

                switch ( i % 6 ){
                    case 0:
                    r = v, g = t, b = p;
                    break;

                    case 1:
                    r = q, g = v, b = p;
                    break;

                    case 2:
                    r = p, g = v, b = t;
                    break;

                    case 3:
                    r = p, g = q, b = v;
                    break;

                    case 4:
                    r = t, g = p, b = v;
                    break;

                    case 5:
                    r = v, g = p, b = q;
                    break;

                }
                return [ __core.utils.round(r * 255), __core.utils.round(g * 255), __core.utils.round(b * 255) ];

            },

            hexhsb: function( x ){
                return __core.convert.rgbhsb( __core.convert.hexrgb( x ) );

            },

            hsbhex: function( x ){
                return __core.convert.rgbhex( __core.convert.hsbrgb( x ) );

            }

        },

        utils: {

            round: function( x ){

                return Math.round( x );

            },

            strcolor: function( type, x ){

                switch( type ){
                    case '#':
                    case 'hex':
                    return utils.isString( x ) ? ( x.charAt(0) !== '#' ? '#' + x : x ) : '';

                    case 'rgb':
                    return utils.isArray( x, 3 ) ? 'rgb(' + x[0] + ',' + x[1] + ',' + x[2] + ')' : '';

                    case 'rgba':
                    return utils.isArray( x, 4 ) ? 'rgba(' + x[0] + ',' + x[1] + ',' + x[2] + ',' + x[3] + ')' : '';

                    case 'hsl':
                    return utils.isArray( x, 3 ) ? 'hsl(' + x[0] + ',' + x[1] + ',' + x[2] + ')' : '';

                    case 'hsla':
                    return utils.isArray( x, 4 ) ? 'hsla(' + x[0] + ',' + x[1] + ',' + x[2] + ',' + x[3] + ')' : '';

                    default:
                    return '';

                }

            },

            searchCP: function( current ){

                if( !node( current ).isNode() || __picker.node === false ){
                    return false;

                }

                if( __picker.node !== current ){
                    return __core.utils.searchCP( current.parentNode );

                }
                return current;

            }

        },

        actions: {


            saturation: function( selector, data ){

                if( !node( selector ).isNode() ){
                    return;

                }

                node( selector ).on( 'mousemove mousedown click', function( ev, ui ){
                    const type = ev.type;
                    var color = '';
                    var dt, _sat, dx, dy, x, y, rec, width, height, dw, s, b, px, py, dw2;

                    ev.preventDefault();
                    ev.stopPropagation();

                    if( type === 'mousedown' && type !== 'click' ){
                        __picker.isDragging = true;

                    }

                    if( ( type !== 'mousemove' || !__picker.isDragging ) && type !== 'click' ){
                        return;

                    }

                    if( !( _sat = node( ui ) ) || !( width = _sat.width() ) || !( height = _sat.height() ) ){
                        return;

                    }

                    if( !( x = ( rec = ui.getBoundingClientRect() ).left ) || !( y = rec.top ) ){
                        return;

                    }
                    px = utils.isNumber( px = parseInt( ev.pageX - x ) ) && px > 0 ? px : 0;
                    py = utils.isNumber( py = parseInt( ev.pageY - y ) ) && py > 0 ? py : 0;
                    dw = ( dw = node( data.dragger ).width() ) > 0 ? dw : 0;
                    dw2 = dw / 2;

                    dx = px - dw2;
                    dy = py - dw2;

                    dx = dx > ( width - dw2 ) ? width - dw2 : ( dx < 0 ? -dw2 : dx );
                    dy = dy > ( height - ( dw / 2 ) ) ? height - dw2 : ( dy < 0 ? -dw2 : dy );

                    data.dragger.style.left = parseInt( dx ) + 'px';
                    data.dragger.style.top = parseInt( dy ) + 'px';

                    s = px / ( width - 1 );
                    b = 1 - py / ( height - 1 );

                    s = s < 0 ? 0 : ( s > 1 ? 1 : s );
                    b = b < 0 ? 0 : ( b > 1 ? 1 : b );

                    __color.hsb.values[1] = s;
                    __color.hsb.values[2] = b;

                    dt = {
                        render: data.render,
                        source: data.source
                    };

                    if( options.input ){
                        dt.input = data.input;

                    }
                    color = __core.actions.setComponents( dt );

                    if( utils.isFunction( options.onchange ) ){
                        options.onchange( selector, data.source, color );

                    }

                } );

            },

            setPosition: function(){
                var viewerRect, viewerHeight;

                if( !__picker.isset() || !__picker.viewer ){
                    return false;

                }
                viewerHeight = node( __picker.viewer ).height();
                viewerRect = __picker.viewer.getBoundingClientRect();

                if( !utils.isObject( viewerRect ) || !( 'left' in viewerRect ) || !( 'top' in viewerRect ) ){
                    console.log( viewerRect );
                    return false;

                }
                __picker.node.style.left = viewerRect.left + 'px';
                __picker.node.style.top = ( viewerRect.top + viewerHeight ) + 'px';
                return true;

            },

            click: function( ev, ui, data ){
                var color, rec, picker, sat, dragger, wrap, whue, hue, wopacity, opacity, winput, input;

                if( __core.actions.destroy() ){
                    return;

                }
                __core.parse.color( data.source.value );

                rec = ui.getBoundingClientRect();
                picker = _d.createElement( 'div' );
                picker.className = 'comet-colorPicker';
                __picker.isOpen = true;
                __picker.node = picker;

                if( !__core.actions.setPosition() ){
                    __picker.isOpen = false;
                    __picker.node = false;
                    return;

                }
                _d.body.appendChild( picker );

                sat = _d.createElement( 'div' );
                sat.className = 'comet-cpSat';
                picker.appendChild( sat );
                data.sat = sat;

                dragger = _d.createElement( 'button' );
                dragger.className = 'comet-cpDragger';
                sat.appendChild( dragger );
                data.dragger = dragger;

                wrap = _d.createElement( 'div' );
                wrap.className = 'comet-cpContent';
                picker.appendChild( wrap );

                whue = _d.createElement( 'div' );
                whue.className = 'comet-cpwHue';
                wrap.appendChild( whue );

                hue = _d.createElement( 'input' );
                hue.className = 'comet-cpHue';
                hue.type = 'hidden';
                hue.setAttribute( 'min', 0 );
                hue.setAttribute( 'max', 360 );
                hue.setAttribute( 'step', 1 );
                whue.appendChild( hue );
                data.hue = hue;

                if( options.opacity ){

                    wopacity = _d.createElement( 'div' );
                    wopacity.className = 'comet-cpwOpacity';
                    wrap.appendChild( wopacity );

                    opacity = _d.createElement( 'input' );
                    opacity.className = 'comet-cpOpacity';
                    opacity.type = 'hidden';
                    opacity.setAttribute( 'min', 0 );
                    opacity.setAttribute( 'max', 1 );
                    opacity.setAttribute( 'step', 0.01 );
                    wopacity.appendChild( opacity );
                    data.opacity = opacity;

                }

                if( options.input ){

                    winput = _d.createElement( 'div' );
                    winput.className = 'comet-cpwInput';
                    wrap.appendChild( winput );

                    input = _d.createElement( 'input' );
                    input.className = 'comet-cpInput';
                    input.type = 'text';
                    winput.appendChild( input );
                    data.input = input;

                }
                __core.actions.setComponents( data );
                __core.actions.saturation( sat, data );
                __core.actions.hue( hue, data );
                __core.actions.opacity( opacity, data );
                __core.actions.input( input, data );

            },

            hue: function( selector, data ){

                if( !node( selector ).isNode( ) ){
                    return;

                }

                range( selector, {
                    change: function( ev, ui, dt ){
                        const vhue = dt.value / 360;
                        var color = '';
                        __color.hsb.values[0] = vhue;
                        data.hsb = __color.hsb.values;
                        data.sat.style.backgroundColor = __core.utils.strcolor( 'hex', __core.convert.hsbhex( [ vhue, 1, 1 ] ) );
                        color = __core.actions.setComponents( { input: data.input, source: data.source, render: data.render } );

                        if( utils.isFunction( options.onchange ) ){
                            options.onchange( selector, data.source, color );

                        }

                    }
                });

            },

            opacity: function( selector, data ){

                if( !node( selector ).isNode( ) ){
                    return;

                }

                range( selector, {
                    change: function( ev, ui, dt ){
                        const alpha = __core.parse.value( dt.value, 0, 1, 1, true );
                        var color = '';
                        __color.hsb.values[3] = alpha;
                        data.hsb = __color.hsb.values;
                        data.alpha = alpha;
                        color = __core.actions.setComponents( { source: data.source, input: data.input, render: data.render } );

                        if( utils.isFunction( options.onchange ) ){
                            options.onchange( selector, data.source, color );

                        }

                    }
                });

            },

            input: function( selector, data ){

                if( !node( selector ).isNode() ){
                    return;

                }

                node( selector ).on( 'input', function( ev, ui ){
                    const value = ui.value;
                    var color = '';

                    ev.preventDefault();

                    if( !__core.parse.color( value ) ){
                        return;

                    }
                    color = __core.actions.setComponents( data );

                    if( utils.isFunction( options.onchange ) ){
                        options.onchange( selector, data.source, color );

                    }

                } );

            },

            clear: function( ev, ui, data ){
                ev.preventDefault();

                data.source.value = '';
                data.render.style.backgroundColor = '';

                if( utils.isFunction( options.onchange ) ){
                    options.onchange( ui, data.source, '' );

                }

            },

            setComponents: function( components ){
                var color, _sat, width, height;

                if( !utils.isObject( components ) ){
                    return;

                }
                color = __color.hsb.toColor();

                if( components.dragger && components.sat ){

                    components.sat.style.backgroundColor = __core.utils.strcolor( 'hex', __core.convert.hsbhex( [ __color.hsb.values[0], 1, 1 ] ) );

                    if( ( _sat = node( components.sat ) ) && ( width = _sat.width() ) && ( height = _sat.height() ) ){
                        components.dragger.style.left = ( __color.hsb.values[1] * ( width - 1 ) ) + 'px';
                        components.dragger.style.top = -( ( __color.hsb.values[2] - 1 ) * ( height - 1 ) ) + 'px';
                    }

                }

                if( components.opacity ){
                    components.opacity.value = __core.parse.value( ( __color.hsb.values[3] || 0 ), 0, 1, 1, true );
                    node( components.opacity ).trigger( 'setValue' );

                }

                if( components.hue ){
                    components.hue.value = __core.parse.value( ( __color.hsb.values[0] || 0 ) * 360, 0, 360 );
                    node( components.hue ).trigger( 'setValue' );

                }

                if( components.input ){
                    components.input.value = color;

                }

                if( components.source ){
                    components.source.value = color;

                }

                if( components.render ){
                    components.render.style.backgroundColor = color;

                }
                return color;

            },

            destroy: function(){

                if( __picker.isset() ){
                    __picker.node.parentNode.removeChild( __picker.node );
                    __picker.isOpen = false;
                    __picker.node = false;
                    return true;

                }
                return false;

            },

            create: function(){
                const data = {};
                var render, clear;

                __core.parse.color( source.value );

                if( options.clear ){
                    clear = _d.createElement( 'button' );
                    clear.className = 'comet-cpClear';
                    source.parentNode.appendChild( clear );
                    //node( clear ).on( 'click', __core.actions.clear, data );

                }
                render = _d.createElement( 'button' );
                render.className = 'comet-cpRender';
                source.parentNode.appendChild( render );
                source.type = 'hidden';
                render.style.backgroundColor = __color.value;

                data.source = source;
                data.render = render;
                data.hsb = __color.hsb.values;
                data.alpha = __color.alpha;

                node( render ).on( 'click', __core.actions.click, data );
                __picker.viewer = render;

                if( options.clear ){
                    node( clear ).on( 'click', __core.actions.clear, data );

                }

            }

        }

    };

    if( !node( source ).isNode() || source.parentNode === null ){
        return;

    }

    if( !utils.isObject( options ) ){
        options = {};

    }
    __core.actions.create();

    node( _d.documentElement ).on( 'mouseup', function( ev ){

        if( __picker.isDragging ){
            __picker.isDragging = false;
            return;

        }

        if( __picker.isOpen && !__core.utils.searchCP( ev.target ) ){
            __picker.isDragging = false;
            __core.actions.destroy();

        }

    });

    window.addEventListener( 'scroll', __core.actions.setPosition, true );

}