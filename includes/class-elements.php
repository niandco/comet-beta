<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Elements {

	private $base_path = COMET_PATH . 'includes/elements/';

	private $parsed = [];

	private $elements = [];

	public function __construct(){

		$path = $this->base_path;

		$this->parse_element( 'text', '\Comet\Library\Elements\text', "{$path}text.php" );
		$this->parse_element( 'image', '\Comet\Library\Elements\image', "{$path}image.php" );
		$this->parse_element( 'icon', '\Comet\Library\Elements\icon', "{$path}icon.php" );
		$this->parse_element( 'button', '\Comet\Library\Elements\button', "{$path}button.php" );
		$this->parse_element( 'list', '\Comet\Library\Elements\listItems',"{$path}list.php" );
		$this->parse_element( 'gallery', '\Comet\Library\Elements\gallery', "{$path}gallery.php" );
		$this->parse_element( 'map', '\Comet\Library\Elements\map', "{$path}map.php" );
		$this->parse_element( 'audio', '\Comet\Library\Elements\audio', "{$path}audio.php" );
		$this->parse_element( 'video', '\Comet\Library\Elements\video', "{$path}video.php" );
		$this->parse_element( 'shortcode', '\Comet\Library\Elements\shortcode', "{$path}shortcode.php" );

		$add = apply_filters( 'comet_register_elements', $this->elements );

		if( is_array( $add ) ){
			return;

		}

		foreach( $add as $slug => $content ){

			if( !is_array( $content ) || !isset( $content['class'] ) || !isset( $content['file'] ) ){
				continue;

			}
			$this->parse_element( $slug, $content['class'], $content['file'] );

		}

	}

	private function sanitize_slug( $slug ){

		return ( is_string( $slug ) ? preg_replace( '/[^a-z_]/i', '', $slug ) : false );

	}

	private function initialize(){

		if( !is_array( $this->parsed ) ){
			return false;

		}

		foreach( $this->parsed as $slug => $values ){
			$this->set( $slug );

		}
		return $this->elements;

	}

	public function reset(){

		$this->elements = array();
		$this->parsed = array();

	}

	public function get_parsed_elements(){

		return $this->parsed;

	}

	public function get_element( $slug ){

		return ( $this->element_exists( $slug ) ? $this->elements[$slug] : $this->set( $slug ) );

	}

	public function element_exists( $slug ){

		return ( is_string( $slug ) && is_array( $this->elements ) && isset( $this->elements[$slug] ) );

	}

	public function get_elements(){

		return ( $this->has_elements() ? $this->elements : $this->initialize() );

	}

	public function length(){

		return ( is_array( $this->elements ) ? count( $this->elements ) : 0 );

	}

	public function has_elements(){
		
		return ( $this->length() > 0 ); 

	}

	public function get_elements_data(){

		if( !( $elements = $this->get_elements() ) ){
			return false;

		}
		$_elements = [];

		foreach( $elements as $slug => $class ){

			if( !is_array( $data = $this->get_element_data( $slug ) ) ){
				continue;

			}
			$_elements[$slug] = $data;

		}
		return $_elements;

	}

	private function parse_element( $slug, $class, $file ){

		if( !( $slug = $this->sanitize_slug( $slug ) ) || isset( $this->parsed[$slug] ) || !is_string( $class ) ){
			return false;

		}

		if( !is_string( $file ) || !file_exists( $file = trim( $file ) ) ){
			return false;

		}
		$this->parsed[$slug] = array(
			'class'	=> $class,
			'file'	=> $file
		);
		return true;

	}

	private function set( $slug ){

		if( $this->element_exists( $slug ) || !isset( $this->parsed[$slug] ) || !is_array( $this->parsed[$slug] ) ){
			return false;

		}

		if( !isset( $this->parsed[$slug]['class'] ) || !isset( $this->parsed[$slug]['file'] ) ){
			return false;

		}
		require_once $this->parsed[$slug]['file'];

		if( !class_exists( $this->parsed[$slug]['class'] ) ){
			return false;

		}
		$current = new $this->parsed[$slug]['class'];
		$this->elements[$slug] = $current;
		return $current;

	}

	public function unset( $slug ){

		if( $this->element_exists( $slug ) ){
			unset( $this->elements[$slug] );

			if( isset( $this->parsed[$slug] ) ){
				unset( $this->parsed[$slug] );

			}
			return true;

		}
		return false;


	}

	private function parser( $element, $needle ){
		ob_start();
		$element->$needle();
		return ob_get_clean();

	}

	public function get_element_data( $slug ){

		if( !( $element = $this->get_element( $slug ) ) ){
			return false;

		}
		$name = __( 'Undefined', 'comet' );
		$icon = 'cico-custom';
		$tabs = [];
		$view = '';
		$css = '';

		if( method_exists( $element, 'get_name' ) && is_string( $tmp = $element->get_name() ) ){
			$name = strip_tags( $tmp );

		}

		if( method_exists( $element, 'get_icon' ) && is_string( $tmp = $element->get_icon() ) ){
			$icon = strip_tags( $tmp );

		}

		if( method_exists( $element, 'get_settings' ) && is_array( $tmp = $element->get_settings() ) ){
			$tabs = $tmp;

		}

		if( method_exists( $element, 'view' ) ){
			$view = $this->parser( $element, 'view' );

		}

		if( method_exists( $element, 'css' ) ){
			$css = strip_tags( $this->parser( $element, 'css' ) );

		}

		return [
			'name'		=> $name,
			'icon'		=> $icon,
			'tabs'		=> $tabs,
			'force_js'	=> ( is_bool( $element->force_js() ) ? $element->force_js() : false ),
			'render'	=> [
				'view'	=> $view,
				'css'	=> $css
			]
		];

	}

}
?>