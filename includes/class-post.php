<?php
namespace Comet\Library;

class Comet_Post {

	private $id = null;

	private $post = null;

	private $has_post = false;

	private $meta = false;

	public function __construct( $id = null ){

		$id = $id === null ? get_the_ID() : (int)$id;

		if( !is_int( $id ) || $id < 0 || ( $post = get_post( $id ) ) === null ){
			return;

		}
		$this->has_post = true;
		$this->id = $id;
		$this->post = is_array( $post ) ? (object)$post : $post;

	}

	public function has_post(){

		return ( $this->has_post && is_object( $this->post ) );

	}

	public function get_id(){

		return $this->id;

	}

	public function get_post( $meta = true ){

		if( !$this->has_post() ){
			return false;

		}
		$post = $this->post;

		if( is_bool( $meta ) && $meta ){
			$post->meta = $this->get_comet_meta();

		}
		return $post;

	}

	public function get_comet_meta(){

		$meta = !$this->meta ? get_post_meta( $this->id, '_cometMetaData', true ) : $this->meta;

		$this->meta = ( !is_array( $meta ) ? false : $meta );

		return $this->meta;

	}

	public function get_post_type(){

		return ( $this->has_post() ? $this->post->post_type : false );

	}

	public function delete_post(){

		return ( !( $response = wp_delete_post( $this->id, true ) ) || $response === null || !is_object( $response ) ? false : $response );

	}

	public function save_post( $data = [] ){

		$data = ( is_array( $data ) ? $data : ( is_object( $data ) ? (array)$data : [] ) );

		$esc = [];

		if( isset( $data['post_title'] ) && is_string( $data['post_title'] ) ){
			$esc['post_title'] = sanitize_text_field( $data['post_title'] );

		}

		if( isset( $data['post_content'] ) ){
			$esc['post_content'] = wp_kses_post( $data['post_content'] );

		}

		if( isset( $data['post_type'] ) && post_type_exists( $data['post_type'] ) ){
			$esc['post_type'] = $data['post_type'];

		}
		$esc['meta_input'] = [];
		$esc['meta_input']['_cometMetaData'] = ( isset( $data['meta'] ) && is_array( $data['meta'] ) ? $data['meta'] : [] );

		if( isset( $data['comment_status'] ) && in_array( $data['comment_status'], [ 'closed', 'open' ], true ) ){
			$esc['comment_status'] = $data['comment_status'];

		}

		if( isset( $data['ping_status'] ) && in_array( $data['ping_status'], [ 'closed', 'open' ], true ) ){
			$esc['ping_status'] = $data['ping_status'];

		}

		if( isset( $data['post_status'] ) && in_array( $data['post_status'], [ 'inherit', 'future', 'publish', 'pending', 'private', 'trash', 'auto-draft', 'draft' ], true ) ){
			$esc['post_status'] = $data['post_status'];

		}

		if( isset( $data['post_excerpt'] ) && is_string( $data['post_excerpt'] ) ){
			$esc['post_excerpt'] = sanitize_textarea_field( $data['post_excerpt'] );

		}

		if( $this->has_post() ){
			$esc['ID'] = $this->id;
			return wp_update_post( $esc );

		}
		return wp_insert_post( $esc );

	}
	
}
?>