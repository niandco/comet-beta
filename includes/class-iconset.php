<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_iconset{

	private $icons = [];

	protected function add( $id, $name, $width, $height, $path ){

		$id = $this->sanitize_id( $id );

		if( $this->icon_exists( $id ) ){
			return false;

		}

		$this->icons[$id] = [
			'name'		=> is_string( $name ) ? trim( strip_tags( $name ) ) : __( 'Undefined', 'comet' ),
			'width'		=> (int)$width,
			'height'	=> (int)$height,
			'path'		=> is_string( $path ) ? $path : ''
		];

		return $this->icons[$id];

	}

	protected function delete( $id ){

		if( $this->icon_exists( $id ) ){
			unset( $this->icons[$id] );
			return true;

		}
		return false;

	}

	public function get_name(){

		return ( isset( $this->name ) && is_string( $this->name ) ? $this->name : __( 'Undefined', 'comet' ) );

	}

	public function get_version(){

		return ( isset( $this->version ) && is_string( $this->version ) ? $this->version : '0.0.1' );

	}

	public function get_icons(){

		return $this->icons;

	}

	public function get_icon( $id ){

		return ( $this->icon_exists( $id ) ? $this->icons[$id] : false );

	}

	public function get_svg( $id ){

		if( !( $icon = $this->get_icon( $id ) ) ){
			return '';

		}
		$w = $icon['width'];
		$h = $icon['height'];
		$path = $icon['path'];

		return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 {$w} {$h}\">{$path}</svg>";


	}

	public function icon_exists( $id ){

		return ( is_array( $this->icons ) && is_string( $id ) && isset( $this->icons[$id] ) );

	}

	private function sanitize_id( $id ){

        return ( is_string( $id ) ? preg_replace( '/[^a-z0-9_\-]*/i', '', $id ) : '' );

	}

}
?>