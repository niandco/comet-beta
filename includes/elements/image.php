<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class image extends Comet_Element {

    public function __construct(){

        $this->set_element( 'image', __( 'Image', 'comet'), 'cico-image' );

    }

    public function render( $data ){

        $edata = is_array( $data['el'] ) ? $data['el'] : [];
        $link = isset( $edata['link'] ) && is_string( $edata['link'] ) ? esc_url( trim( strip_tags( $edata['link'] ) ) ) : '';
        $tag = $link === '' ? 'div' : 'a';
        $classes = 'cpb-image cpb-wrapper ' . Comet_Utils::get_alignment( isset( $edata['alg'] ) ? $edata['alg'] : 'c' );

        $output = "<div class=\"{$classes}\">";
        $output .= "<{$tag} class=\"cpb-image cpb-inner\"" . ( $tag === 'a' ? " href=\"{$link}\"" . ( Comet_Utils::is_enabled( $edata['tar'] ) ? ' target="_blank"' : '' ) : '' ) . ">";

        if( isset( $edata['img'] ) ){
            $output .= Comet_Utils::get_image( $edata['img'], isset( $edata['alt'] ) ? $edata['alt'] : '' );

        }

        if( isset( $edata['cap'] ) && is_string( $edata['cap'] ) ){
            $aside = strip_tags( $edata['cap'] );
            $output .= "<aside class=\"cpb-caption\">{$aside}</aside>";

        }
        $output .= "</{$tag}>";
        $output .= '</div>';
        return $output;

    }

    public function view(){
    	?>
    	const content = ui.firstChild;
    	const image = toolkit.html.image({
        	src: data.el.img,
        	alt: data.el.alt,
        	auto: true
        });
    	var tag = 'div';
        var wrapper = false;
        var inner = false;
        var link, aside, classes;

        if( !image ){
        	content.innerHTML = toolkit.html.placeholder( 'image' );
        	return;

        }
        link = toolkit.utils.isString( data.el.link ) ? toolkit.utils.trim( toolkit.utils.stripTags( data.el.link ) ) : '';
        tag = link !== '' ? 'a' : 'div';
        classes = 'cpb-image cpb-wrapper';
        classes += ' ' + toolkit.sanitize.alignment( data.el.alg );
        wrapper = document.createElement( 'div' );
        wrapper.className = classes;
        content.appendChild( wrapper );

        inner = document.createElement( tag );
        inner.className = 'cpb-image cpb-inner';

        if( tag === 'a' ){
        	inner.href = toolkit.utils.escUrl( link );

        	if( [ 'true', '1', 1, true ].indexOf( data.el.tar ) > -1 ){
        		inner.target = '_blank';

        	}

        }
        inner.appendChild( image );


        if( toolkit.utils.isString( data.el.cap ) ){
        	aside = document.createElement( 'aside' );
        	aside.className = 'cpb-caption';
        	aside.innerHTML = toolkit.utils.stripTags( data.el.cap );
        	inner.appendChild( aside );

        }
        wrapper.appendChild( inner );
        <?php

    }

    public function css(){
    	?>
        var css = '';
    	var o, tmp;

    	if( ( tmp = toolkit.sanitize.color( data.el.tc ) ) !== '' ){
    		css += toolkit.css.render( 'color', tmp );

    	}

    	if( ( tmp = toolkit.sanitize.number({ value: data.el.tsi, min: 10, max: 50 }) ) !== null ){
    		css += toolkit.css.render( 'font-size', tmp + 'px' );

    	}
        o = toolkit.css.element( id, '.cpb-image .cpb-caption', css );

    	if( ( tmp = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-image.cpb-wrapper', tmp );

    	}

    	css = toolkit.css.border({
    		color: data.el.bc,
            style: 'solid',
            top: data.el.brt,
            right: data.el.brr,
            bottom: data.el.brb,
            left: data.el.brl,

        });

        if( ( tmp =  toolkit.sanitize.color( data.el.bg ) ) !== '' ){
        	css += toolkit.css.render( 'background', tmp );

        }
        css += toolkit.css.borderRadius( data.el.rdt, data.el.rdr, data.el.rdb, data.el.rdl );
    	css += toolkit.css.padding( data.el.pdt, data.el.pdr, data.el.pdb, data.el.pdl, 'px', 'px' );

        o += toolkit.css.element( id, '.cpb-image.cpb-inner', css );

        if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-image.cpb-wrapper', tmp, 't' );
        	o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-image.cpb-wrapper', tmp ) );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-image.cpb-wrapper', tmp, 'm' );
        	o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-image.cpb-wrapper', tmp ) );

        }
        return o;
        <?php
        
    }

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'image', __( 'Image', 'comet' ) );

        $this->register_field( $tid, $sid, 'img', [
            'label'  => __( 'Image', 'comet' ),
            'type'   => 'image',
            'std'    => '',
        ] );

		$this->register_field( $tid, $sid, 'cap', [
            'label'  => __( 'Caption', 'comet' ),
            'type'   => 'text'
        ] );

		$this->register_field( $tid, $sid, 'alt', [
            'label'  => __( 'Alternative text', 'comet' ),
            'desc'   => __( 'Specify an alternate text for the image, if it cannot be displayed.', 'comet' ),
            'type'   => 'text'
        ] );

		$this->register_field( $tid, $sid, 'alg', [
            'label'  => __( 'Alignment', 'comet' ),
            'type'   => 'radio',
            'std'    => 'c',
            'values' => [
                'l'   => [
                    'title' => __( 'Left', 'comet' ),
                    'icon' => 'cico cico-align-left'
                ],
                'c' => [
                    'title' => __( 'Center', 'comet' ),
                    'icon' => 'cico cico-align-center'
                ],
                'r'  => [
                    'title' => __( 'Right', 'comet' ),
                    'icon' => 'cico cico-align-right'
                ]
            ]
        ] );

		$sid = $this->register_section( $tid, 'link', __( 'Link', 'comet' ) );

		$this->register_field( $tid, $sid, 'link', [
            'label'  => __( 'Link', 'comet' ),
            'type'   => 'text',
            'std'    => ''
        ] );

		$this->register_field( $tid, $sid, 'tar', [
            'label'  => __( 'Open in a new tab', 'comet' ),
            'type'   => 'checkbox',
            'std'    => 'true'
        ] );

		$tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

		$sid = $this->register_section( $tid, 'caption', __( 'Caption', 'comet' ) );

		$this->register_field( $tid, $sid, 'tc', [
            'label' => __( 'Color', 'comet' ),
            'type'  => 'color'
        ] );

		$this->register_field( $tid, $sid, 'tsi', [
            'label' => __( 'Size', 'comet' ),
            'type'   => 'range',
            'std'    => '12',
            'min'    => '10',
            'max'    => '50',
            'unit'   => 'px'
        ] );

		$sid = $this->register_section( $tid, 'background', __( 'Background', 'comet' ) );

		$this->register_field( $tid, $sid, 'bg', [
            'label' => __( 'Color', 'comet' ),
            'type'  => 'color'
        ] );

		$sid = $this->register_section( $tid, 'border', __( 'Border', 'comet' ) );

		$this->register_field( $tid, $sid, 'bc', [
            'label' => __( 'Color', 'comet' ),
            'type'  => 'color'
        ] );

		$this->register_field( $tid, $sid, 'br', Comet_Utils::numbers( __( 'Border', 'comet' ) ) );

		$this->register_field( $tid, $sid, 'rd', Comet_Utils::numbers( __( 'Radius', 'comet' ) ) );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'pd', Comet_Utils::numbers( __( 'Padding', 'comet' ), '', '0', 'true' ) );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', 'true' ) );

	}

}
?>