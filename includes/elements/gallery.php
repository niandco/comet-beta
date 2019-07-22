<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class gallery extends Comet_Element {

    public function __construct(){

        $this->set_element( 'gallery', __( 'Gallery', 'comet'), 'cico-gallery', true );

    }

    public function render( $data ){

        return __( 'Loading...', 'comet' );

    }

    public function view(){

        ?>

        const content = ui.firstChild;
        const an = [ 'n', 'r', 'b' ].indexOf( data.el.an ) > -1 ? data.el.an : 'z';
        const ty = [ 'o', 'c' ].indexOf( data.el.ty ) > -1 ? data.el.ty : 'm';
        const cap = ( [ 'c', 'true', true, 1, '1' ].indexOf( data.el.oh ) > -1 );
        const wrapper = document.createElement( 'div' );
        const columns = toolkit.sanitize.number({ value: data.el.col, min: ( ty === 'o' ? 3 : 1 ), max: 5, default: 3 });
        var i = 0;
        var state = 1;
        var classes;

        classes = 'cpb-gallery cpb-wrapper';
        classes += ' cpb-st' + ( ty === 'o' ? 'offset' : ( ty === 'c' ? 'carousel' : 'masonry' ) );

        if( ty === 'm' || ty === 'o' ){
            classes += ' cpb-col' + columns;

        }
        if( an !== 'n' ){
            classes += ' cpb-an' + ( an === 'r' ? 'rotate' : ( an === 'b' ? 'blur' : 'zoom' ) );

        }
        wrapper.className = classes;
        content.appendChild( wrapper );

        toolkit.utils.foreachItem( data, function( iid, idata ){
            const img = toolkit.html.image({
                src: idata.img,
                alt: idata.alt,
                auto: true
            });
            var item, hr, a;

            if( !img ){
                return '';

            }
            item = document.createElement( 'div' );
            item.className = 'cpb-item cpb-wrapper';
            item.innerHTML = '<div></div>';
            item.firstChild.appendChild( img );

            a = document.createElement( 'a' );
            a.className = 'cpb-aside';
            a.href = toolkit.utils.escUrl( idata.img );

            if( toolkit.utils.isString( idata.ath ) ){
                a.dataset.author = toolkit.utils.trim( toolkit.utils.stripTags( idata.ath ) );

            }

            if( cap && toolkit.utils.isString( idata.cap ) ){
                a.innerHTML = '<span class="cpb-caption">' + toolkit.utils.stripTags( idata.cap ) + '</span>';

            }
            item.firstChild.appendChild( a );
            wrapper.appendChild( item );

            if( state === 1 && i === ( columns - 2 ) ){
                hr = document.createElement( 'div' );
                hr.className = 'cpb-hr';
                wrapper.appendChild( hr );
                state = 2;
                i = 0;

            }else if( state === 2 && i === ( columns - 1 ) ){
                hr = document.createElement( 'div' );
                hr.className = 'cpb-hr';
                wrapper.appendChild( hr );
                state = 1;
                i = 0;

            }else{
                i++;

            }

        });

        <?php
        
    }

    public function css(){
        ?>
        const gap = toolkit.sanitize.number({ value: data.el.pd, min: 0, max: 50, default: 0 });
        const ty = [ 'c', 'o' ].indexOf( data.el.ty ) > -1 ? data.el.ty : 'm';
        var css = '';
        var o, tmp;

        if( ( tmp = toolkit.sanitize.color( data.el.bg ) ) !== '' ){
            css += toolkit.css.render( 'background', tmp );

        }

        if( ( tmp = toolkit.sanitize.color( data.el.tc ) ) !== '' ){
            css += toolkit.css.render( 'color', tmp );

        }

        if( ( tmp = toolkit.sanitize.number({ value: data.el.cps, min: 10, max: 50 }) ) !== null ){
            css += toolkit.css.render( 'font-size', tmp + 'px' );

        }
        o = toolkit.css.element( id, '.cpb-gallery .cpb-aside', css );

        if( ty === 'c' || ty === 'o' ){
            tmp = toolkit.sanitize.number({ value: data.el.hei, min: 100, max: 1000, default: 200 });
            css = toolkit.css.render( 'height', tmp + 'px ' );
            o += toolkit.css.element( id, '.cpb-gallery .cpb-item', css );

        }
        css = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' );

        if( ty === 'm' ){
            tmp = toolkit.sanitize.number({ value: data.el.pd, min: 0 });
            css += toolkit.css.render( 'column-gap', toolkit.sanitize.valueUnit( tmp, 'px' ) );

        }
        o += toolkit.css.element( id, '.cpb-gallery.cpb-wrapper', css );

        if( ty === 'o' ){
            tmp = toolkit.sanitize.number({ value: data.el.pd, min: 0 });
            css = toolkit.css.render( 'padding', toolkit.sanitize.valueUnit( tmp, '%' ) );
            o += toolkit.css.element( id, '.cpb-gallery.cpb-wrapper .cpb-item', css );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-gallery.cpb-wrapper', tmp, 't' );
            o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-gallery.cpb-wrapper', tmp ) );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-gallery.cpb-wrapper', tmp, 'm' );
            o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-gallery.cpb-wrapper', tmp ) );

        }
        return o;
        <?php

    }

    protected function _register_item_settings(){

        $tid = $this->register_tab( 'general', __( 'General', 'comet' ), true );

        $sid = $this->register_section( $tid, 'image', __( 'Image', 'comet' ), true );

        $this->register_field( $tid, $sid, 'img', [
            'label'  => __( 'Image', 'comet' ),
            'type'   => 'image'
        ], true );

        $this->register_field( $tid, $sid, 'alt', [
            'label'  => __( 'Alternative text', 'comet' ),
            'desc'   => __( 'Specify an alternate text for the image, if it cannot be displayed.', 'comet' ),
            'type'   => 'text'
        ], true );

        $this->register_field( $tid, $sid, 'cap', [
            'label'  => __( 'Caption', 'comet' ),
            'type'   => 'text'
        ], true );

        $this->register_field( $tid, $sid, 'ath', [
            'label'  => __( 'Author', 'comet' ),
            'type'   => 'text'
        ], true );

        $this->push_items( __( 'Images', 'comet' ) );
    }

    protected function _register_settings(){

        $tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

        $sid = $this->register_section( $tid, 'gallery', __( 'Gallery', 'comet' ) );

        $this->register_field( $tid, $sid, 'ty', [
            'label'    => __( 'Type', 'comet' ),
            'type'     => 'select',
            'std'      => 'm',
            'switch'   => [
                'o'     => [ 'hei' ]
            ],
            'values' => [
                'm' => __( 'Masonry', 'comet' ),
                'o' => __( 'Offset', 'comet' )
            ]
        ] );

        $this->register_field( $tid, $sid, 'col', [
            'label'  => __( 'Column count', 'comet' ),
            'type'   => 'select',
            'std'    => '3',
            'values' => Comet_Utils::grid( 5 )
        ] );

        $this->register_field( $tid, $sid, 'pd', [
            'label'  => __( 'Gap', 'comet' ),
            'type'   => 'range',
            'min'    => '0',
            'max'    => '30',
            'std'    => '0',
            'unit'   => '%'
        ] );

        $this->register_field( $tid, $sid, 'hei', [
            'label'   => __( 'Height', 'comet' ),
            'type'    => 'range',
            'min'     => '100',
            'max'     => '1000',
            'std'     => '200',
            'step'    => '1',
            'unit'    => 'px',
            'hidden'  => true
        ] );

        /*$this->register_field( $tid, $sid, 'lb', [
            'label' => __( 'Open in a lightbox', 'comet' ),
            'type'  => 'checkbox',
            'std'   => 'true'
        ] );*/

        $this->register_field( $tid, $sid, 'oh', [
            'label'  => __( 'Caption on hover', 'comet' ),
            'type'   => 'checkbox',
            'std'    => 'false'
        ] );

        $this->register_field( $tid, $sid, 'an', [
            'label'  => __( 'Animation', 'comet' ),
            'type'   => 'select',
            'std'    => 'z',
            'values' => [
                'n'  => __( 'None', 'comet' ),
                'z'  => __( 'Zoom', 'comet' ),
                'r'  => __( 'Rotate', 'comet' ),
                'b'  => __( 'Blur', 'comet' )
            ]
        ] );

        $tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

        $sid = $this->register_section( $tid, 'caption', __( 'Caption', 'comet' ) );

        $this->register_field( $tid, $sid, 'cps', [
            'label'  => __( 'Size', 'comet' ),
            'type'   => 'range',
            'min'    => '10',
            'max'    => '50',
            'std'    => '15',
            'unit'   => 'px'
        ] );

        $this->register_field( $tid, $sid, 'tc', [
            'label' => __( 'Color', 'comet' ),
            'type'  => 'color'
        ] );

        $this->register_field( $tid, $sid, 'bg', [
            'label' => __( 'Background', 'comet' ),
            'type'  => 'color'
        ] );

        $sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

        $this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', true ) );

    }

}
?>