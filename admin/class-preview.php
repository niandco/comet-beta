<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
    exit;

}
require_once 'class-page.php';
use Comet\Admin\Comet_Page;

class preview extends Comet_Page {

    private $version = null;

    private $id = false;

    private $template = false;

    private $base_url = '';

    protected $menu_title;

    protected $page_title;

    protected $public = false;

    protected $slug = 'preview';

    protected $capability = 'read';

    public function __construct(){

        $this->menu_title = __( 'Preview', 'comet' );
        $this->page_title = __( 'Preview', 'comet' );
        $slug = $this->slug;

        add_action( "comet_admin_header_{$slug}", [ $this, 'styles' ] );
        add_action( "comet_admin_footer_{$slug}", [ $this, 'scripts' ] );

    }

    public function instance( $pages ){

        $this->id = comet_get_id();
        $this->template = comet_get_mytemplate( $this->id, true );

        if( !$this->template ){
            comet_die(
                __( 'An error has been occured. Template not found.', 'comet' ),
                __( 'Template not found', 'comet')
            );
        }
        $this->page();

    }

    public function styles(){

        if( !$this->template ){
            return;

        }
        $url = COMET_URL;
        $css = 'body{margin:0;padding:0;border:0;}';
        $css .= 'body > .comet-message{height:100%;width:100%;position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;}';
        $css .= 'body > .comet-message > p{text-align:center;margin:10px;color:#404146;max-width:500px;font:300 17px/1.5 sans-serif;padding:20px;background:#FFF0F0;color:red;}';

        comet_inline_style( $css );
        comet_print_style( "{$url}src/css/view.css", COMET_VERSION );

    }

    public function scripts(){

        if( !$this->template ){
            return;

        }
        $url = COMET_URL;

        comet_localize( '__cometdata', [
            'id'        => $this->id,
            'ajax_url'  => admin_url( 'admin-ajax.php' ),
            'security'  => wp_create_nonce( 'comet-ajax-nonce' ),
            'user'      => 'true',
        ] );

        comet_print_script( "{$url}src/js/view.js", COMET_VERSION );

        
    }

    public function body(){

        $path = COMET_PATH;
        $file = "{$path}includes/class-render.php";

        if( !$this->template ){
            comet_message( __( 'An error has been occured. Template not found.', 'comet' ), 'error', true );
            return;

        }

        if( !( $r = comet_requires( '\Comet\Comet_Render', $file ) ) || !( $comet = new $r ) || !( $comet instanceof $r ) ){
            comet_message( __( 'An error has been occured. Template failed rendering.', 'comet' ), 'error', true );
            return;

        }
        echo '<div class="cpb-content">';
        echo $comet->render( $this->template->meta );
        echo '</div>';

    }

}
?>