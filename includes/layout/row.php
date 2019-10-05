<?php
namespace Comet\Library\Layout;

if( !defined( 'ABSPATH' ) ){
	exit;
	
}
require_once COMET_PATH . 'includes/class-register.php';
use Comet\Library\Comet_Register;

class Row extends Comet_Register {

	public function get_slug(){

		return strtolower( __CLASS__ );

	}

	public function get_name(){

		return __( 'Row', 'comet' );

	}

	public function get_data(){

		if( !is_array( $this->data ) || count( $this->data ) < 1 ){

			$this->_register_settings();


		}
		return $this->data;

	}

	private function _register_settings(){
		require_once 'base.php';
		$base = new Base();
		$this->set_data( $base->get_data() );

		$this->register_field( 0, 5, 'alg', [
			'label'		=> __( 'Align', 'comet' ),
			'type'		=> 'select',
			'std'		=> 's',
			'values'	=> [
				't'	=> __( 'Top', 'comet' ),
				'c'	=> __( 'Center', 'comet' ),
				'b'	=> __( 'Bottom', 'comet' ),
				's'	=> __( 'Stretch (full height)', 'comet' ),
			]
		] );

	}

}
?>