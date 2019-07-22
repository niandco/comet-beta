<?php
namespace Comet\Library\Layout;

if( !defined( 'ABSPATH' ) ){
	exit;
	
}
require_once COMET_PATH . 'includes/class-register.php';
use Comet\Library\Comet_Register;

class Column extends Comet_Register {

	public function get_slug(){

		return strtolower( __CLASS__ );

	}

	public function get_name(){

		return __( 'Column', 'comet' );

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

		$this->deregister_field( 0, 5, 'width' );

		$this->deregister_field( 0, 5, 'wsize' );

		$this->register_field( 0, 5, 'wsize', [
			'label'	=> __( 'Width', 'comet' ),
			'type'	=> 'range',
			'min'	=> '10',
			'max'	=> '100',
			'step'	=> '0.01',
			'std'	=> '100',
			'unit'	=> '%'
		] );

	}

}
?>