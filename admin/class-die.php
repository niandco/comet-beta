<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-page2.php';

final class Comet_Die extends Comet_Page2 {

	private $message = false;

	public function __construct( $message = false, $title = '' ){

		$allowed = '<br><span><strong><b><i><em><u><strike><ins><del><a><h1><h2><h3><h4><h5><h6><p>';
		$dmessage = '<h1 class="comet-die__title"><strong>404</strong> Page not found</h1>';
		$dmessage .= '<p class="comet-die__desc">The page you are looking for does not exist or another error occured.</p>';

		parent::__construct( 'comet_die' );
		parent::set_data( [
			'title'		=> is_string( $title ) ? strip_tags( $title ) : __( 'Page not found', 'comet' ),
			'classes'	=> 'comet-die',
			'wp_begin'	=> false
		] );

		$this->message = is_string( $message ) ? strip_tags( $message, $allowed ) : $dmessage;

		add_action( 'comet_admin_header_comet_die', [ $this, 'style' ] );

	}

	final protected function body(){

		echo '<section class="comet-die__content">';
		echo $this->message;
		echo '</section>';
	}

	final public function style(){

		$o = 'html{margin:0;padding:0;border:0;background:white;}';
		$o .= 'body{display:flex;height:calc( 100% - 40px );width:calc( 100% - 40px );flex-basis:calc( 100% - 40px );align-items:center;justify-content:center;margin:20px;padding:0;border:0;background:white;font:300 17px/1.2 sans-serif;color:#404146;}';
		$o .= 'div,p,section,h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;border:0;}';
		$o .= '.comet-die__title{font:300 30px/1.2 sans-serif;margin-bottom:10px;}';
		$o .= '.comet-die__content{padding:20px;background:#F1F1F1;border-radius:5px;max-width:500px;}';

		echo "<style>{$o}</style>\r\n";


	}
	
}