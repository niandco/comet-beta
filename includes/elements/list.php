<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class listItems extends Comet_Element {

    public function __construct(){

        $this->set_element( 'list', __( 'List', 'comet'), 'cico-list' );

    }

    public function render( $data ){

        $edata = is_array( $data['el'] ) ? $data['el'] : [];
        $classes = 'cpb-list cpb-wrapper';

        if( isset( $edata['sty'] ) && is_string( $edata['sty'] ) && ( $tmp = trim( $edata['sty'] ) ) !== 'none' ){
            $classes .= " cpb-list{$tmp}";

        }
        $output = "<ul class=\"{$classes}\">";

        $output .= Comet_Utils::foreach_item( $data, function( $iid, $idata ){
            $idata = is_array( $idata ) ? $idata : [];
            $iclasses = "cpb-item cpb-inner cpb-item{$iid} " . Comet_Utils::get_alignment( isset( $idata['alg'] ) ? $idata['alg'] : 't' );
            $icontent = isset( $idata['ctnt'] ) && is_string( $idata['ctnt'] ) ? $idata['ctnt'] : '';

            return "<li class=\"{$iclasses}\">{$icontent}</li>";

        });
        $output .= '</ul>';

        return $output;

    }

    public function view(){

        ?>

        const content = ui.firstChild;
        var classes = 'cpb-list cpb-wrapper';
        var o = '';
        var tmp;

        if( !toolkit.utils.isStringEmpty( data.el.sty ) && ( tmp = toolkit.utils.trim( data.el.sty ) ) !== 'none' ){
            classes += ' cpb-list' + tmp;

        }
        o = '<ul class="' + classes + '">';
        o += toolkit.utils.foreachItem( data, function( iid, idata ){
            var iclasses = 'cpb-item cpb-inner';
            iclasses += ' cpb-item' + iid;
            iclasses += ' ' + toolkit.sanitize.alignment( idata.alg );

            return '<li class="' + iclasses + '">' + ( toolkit.utils.isString( idata.ctnt ) ? idata.ctnt : '' ) + '</li>';

        });
        o += '</ul>';
        content.innerHTML = o;

        <?php

    }

    public function css(){
        ?>
        var o = '';
        var spa, ti, sty, tmp, css;

        sty = !toolkit.utils.isStringEmpty( data.el.sty ) ? toolkit.utils.trim( data.el.sty ) : 'none';
        spa = toolkit.sanitize.number({ value: data.el.spa, min: 0, max: 200 });
        ti = toolkit.sanitize.number({ value: data.el.ti, min: 0, max: 200 });

        if( ( tmp = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-list.cpb-wrapper', tmp );

        }
        css = '';

        if( ( tmp = toolkit.sanitize.number({ value: data.el.fs, min: 10, max: 100 } ) ) !== null ){
            css += toolkit.css.render( 'font-size', tmp + 'px' );

        }

        if( ( tmp = toolkit.sanitize.color( data.el.tc ) ) !== '' ){
            css += toolkit.css.render( 'color', tmp );

        }

        if( spa !== null && ti !== null && ( spa > 0 || ti > 0 ) ){
            css += toolkit.css.padding( spa, 0, spa, ti, 'px', 'px' );

        }
        o += toolkit.css.element( id, '.cpb-item.cpb-inner', css );

        o += toolkit.utils.foreachItem( data, function( iid, idata ){
            var io = '';
            var img, icss;

            if( sty === 'img' ){
                img = toolkit.utils.isString( idata.ico ) ? toolkit.utils.trim( toolkit.utils.stripTags( idata.ico ) ) : '';

                if( img !== '' ){
                    icss = toolkit.css.render( 'background-image', 'url(' + toolkit.utils.escUrl( img ) + ')' );
                    io = toolkit.css.element( id, '.cpb-inner.cpb-item' + iid, icss );

                }

            }
            return io; 

        });

        if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-list.cpb-wrapper', tmp, 't' );
            o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-list.cpb-wrapper', tmp ) );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-list.cpb-wrapper', tmp, 'm' );
            o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-list.cpb-wrapper', tmp ) );

        }
        return o;
        <?php

    }

    protected function _register_item_settings(){

        $tid = $this->register_tab( 'general', __( 'General', 'comet' ), true );

        $sid = $this->register_section( $tid, 'item', __( 'Item', 'comet' ), true );

        $this->register_field( $tid, $sid, 'ico', [
            'label'  => __( 'Icon', 'comet' ),
            'type'   => 'image',
        ], true );

        $this->register_field( $tid, $sid, 'alg', [
            'label'  => __( 'Vertical alignment', 'comet' ),
            'type'   => 'select',
            'std'    => 't',
            'values' => [
                't' => __( 'Top', 'comet' ),
                'm' => __( 'Middle', 'comet' ),
                'b' => __( 'Bottom', 'comet' )
            ]
        ], true );

        $this->register_field( $tid, $sid, 'ctnt', [
            'label'  => __( 'Text', 'comet' ),
            'type'   => 'editor'
        ], true );

        $this->push_items( __( 'Items', 'comet' ) );

    }

    protected function _register_settings(){

        $tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

        $sid = $this->register_section( $tid, 'list', __( 'List', 'comet' ) );

        $this->register_field( $tid, $sid, 'sty', [
            'label'  => __( 'Style', 'comet' ),
            'type'   => 'select',
            'std'    => 'none',
            'values' => Comet_Utils::listStyle()
        ] );

        $this->register_field( $tid, $sid, 'spa', [
            'label'  => __( 'Gap', 'comet' ),
            'desc'   => __( 'Define the gap between items.', 'comet'),
            'type'   => 'range',
            'min'    => '0',
            'max'    => '200',
            'std'    => '0',
            'unit'   => 'px'
        ] );

        $this->register_field( $tid, $sid, 'ti', [
            'label'  => __( 'Text indent', 'comet' ),
            'type'   => 'range',
            'min'    => '0',
            'max'    => '200',
            'std'    => '0',
            'unit'   => 'px'
        ] );

        $sid = $this->register_section( $tid, 'text', __( 'Text', 'comet' ) );

        $this->register_field( $tid, $sid, 'fs', [
            'label'  => __( 'Size', 'comet' ),
            'type'   => 'range',
            'min'    => '10',
            'max'    => '100',
            'std'    => '15',
            'unit'   => 'px'
        ] );

        $this->register_field( $tid, $sid, 'tc', [
            'label'  => __( 'Color', 'comet' ),
            'type'   => 'color'
        ] );

        $sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

        $this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', 'true' ) );

    }

}
?>