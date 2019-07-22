<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once COMET_PATH . 'includes/class-register.php';

class Comet_Element extends Comet_Register{

	private $slug = null;

	private $name = 'Undefined';

	private $icon = 'cico-custom';

	private $force_js = false;

	private function sanitize_slug( $slug ){

		return ( is_string( $slug ) ? preg_replace( '/[^a-z_]/i', '', $slug ) : false );

	}

	protected function set_element( $slug, $name, $icon, $force_js = false ){

		if( !( $slug = $this->sanitize_slug( $slug ) ) ){
			return false;

		}
		$this->slug = $slug;
		$this->name = is_string( $name ) ? trim( strip_tags( $name ) ) : __( 'Undefined', 'comet' );
		$this->icon = is_string( $icon ) ? trim( strip_tags( $icon ) ) : 'cico-custom';
		$this->force_js = is_bool( $force_js ) ? $force_js : false; 

	}

	public function force_js(){

		return $this->force_js;
		
	}

	public function get_slug(){

		return $this->slug;

	}

	public function get_name(){

		return $this->name;__( 'Text', 'comet' );

	}

	public function get_icon(){

		return $this->icon; 'cico-text';

	}

	public function get_settings(){

		if( !is_array( $this->data ) || count( $this->data ) < 1 ){

			if( method_exists( $this, '_register_settings') ){
				$this->_register_settings();

			}

			if( method_exists( $this, '_register_item_settings') ){
				$this->_register_item_settings();

			}

		}
		return $this->data;

	}
	
}
?>