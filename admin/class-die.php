<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Die {

	private $title = '';

	private $message = false;

	private $charset;

	public function __construct( $message = false, $title = '' ){

		$allowed = '<br><span><strong><b><i><em><u><strike><ins><del><a>';
		$dmessage = '<strong>' . __( '404 Error', 'comet' ) . '</strong>. ' . __( 'Page not found.', 'comet' );

		$this->message = is_string( $message ) ? strip_tags( $message, $allowed ) : $dmessage;
		$this->title = is_string( $title ) ? strip_tags( $title ) : __( 'Page not found', 'comet' );
		$this->charset = get_option( 'blog_charset' );

	}

	public function render(){
		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . $this->charset );

		echo '<!DOCTYPE html>' . "\r\n";
		echo '<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">' . "\r\n";
		echo "<head>\r\n";
		echo '<meta charset="' . $this->charset . '">' . "\r\n";
		echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">' . "\r\n";
		echo '<title>' . $this->title . '</title>' . "\r\n";
		$this->style();

		echo "\r\n</head>\r\n";
		echo "<body>\r\n";

		echo '<div class="comet-die">';
		echo '<p>' . $this->message . '</p>';
		echo '</div>';

		echo "\r\n</body>\r\n";
		echo "</html>\r\n";
	}

	private function style(){

		$o = 'html{margin:0;padding:0;border:0;background:white;}';
		$o .= 'body{margin:20px;padding:0;border:0;background:white;font:300 17px/1.2 sans-serif;color:#404146;}';
		$o .= 'div,p{margin:0;padding:0;border:0;}';
		$o .= '.comet-die{display:flex;height:100%;width:100%;align-items:center;justify-content:center;}';
		$o .= '.comet-die > p{display:block;text-align:center;padding:0;margin:0;border:0;}';

		echo "<style>{$o}</style>\r\n";


	}
	
}