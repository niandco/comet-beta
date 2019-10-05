<?php

namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}

abstract class Comet_Page2 {

	private $slug = 'comet';

	private $data = [
		'title'		=> 'Comet',
		'classes'	=> '',
		'wp_begin'	=> true
	];

	public function __construct( $slug ){
		$this->sanitize_slug( $slug );

	}

	final protected function set_data( $data ){
		$this->sanitize_data( $data );
		return $this->data;

	}

	final private function sanitize_slug( $slug ){
		$slug = strtolower( $slug );
		$slug = preg_replace( '/[^a-z_]/', '', $slug );

		$this->slug = !strlen( $slug ) ? 'comet' : $slug;

		return $this->slug;

	}

	final private function sanitize_data( $data ){

		$data = is_array( $data ) ? $data : [];

		$this->data = [
			'title'     => is_string( $data['title'] ) ? $data['title'] : 'Comet',
			'classes'   => is_string( $data['classes'] ) ? trim( $data['classes'] ) : '',
			'wp_begin'  => is_bool( $data['wp_begin'] ) ? $data['wp_begin'] : true,

		];

	}

	final public function get_slug(){
		return $this->slug;

	}

	final public function get_data(){
		return $this->data;

	}

	final public function render(){

		$type = get_option( 'html_type' );
		$charset = get_option( 'blog_charset' );

		@header( "Content-Type: {$type}; charset={$charset}" );

		if( $this->data['wp_begin'] && !defined( 'WP_ADMIN' ) ) {
			require_once  ABSPATH . 'wp-admin/admin.php';

		}
		$slug = $this->slug;
		$title = esc_html( $this->data['title'] );
		$classes = apply_filters( 'comet_admin_body_class_{$slug}', '', $slug );
		$classes = esc_attr( trim( $this->data['classes'] . ' ' . trim( $classes ) ) );

		if( $this->data['wp_begin'] ){
			_wp_admin_html_begin();

		}else{
			$local = get_locale();
			echo <<<HEAD
			<!DOCTYPE html>
			<html xmlns="http://www.w3.org/1999/xhtml" lang="{$local}">
			<head>
			<meta charset="{$charset}">
HEAD;

		}

		echo <<<HEAD
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<title>{$title}</title>
HEAD;

		do_action( 'comet_admin_header' );

		do_action( "comet_admin_header_{$slug}" );

		echo <<<HEAD
		</head>
		<body class="{$classes}">
HEAD;

		if( method_exists( $this, 'body' ) ){
			$this->body();

		}

		do_action( "comet_admin_footer_{$slug}" );
		do_action( 'comet_admin_footer' );
		echo <<<HEAD
		</body>
		</html>
HEAD;
		exit;

	}

}
?>