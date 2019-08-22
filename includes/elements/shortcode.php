<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class shortcode extends Comet_Element {

	public function __construct(){

		$this->set_element( 'shortcode', __( 'Shortcode', 'comet'), 'cico-shortcode' );

	}

	public function render( $data ){

		$edata =  is_array( $data['el'] ) ? $data['el'] : [];

		return ( isset( $edata['s'] ) && is_string( $edata['s'] ) ?  do_shortcode( stripslashes( trim( $edata['s'] ) ) ) : '' );

	}

	public function view(){

		?>

		const content = ui.firstChild;

		comet.html.renderElement({
			id: id,
			element: 'shortcode',
			data: data

		}, function( response ){

			if( !comet.helpers.isString( response ) ){
				return;

			}
			content.innerHTML = '<div class="cpb-shortcode cpb-wrapper">' + response + '</div>';

		});

		<?php

	}

	public function css(){
		?>
		var o = '';
		var tmp;

		if( ( tmp = comet.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-shortcode.cpb-wrapper', tmp );

		}

		if( ( tmp = comet.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-shortcode.cpb-wrapper', tmp, 't' );
			o += comet.css.responsive( 't', comet.css.element( id, '.cpb-shortcode.cpb-wrapper', tmp ) );

		}

		if( ( tmp = comet.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-shortcode.cpb-wrapper', tmp, 'm' );
			o += comet.css.responsive( 'm', comet.css.element( id, '.cpb-shortcode.cpb-wrapper', tmp ) );

		}
		return o;
		<?php

	}

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'shortcode', __( 'Shortcode', 'comet' ) );

		$this->register_field( $tid, $sid, 's', [
			'label'  => __( 'Shortcode', 'comet' ),
			'type'   => 'textarea',
			'std'   => '[caption id="2812" align="alignright" width="300"]'
		] );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', true ) );


	}

}
?>