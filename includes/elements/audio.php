<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class audio extends Comet_Element {

    public function __construct(){

        $this->set_element( 'audio', __( 'Audio', 'comet'), 'cico-audio' );

    }

    public function render( $data ){

        $edata = is_array( $data['el'] ) ? $data['el'] : [];
        $src = isset( $edata['url'] ) && is_string( $edata['url'] ) ? esc_url( trim( strip_tags( $edata['url'] ) ) ) : '';

        $loop = isset( $edata['loop'] ) && Comet_Utils::is_enabled( $edata['loop'] ) ? ' loop="true"' : '';
        $autoplay = isset( $edata['aut'] ) && Comet_Utils::is_enabled( $edata['aut'] ) ? ' autoplay="true"' : '';

        $output = "<audio class=\"cpb-audio\" src=\"{$src}\" preload=\"metadata\" controls=\"true\"{$loop}{$autoplay}>";
        $output .= __( 'Your browser does not support audio', 'comet' );
        $output .= '</audio>';

        return $output;

    }

    public function view(){

        ?>
        
        const content = ui.firstChild;
        const vArray = [ 'true', true, 1 ];
        const url = toolkit.utils.isString( data.el.url ) ? toolkit.utils.trim( toolkit.utils.stripTags( data.el.url ) ) : '';
        const audio = document.createElement( 'audio' );

        content.appendChild( audio );

        audio.className = 'cpb-audio';
        audio.src = toolkit.utils.escUrl( url );
        audio.controls = true;
        audio.preload = 'metadata';

        if( vArray.indexOf( data.el.aut ) > -1 ){
            audio.autoplay = true;

        }

        if( vArray.indexOf( data.el.loop ) > -1 ){
            audio.loop = true;
            
        }
        audio.innerHTML = 'Your browser does not support the audio';

        <?php

    }

    public function css(){
        ?>
        var o = '';
        var tmp;

        if( ( tmp = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-audio', tmp );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-audio', tmp, 't' );
            o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-audio', tmp ) );

        }

        if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-audio', tmp, 'm' )
            o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-audio', tmp ) );

        }
        return o;
        <?php

    }

    protected function _register_settings(){

        $tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

        $sid = $this->register_section( $tid, 'audio', __( 'Audio', 'comet' ) );

        $this->register_field( $tid, $sid, 'url', [
            'label'     => __( 'Audio', 'comet' ),
            'desc'      => __( 'Filetypes supported: "MP3", "Wav" and "Ogg".', 'comet' ),
            'type'      => 'text'
        ] );

        $this->register_field( $tid, $sid, 'aut', [
            'label'     =>__( 'Autoplay', 'comet' ),
            'type'      => 'checkbox',
            'std'       => 'false'
        ] );
        
        $this->register_field( $tid, $sid, 'loop', [
            'label'     => __( 'Loop', 'comet' ),
            'type'      => 'checkbox',
            'std'       => 'false'
        ] );

        $sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

        $this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', true ) );

    }

}
?>