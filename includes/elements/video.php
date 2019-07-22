<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class video extends Comet_Element{

    public function __construct(){

        $this->set_element( 'video', __( 'Video', 'comet'), 'cico-video', true );

    }

    public function render( $data ){

        return __( 'Loading...', 'comet' );

    }

    public function view(){

        ?>

        const content = ui.firstChild;
        const pos = toolkit.utils.isString( data.el.pos ) ? toolkit.utils.trim( toolkit.utils.stripTags( data.el.pos ) ) : '';
        const ov = ( pos !== '' && data.el.ov === 'p' );
        const aut = ( [ 'true', '1', true, 1 ].indexOf( data.el.aut ) > -1 );
        const inf = ( [ 'true', '1', true, 1 ].indexOf( data.el.inf ) > -1 );
        const w = toolkit.sanitize.number({ value: data.el.wi, min: 200, default: 500 });
        const h = toolkit.sanitize.number({ value: data.el.he, min: 200, default: 400 });
        var url = toolkit.utils.isString( data.el.url ) ? toolkit.utils.trim( toolkit.utils.stripTags( data.el.url ) ) : '';
        var video = false;
        var o, d, a, cover;

        switch( data.el.type ){
            case 'c':

            d = 'preload="metadata"';
            d += aut ? ' autoplay' : '';
            video = '<video class="cpb-video cpb-frame" src="' + toolkit.utils.escUrl( url ) + '" height="' + h + '" width="' + w + '" ' + d + '>';
            video += 'Your browser does not support the video.';
            video += '</video>';
            break;

            case 'v':

            url = 'https://player.vimeo.com/video/' + toolkit.utils.getVideo( url, 'vimeo' );
            url += ov || aut ? '?autoplay=1' : '?autoplay=0';
            url += !inf ? '&title=0&portrait=0&byline=0' : '';
            video = '<iframe class="cpb-video cpb-frame" src="' + toolkit.utils.escUrl( url ) + '" width="' + w + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
            break;

            case 'y':

            url = 'https://www.youtube.com/embed/' + toolkit.utils.getVideo( url, 'youtube' );
            url += '?rel=0';
            url += ov || aut ? '&autoplay=1' : '';
            url += !inf ? '&showinfo=0' : '';
            video = '<iframe class="cpb-video cpb-frame" width="' + w + '" height="' + h + '" src="' + toolkit.utils.escUrl( url ) + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
            break;
            default:
            return;

        }

        if( !video ){
            return;

        }

        if( ov ){
            o = '<div class="cpb-video cpb-player">';
            o += '<a class="cpb-poster" href="#">';
            o += '<button class="cpb-button"><span></span></button>';
            o += '</a>';
            o += '</div>';

            content.innerHTML = o;

            if( ( cover = toolkit.html.image({ src: pos, alt: 'Video poster', auto: true }) ) ){
                content.firstChild.firstChild.appendChild( cover );

            }

            content.firstChild.firstChild.addEventListener( 'click', function( ev ){
                ev.preventDefault();
                const fragment = document.createDocumentFragment();
                const lightbox = document.createElement( 'div' );
                const close = document.createElement( 'button' );

                close.className = 'cpb-close';
                close.innerHTML = 'x';

                lightbox.className = 'cpb-lightbox cpb-wrapper cpb-ui';
                lightbox.innerHTML = '<div class="cpb-inner">' + video + '</div>';

                fragment.appendChild( lightbox );
                lightbox.appendChild( close );

                document.body.appendChild( lightbox );

                close.addEventListener( 'click', function( e ){
                    e.preventDefault();
                    lightbox.parentNode.removeChild( lightbox );

                });


            });

            return;

        }
        content.innerHTML = video;
        <?php

    }

    public function css(){
        ?>
        var o = '';
        var tmp, tmp1, css;

        if( data.el.ov === 'p' ){
            css = '';

            if( ( tmp = toolkit.sanitize.color( data.el.bgc ) ) !== '' ){
                css += toolkit.css.render( 'background', tmp );

            }

            if( ( tmp = toolkit.sanitize.number({ value: data.el.bw, min: 0, max: 6, default: 0 }) ) > 0 && ( tmp1 = toolkit.sanitize.color( data.el.bc ) ) !== '' ){
                css += toolkit.css.render( 'border', tmp + 'px solid ' + tmp1 );

            }
            css += toolkit.css.borderRadius( data.el.brt, data.el.brr, data.el.brb, data.el.brl );
            o += toolkit.css.element( id, '.cpb-video.cpb-player .cpb-button', css );

            if( ( tmp = toolkit.sanitize.color( data.el.ic ) ) !== '' ){
                css = toolkit.css.render( 'border-left', '15px solid ' + tmp );
                o += toolkit.css.element( id, '.cpb-video.cpb-player .cpb-button span', css );

            }

        }

        if( ( tmp = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-video', tmp );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-video', tmp, 't' );
            o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-video', tmp ) );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-video', tmp, 'm' );
            o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-video', tmp ) );

        }
        return o;
        <?php

    }

    protected function _register_settings(){

        $tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

        $sid = $this->register_section( $tid, 'video', __( 'Video', 'comet' ) );

        $this->register_field( $tid, $sid, 'type', [
            'label'  => __( 'Type', 'comet' ),
            'type'   => 'select',
            'std'    => 'y',
            'values' => [
                'y' => __( 'YouTube', 'comet' ),
                'v' => __( 'Vimeo', 'comet' ),
                'c' => __( 'Custom', 'comet' )
            ]
        ] );

        $this->register_field( $tid, $sid, 'url', [
            'label'  => __( 'Video', 'comet' ),
            'desc'   => __( 'Filetypes supported for custom video: "MP4", "WebM" and "Ogg".', 'comet' ),
            'type'   => 'text'
        ] );

        $this->register_field( $tid, $sid, 'wi', [
            'label'  => __( 'Width', 'comet' ),
            'type'   => 'range',
            'min'    => '100',
            'max'    => '4000',
            'std'    => '640',
            'unit'   => 'px'
        ] );

        $this->register_field( $tid, $sid, 'he', [
            'label'  => __( 'Height', 'comet' ),
            'type'   => 'range',
            'min'    => '100',
            'max'    => '4000',
            'std'    => '360',
            'unit'   => 'px'
        ] );

        $sid = $this->register_section( $tid, 'options', __( 'Options', 'comet' ) );

        $this->register_field( $tid, $sid, 'aut', [
            'label'    => __( 'Autoplay', 'comet' ),
            'type'     => 'checkbox',
            'std'      => 'false'
        ] );

        $this->register_field( $tid, $sid, 'inf', [
            'label'    => __( 'Show informations', 'comet' ),
            'type'     => 'checkbox',
            'std'      => 'true'
        ] );

        $this->register_field( $tid, $sid, 'ov', [
            'label'    => __( 'Play in lightbox', 'comet' ),
            'type'     => 'checkbox',
            'std'      => 'true',
            'switch'   => [
                //'n'   => [ 'aut' ],
                'true'   => [ 'pos', 'ic', 'bgc', 'bc', 'bw', 'br' ]
            ]
        ] );

        $this->register_field( $tid, $sid, 'pos', [
            'label' =>  __( 'Poster', 'comet' ),
            'type'  => 'image'
        ] );

        $tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

        $sid = $this->register_section( $tid, 'button', __( 'Button', 'comet' ) );

        $this->register_field( $tid, $sid, 'ic', [
            'label'  => __( 'Color', 'comet' ),
            'type'   => 'color'
        ] );

        $this->register_field( $tid, $sid, 'bgc', [
            'label'  => __( 'Background color', 'comet' ),
            'type'   => 'color'
        ] );

        $this->register_field( $tid, $sid, 'bc', [
            'label'  => __( 'Border color', 'comet' ),
            'type'   => 'color'
        ] );

        $this->register_field( $tid, $sid, 'bw', [
            'label'  => __( 'Border width', 'comet' ),
            'type'   => 'range',
            'min'    => '0',
            'max'    => '5',
            'std'    => '0',
            'unit'   => 'px'
        ] );

        $this->register_field( $tid, $sid, 'br', Comet_Utils::numbers( __( 'Border radius', 'comet' ), '', '0', false ) );

        $sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

        $this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', true ) );

    }

}
?>