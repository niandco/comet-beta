<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-interface.php';

class fonts extends Comet_Interface{

    protected $menu_title;

    protected $page_title;

    protected $slug = 'fonts';

    protected $help;

    public function __construct(){

        $help = __( 'All the fonts you’ve downloaded are listed here and loaded on your site. Comet provides standard set of fonts but not listed on this screen.', 'comet' );
        $help .= '<br><br>';
        $help .= __( 'The fonts library allows you to select fonts to download from Google fonts and remove fonts of your list.', 'comet' );
        $help .= '<br><br>';
        $help .= __( 'Note that the fonts affect page load performance (load time).', 'comet' );

        $this->menu_title = __( 'Fonts', 'comet' );
        $this->page_title = __( 'Fonts', 'comet' );
        $this->help = $help;
        $slug = $this->slug;

        add_action( "comet_admin_header_{$slug}", [ $this, 'style' ] );

    }

    public function instance( $pages ){
        $this->pages = $pages;
        $this->page();

    }

    protected function content(){

        echo '<div id="comet-tempframe__fonts">';
        comet_message( __( 'Wait while initializing fonts.', 'comet' ), 'warning', true );
        echo '</div>';

    }
}
?>
