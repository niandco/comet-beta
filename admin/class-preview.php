<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-page2.php';

final class Comet_Preview extends Comet_Page2 {

	private $id = false;

	private $template = false;

	public function __construct(){
		parent::__construct( 'comet_preview' );


	}

	final public function instance( $id ){
		$id = (int)$id;

		if( $id < 0 ){
			return false;

		}
		$this->id = $id;
		$this->template = comet_get_mytemplate( $this->id, true );

		if( !$this->template ){
			return false;

		}
		$data = [
			'title'     => sprintf( __( 'Previewing "%s"', 'comet' ), $this->template->post_title ),
			'classes'   => 'comet-page--preview'
		];
		parent::set_data( $data );
		add_action( "comet_admin_header", [ $this, 'styles' ] );
		add_action( "comet_admin_footer", [ $this, 'scripts' ] );
		return true;

	}

	final public function styles(){
		$url = COMET_URL;
		$css = 'body{margin:0;padding:0;border:0;}';
		$css .= 'body > .comet-message{height:100%;width:100%;position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;}';
		$css .= 'body > .comet-message > p{text-align:center;margin:10px;color:#404146;max-width:500px;font:300 17px/1.5 sans-serif;padding:20px;background:#FFF0F0;color:red;}';

		comet_inline_style( $css );
		comet_print_style( "{$url}src/css/view.css", COMET_VERSION );

	}

	final public function scripts(){
		$url = COMET_URL;

		comet_localize( '__cometdata', [
			'id'        => $this->id,
			'ajax_url'  => admin_url( 'admin-ajax.php' ),
			'security'  => wp_create_nonce( 'comet-ajax-nonce' ),
			'user'      => 'true',
		] );

		comet_print_script( "{$url}src/js/view.js", COMET_VERSION );


	}

	final protected function body(){
		$path = COMET_PATH;

		if( !( $T = comet_autoload( '\Comet\Comet_Render', "{$path}includes/class-render.php" ) ) ){
			comet_message( __( 'An error has been occured. Template failed rendering.', 'comet' ), 'error', true );
			return;

		}
		echo '<div class="cpb-content">';
		echo $T->render( $this->template->meta );
		echo '</div>';

	}

}
?>