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
		const vArray = [ 'true', 'TRUE', 'True' ];
		const url = comet.helpers.isString( data.el.url ) ? ( comet.helpers.stripTags( data.el.url ) ).trim() : '';
		const audio = document.createElement( 'audio' );

		content.appendChild( audio );

		audio.className = 'cpb-audio';
		audio.src = comet.helpers.escUrl( url );
		audio.controls = true;
		audio.preload = 'metadata';

		if( comet.helpers.inArray( vArray, data.el.aut ) ){
			audio.autoplay = true;

		}

		if( comet.helpers.inArray( vArray, data.el.loop ) ){
			audio.loop = true;

		}
		audio.innerHTML = 'Your browser does not support the audio';

		<?php

	}

	public function css(){
		?>
		var o = '';
		var tmp;

		if( ( tmp = comet.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-audio', tmp );

		}

		if( ( tmp = comet.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-audio', tmp, 't' );
			o += comet.css.responsive( 't', comet.css.element( id, '.cpb-audio', tmp ) );

		}

		if( ( tmp = comet.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-audio', tmp, 'm' )
			o += comet.css.responsive( 'm', comet.css.element( id, '.cpb-audio', tmp ) );

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