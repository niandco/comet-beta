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

    public function style(){

        /*if( !( $url = comet_fonts_url() ) ){
            return;

        }
        comet_print_style( $url );*/


    }

    public function instance( $pages ){
        $this->pages = $pages;
        $this->page();

    }

    protected function content(){

        echo '<div id="comet-sourceframe8679171600336466">';
        comet_message( __( 'Wait while initializing fonts.', 'comet' ), 'warning', true );
        echo '</div>';
        return;

        $fonts = comet_get_fonts( [] );
        $weight = [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ];

        $li = '';
        $total = 0;

        foreach( $fonts as $id => $font ){
            $f = explode( ':', $font );

            if( !is_string( $f[0] ) || !is_numeric( $f[1] ) || !in_array( ( $i = (int)$f[1] ), $weight ) ){
                continue;

            }
            $li .= '<li><h4>' . $f[0] . ' ' . $i .'</h4>';
            $li .= '<p style="font-family:' . $f[0] . ';font-weight:' . $i . ';">';
            $li .= 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            $li .= '</p>';
            $li .= '</li>';
            $total++;
            
        }

        echo '<div class="comet-header comet-top comet-wrapper">';
        echo '<div class="comet-column">';
        echo '<h4>' . sprintf( _n( '%s font', '%s fonts', $total, 'comet' ), $total ) . '</h4>';
        echo '</div>';
        echo '<div class="comet-column">';
        echo '<a id="comet-addFont" class="comet-button comet-buttonPrimary">' . __( 'Library', 'comet' ) . '</a>';
        echo '</div>';
        echo '</div>';

        echo "<ul id=\"comet-mapFonts\">{$li}</ul>";

    }
}
?>
