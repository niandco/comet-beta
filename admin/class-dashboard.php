<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-pages.php';
use Comet\Admin\Comet_pages;

class Comet_Dashboard extends Comet_Pages {

	private $base_path = COMET_PATH . 'admin/';

	private $fonts = [];

	public function __construct(){

		$this->fonts = comet_get_fonts();

		add_action( 'comet_admin_header', [ $this, 'styles' ] );
		add_action( 'comet_admin_footer', [ $this, 'scripts' ] );
		add_filter( 'comet_admin_body_class', [ $this, 'body_class' ] );

		$this->set( '\Comet\Admin\Dashboard\main', $this->base_path . 'class-main.php' );

		$this->set( '\Comet\Admin\Dashboard\mytemplates', $this->base_path . 'class-mytemplates.php' );

		$this->set( '\Comet\Admin\Dashboard\fonts', $this->base_path . 'class-fonts.php' );

		$this->set( '\Comet\Admin\Dashboard\settings', $this->base_path . 'class-settings.php' );

		$this->set( '\Comet\Admin\Dashboard\preview', $this->base_path . 'class-preview.php' );

		$add = apply_filters( 'comet_register_dashboard_pages', $this->pages );

		if( is_array( $add ) ){
			return false;

		}

		foreach( $add as $slug => $file ){
			$this->set( $slug, $file );

		}

	}

	public function body_class(){
		return 'comet-dashboard';
		
	}

	public function styles(){

		$url = COMET_URL;

		comet_print_style( "{$url}src/css/cico.min.css" );

		if( $this->is_page( 'preview' ) ){

			if( is_array( $this->fonts ) && isset( $this->fonts['css'] ) ){
				comet_inline_style( $this->fonts['css'] );

			}
			return;

		}
		comet_print_style( "{$url}src/css/admin.css" );

	}

	public function scripts(){

		if( $this->is_page( 'preview' ) ){
			return;

		}
		$url = COMET_URL;
		$i18n = comet_get_i18n( 'admin' );

		comet_localize( 
			'__cometdata',
			[
				'ajax_url'		=> admin_url( 'admin-ajax.php' ),
				'admin_url'		=> admin_url(),
				'security'		=> wp_create_nonce( 'comet-ajax-nonce' ),
				'edit_url'		=> admin_url( 'post.php' ),
				'myTemplates'	=> comet_get_dashboard_url( 'mytemplates' ),
				'fonts'			=> ( is_array( $this->fonts ) && isset( $this->fonts['fonts'] ) && is_array( $this->fonts['fonts'] ) ? $this->fonts['fonts'] : [] ),
				'user'			=> 'true'
			]
		);
		comet_localize( $i18n->get_id(), $i18n->get() );
		comet_print_script( "{$url}src/js/admin.js" );

	}

	public function is_dashboard(){

		$args = comet_get_args();

		return ( is_admin() && isset( $args['page'] ) && $args['page'] === 'comet' );

	}

	public function is_page( $slug ){
		$args = comet_get_args();

		return ( $this->is_dashboard() && is_string( $slug ) && isset( $args['rq'] ) && $this->page_exists( $args['rq'] ) && $args['rq'] === $slug );

	}

	public function instance(){
		$args = comet_get_args();

		if( !$this->is_dashboard() ){
			comet_die();

		}

		if( !$this->page_exists( $slug = ( isset( $args['rq'] ) && is_string( $args['rq'] ) ? trim( $args['rq'] ) : 'main' ) ) ){
			comet_die();

		}
		$this->pages[$slug]->instance( $this->pages );


	}

}
?>