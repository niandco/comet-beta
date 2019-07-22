<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Js {

	private $id = null;

	private $public = false;

	private $data = [];

	public function __construct( $id = null, $public = true ){

		$this->id = ( is_int( $id = intval( $id ) ) && $id > -1 ? $id : null );
		$this->public = is_bool( $public ) ? $public : true;
		$this->data = !is_array( $this->data ) ? [] : $this->data;

		foreach( [ 'post', 'settings', 'svgSets' ] as $m ){

			if( method_exists( $this, $m ) ){
				$this->data[$m] = call_user_func( [ $this, $m ] );

			}
		}

	}

	public function get_data(){
		return $this->data;

	}

	private function post(){

		return ( ( $post = comet_get_post( $this->id ) ) ? $post->get_post() : false );

	}

	private function settings(){

		$elements = comet_get_elements_data();

		if( $this->public ){

			return [
				'elements'	=> $elements 
			];

		}
		$layout = comet_layout();

		return [
			'elements'	=> $elements,
			'section'	=> is_array( $data = $layout->get_type_data( 'section' ) ) ? $data['tabs'] : [],
			'row'		=> is_array( $data = $layout->get_type_data( 'row' ) ) ? $data['tabs'] : [],
			'column'	=> is_array( $data = $layout->get_type_data( 'column' ) ) ? $data['tabs'] : []
		];

	}

	private function svgSets(){

		return comet_get_iconsets();

	}

}
?>