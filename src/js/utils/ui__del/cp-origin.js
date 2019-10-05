import utils from '../utils.js';
import range from './range.js';
import node from '../node.js';

/* global document, window */

export default function( source, options ){

    var dragging = false;

    const hsb_ = [];

    const dColor = {
        type: 'hex',
        value: '#FFFFFF',
        data: [ '#', 'FFFFFF' ],
        hsb: [ 0, 0, 1 ],
        alpha: 1
    };

    const parse = {

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
            var tmp;

            if( !utils.isString( x ) || utils.isEmpty( x ) ){
                return null;

            }

            if( ( tmp = this.rgb_( x ) ) !== null ){
                return tmp;

            }

            if( ( tmp = this.hex( x ) ) !== null ){
                return tmp;

            }
            return null;

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
                    return {
                        type: 'hex',
                        value: toSprint( 'hex', value ),
                        data: [ '#', value ],
                        hsb: convert.hexhsb( value ),
                        alpha: 1
                    };

                }
            }
            return null;

        },

        rgb_: function( x ){
            const regex = /(rgba?)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0?\.\d*)|\d?)\s*)?\)/i;
            var match, type, r, g, b, a;

            if( utils.isString( x ) ){

                if( ( match = x.match( regex ) ) !== null && utils.isString( match[1] ) && ( ( type = match[1].toLowerCase() ) === 'rgba' || type === 'rgb' ) ){

                    r = this.value( match[2], 0, 255, 0 );
                    g = this.value( match[3], 0, 255, 0 );
                    b = this.value( match[4], 0, 255, 0 );
                    a = this.value( match[6], 0, 1, 1, true );

                    return {
                        type: type,
                        value: toSprint( type, [ r, g, b, a ] ),
                        data: [ type, r, g, b, a ],
                        hsb: convert.rgbhsb( [ r, g, b ] ),
                        alpha: a

                    };

                }
            }
            return null;

        },

    };

    const convert = {

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
            return [round(r * 255), round(g * 255), round(b * 255)];

        },

        hexhsb: function( x ){
            return this.rgbhsb( this.hexrgb( x ) );

        },

        hsbhex: function( x ){
            return this.rgbhex( this.hsbrgb( x ) );
            
        },

    };

    const on = {

        saturation: function( selector, data ){

            if( !node( selector ).isNode() ){
                return;

            }

            function saturation( ev, ui ){
                const type = ev.type;
                var color = '';
                var dt, _sat, dx, dy, x, y, rec, width, height, dw, s, b, px, py, dw2;

                ev.preventDefault();
                ev.stopPropagation();

                if( type === 'mousedown' && type !== 'click' ){
                    dragging = true;

                }

                if( ( type !== 'mousemove' || !dragging ) && type !== 'click' ){
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

                hsb_[1] = s;
                hsb_[2] = b;

                dt = {
                    render: data.render,
                    source: data.source
                };

                if( options.input ){
                    dt.input = data.input;

                }
                color = setComponents( dt );

                if( utils.isFunction( options.onchange ) ){
                    options.onchange( selector, data.source, color );

                }

            }

            node( selector ).on( 'mousemove mousedown click', saturation );

        },

        click: function( ev, ui, data ){
            var color, rec, picker, sat, dragger, wrap, whue, hue, wopacity, opacity, winput, input;

            if( close() ){
                return;

            }
            color = ( color = parse.color( data.source.value ) ) === null ? dColor : color;
            hsb_[0] = color.hsb[0];
            hsb_[1] = color.hsb[1];
            hsb_[2] = color.hsb[2];
            hsb_[3] = color.alpha;

            rec = ui.getBoundingClientRect();
            picker = document.createElement( 'div' );
            picker.className = 'comet-colorPicker';
            picker.style.left = rec.left + 'px';
            picker.style.top = ( rec.top + node( ui ).height() ) + 'px';
            document.body.appendChild( picker );

            sat = document.createElement( 'div' );
            sat.className = 'comet-cpSat';
            picker.appendChild( sat );
            data.sat = sat;

            dragger = document.createElement( 'button' );
            dragger.className = 'comet-cpDragger';
            sat.appendChild( dragger );
            data.dragger = dragger;

            wrap = document.createElement( 'div' );
            wrap.className = 'comet-cpContent';
            picker.appendChild( wrap );

            whue = document.createElement( 'div' );
            whue.className = 'comet-cpwHue';
            wrap.appendChild( whue );

            hue = document.createElement( 'input' );
            hue.className = 'comet-cpHue';
            hue.type = 'hidden';
            hue.setAttribute( 'min', 0 );
            hue.setAttribute( 'max', 360 );
            hue.setAttribute( 'step', 1 );
            whue.appendChild( hue );
            data.hue = hue;

            if( options.opacity ){

                wopacity = document.createElement( 'div' );
                wopacity.className = 'comet-cpwOpacity';
                wrap.appendChild( wopacity );

                opacity = document.createElement( 'input' );
                opacity.className = 'comet-cpOpacity';
                opacity.type = 'hidden';
                opacity.setAttribute( 'min', 0 );
                opacity.setAttribute( 'max', 1 );
                opacity.setAttribute( 'step', 0.01 );
                wopacity.appendChild( opacity );
                data.opacity = opacity;

            }

            if( options.input ){

                winput = document.createElement( 'div' );
                winput.className = 'comet-cpwInput';
                wrap.appendChild( winput );

                input = document.createElement( 'input' );
                input.className = 'comet-cpInput';
                input.type = 'text';
                winput.appendChild( input );
                data.input = input;

            }

            setComponents( data );

            on.saturation( sat, data );

            on.hue( hue, data );

            on.opacity( opacity, data );

            on.input( input, data );

        },

        hue: function( selector, data ){

            if( !node( selector ).isNode( ) ){
                return;

            }

            range( selector, {
                change: function( ev, ui, dt ){
                    const vhue = dt.value / 360;
                    var color = '';
                    hsb_[0] = vhue;
                    data.hsb = hsb_;
                    data.sat.style.backgroundColor = toSprint( 'hex', convert.hsbhex( [ vhue, 1, 1 ] ) );
                    color = setComponents( { input: data.input, source: data.source, render: data.render } );

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
                    const alpha = parse.value( dt.value, 0, 1, 1, true );
                    var color = '';
                    hsb_[3] = alpha;
                    data.hsb = hsb_;
                    data.alpha = alpha;
                    color = setComponents( { source: data.source, input: data.input, render: data.render } );

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

            function input( ev, ui ){
                const val = ev.type === 'paste' ? ( ev.clipboardData || window.clipboardData ).getData( 'text' ) : ui.value;
                const value = parse.color( val );
                var color = '';

                ev.preventDefault();

                if( value === null ){
                    ui.value = '';
                    return;

                }
                hsb_[0] = value.hsb[0];
                hsb_[1] = value.hsb[1];
                hsb_[2] = value.hsb[2];
                hsb_[3] = value.alpha;
                color = setComponents( data );

                if( utils.isFunction( options.onchange ) ){
                    options.onchange( selector, data.source, color );

                }

            }
            node( selector ).on( 'change paste cut', input );

        },

        clear: function( ev, ui, data ){
            ev.preventDefault();

            data.source.value = '';
            data.render.style.backgroundColor = '';

            if( utils.isFunction( options.onchange ) ){
                options.onchange( ui, data.source, '' );

            }

        }

    };

    function round( x ){

        return Math.round( x );

    }

    function toSprint( type, x ){

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

    }

    function toColor(){
        var alpha, x;

        if( !utils.isArray( hsb_, 3 ) ){
            return '';

        }
        alpha = utils.isSet( hsb_[3] ) ? parse.value( hsb_[3], 0, 1, 1, true ) : 1;

        if( alpha === 1 ){
            x = convert.hsbhex( [ hsb_[0], hsb_[1], hsb_[2] ] );
            return toSprint( 'hex', x );

        }
        x = convert.hsbrgb( [ hsb_[0], hsb_[1], hsb_[2] ] );
        return toSprint( 'rgba', [ x[0], x[1], x[2], alpha ] );

    }

    function setComponents( components ){
        var color, _sat, width, height;

        if( !utils.isObject( components ) ){
            return;

        }
        color = toColor();

        if( components.dragger && components.sat ){

            components.sat.style.backgroundColor = toSprint( 'hex', convert.hsbhex( [ hsb_[0], 1, 1 ] ) );

            if( ( _sat = node( components.sat ) ) && ( width = _sat.width() ) && ( height = _sat.height() ) ){
                components.dragger.style.left = ( hsb_[1] * ( width - 1 ) ) + 'px';
                components.dragger.style.top = -( ( hsb_[2] - 1 ) * ( height - 1 ) ) + 'px';
            }

        }

        if( components.opacity ){
            components.opacity.value = parse.value( ( hsb_[3] || 0 ), 0, 1, 1, true );
            node( components.opacity ).trigger( 'setValue' );

        }

        if( components.hue ){
            components.hue.value = parse.value( ( hsb_[0] || 0 ) * 360, 0, 360 );
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

    }

    function close(){
        const pickers = document.getElementsByClassName( 'comet-colorPicker' );

        if( pickers.length > 0 ){
            node( pickers ).remove();
            return true;

        }
        return false;

    }

    function create( ui ){
        const data = {};
        var render, color, clear;

        if( !ui.parentNode ){
            return;

        }

        if( options.clear ){
            clear = document.createElement( 'button' );
            clear.className = 'comet-cpClear';
            ui.parentNode.appendChild( clear );
            node( clear ).on( 'click', on.clear, data );

        }
        render = document.createElement( 'button' );
        render.className = 'comet-cpRender';
        ui.parentNode.appendChild( render );
        ui.type = 'hidden';
        color = ( color = parse.color( ui.value ) ) === null ? dColor : color;
        render.style.backgroundColor = color.value;

        data.source = ui;
        data.render = render;
        data.hsb = color.hsb;
        data.alpha = color.alpha;

        node( render ).on( 'click', on.click, data );

        if( options.clear ){
            node( clear ).on( 'click', on.clear, data );

        }

    }

    if( !source ){
        return;

    }

    if( !utils.isObject( options ) ){
        options = {};

    }

    (function(){
        var x, _source, tmp;


        if( ( ( _source = node( source ) ).isNode() ) ){

            create( source );

        }else if( ( utils.isObject( tmp = _source.get() ) || utils.isArray( tmp, 1 ) ) && !_source.isView() ){

            for( x in source ){

                if( !node( source[x] ).isNode() ){
                    continue;

                }
                create( source[x] );
            }

        }else{
            return;

        }

        node( document ).on( 'mouseup', function(){ dragging = false; });
        node( '.comet-modalContent' ).on( 'scroll', close );

    })();

}