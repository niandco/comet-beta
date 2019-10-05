<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Pages2 {

	private $pages = [];

	public function __construct(){

		$this->set_page(
			'WordPress',
			'WordPress',
			'edit_posts',
			'close',
			null,
			true

		);

		$this->set_page(
			__( 'Home', 'comet' ),
			__( 'Dashboard', 'comet' ),
			'edit_posts',
			'home',
			function(){
				return $this->autoload_response( 'Comet_Home', 'class-home.php' );

			}

		);

		$this->set_page(
			__( 'My templates', 'comet' ),
			__( 'My templates', 'comet' ),
			'edit_posts',
			'mytemplates',
			function(){
				return $this->autoload_response( 'Comet_Templates', 'class-mytemplates.php' );

			}

		);

		$this->set_page(
			__( 'My fonts', 'comet' ),
			__( 'My fonts', 'comet' ),
			'manage_options',
			'myfonts',
			function(){
				return $this->autoload_response( 'Comet_Fonts', 'class-fonts.php' );

			}

		);

		$this->set_page(
			__( 'Settings', 'comet' ),
			__( 'Settings', 'comet' ),
			'manage_options',
			'settings',
			function(){
				return $this->autoload_response( 'Comet_Settings', 'class-settings.php' );

			}

		);

	}

	final private function autoload_response( $cName, $file ){
		$path = COMET_PATH;
		$file = "{$path}admin/{$file}";
		$cName = "\Comet\Admin\Dashboard\\{$cName}";

		return !( $C = comet_autoload( $cName, $file ) ) || !method_exists( $C, 'response' ) ? false : $C->response();

	}

	final public function set_page( $menu_title, $page_title, $capability = 'manage_options', $slug, $function ){

		$slug = sanitize_title( $slug );

		if( $this->page_exists( $slug ) || !current_user_can( $capability ) ){
			return false;

		}

		$this->pages[$slug] = [
			'menu_title'	=> sanitize_text_field( $menu_title ),
			'page_title'	=> sanitize_text_field( $page_title ),
			'callback'		=> $function,
			'url'			=> $slug === 'close' ? get_admin_url() : comet_get_dashboard_url( $slug ),
			'reload'		=> $slug === 'close'
		];
		return $this->pages[$slug];

	}

	final private function is_slug( $slug ){

		return ( is_string( $slug ) && !preg_match( '/[^a-z\_]/i', $slug ) );

	}

	final public function unset_page( $slug ){

		if( !$this->page_exists( $slug ) ){
			return false;

		}
		unset( $this->pages[$slug] );
		return true;

	}

	final public function page_exists( $slug ){

		return ( is_string( $slug ) && isset( $this->pages[$slug] ) );

	}

	final public function get_pages(){

		return $this->pages;

	}

	final public function get_page( $slug ){

		return ( $this->page_exists( $slug ) ? $this->pages[$slug] : false );

	}

}
?>