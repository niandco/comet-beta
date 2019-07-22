<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';
require_once 'class-metaboxes.php';

class Comet_Post_Edit extends Comet_Metaboxes{

    /**
     * The current slug.
     *
     * @since    1.0.2
     * @access   protected
     * @var      string    $slug
     */
    protected $slug = 'editor';

    /**
     * The menu title.
     *
     * @since    1.0.2
     * @access   protected
     * @var      string    $menu_title
     */
    protected $menu_title;

    /**
     * The page title.
     *
     * @since    1.0.2
     * @access   protected
     * @var      string    $page_title
     */
    protected $page_title;

    /**
     * The minimum capability required.
     *
     * @since    1.0.2
     * @access   protected
     * @var      string    $capability
     */
    protected $capability = 'edit_posts';

    /**
     * The visibility.
     *
     * @since    1.0.2
     * @access   protected
     * @var      boolean    $public
     */
    protected $public = false;

	/**
	 * The current post id.
	 *
	 * @since    1.0.2
	 * @access   protected
	 * @var      integer    $id
	 */
    protected $id;

	/**
	 * The current post object.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      object    $post
	 */
    protected $post;

	/**
	 * Debug suffix.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string  $suffix
	 */
	private $suffix;

    /**
    * Is current post a post.
    *
    * @since    1.0.2
    * @access   private
    * @var      string  $suffix
    */
    private $is_post = false;

    /**
    * The current screen.
    *
    * @since    1.0.2
    * @access   protected
    * @var      object  $current_screen
    */
    protected $current_screen;

    /**
    * The current hook suffix.
    *
    * @since    1.0.2
    * @access   protected
    * @var      string  $hook_suffix
    */
    protected $hook_suffix;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      object    $post
	 */
    public function __construct( $post ){
        global $current_screen, $hook_suffix;
        
        $this->current_screen = $current_screen;
        $this->hook_suffix = $hook_suffix;

        if( is_object( $post ) && isset( $post->ID ) && $this->_is_editing( $post->ID ) ){
            $this->is_post = true;
            $this->post = $post;
            $this->id = $post->ID;
            $this->page_title = sprintf( __('%s &#8212; Comet', 'comet' ), $post->post_title );
            $this->menu_title = $this->page_title;

            add_action( 'comet_admin_header', array( $this, 'header' ) );
            add_action( 'comet_admin_footer', array( $this, 'footer' ) );

            add_action( 'admin_print_styles', array( $this, 'styles' ) );
            add_action( 'admin_print_scripts', array( $this, 'scripts' ) );
            add_action( 'add_meta_boxes', array( $this, 'metaboxes' ) );

            add_filter( 'comet_admin_body_class', array( $this, 'body_class' ) );

        }

    }

    public function body_class(){
        $id = $this->id;

        return "post-{$id}";

    }

    public function is_editing(){
        return ( is_bool( $this->is_post ) ? $this->is_post : false );

    }

    private function _is_editing( $post = null ){
        $g = comet_get_args();

        if( !is_admin() || !isset( $g['action'] ) || !isset( $g['comet'] ) || !isset( $g['post'] ) || $post === null ){
            return false;

        }
        $pb = is_object( $this->current_screen ) && isset( $this->current_screen->base ) ? $this->current_screen->base : null;

        return ( $pb === 'post' && (int)$post === (int)$g['post'] && $g['action'] === 'edit' );

    }

    public function header(){

        $hook_suffix = $this->hook_suffix;

        do_action( 'admin_print_styles' );

        do_action( 'admin_print_scripts' );

        /**
        * Enqueue scripts for all admin pages.
        *
        * @since 1.0.2
        *
        * @param string $hook_suffix The current admin page.
        */
        do_action( 'admin_enqueue_scripts', $hook_suffix );

        /**
        * Fires when styles are printed for a specific admin page based on $hook_suffix.
        *
        * @since 1.0.2
        */
        do_action( "admin_print_styles-{$hook_suffix}" );

        /**
        * Fires when styles are printed for all admin pages.
        *
        * @since 1.0.2
        */
        do_action( 'admin_print_styles' );

        /**
        * Fires when scripts are printed for a specific admin page based on $hook_suffix.
        *
        * @since 1.0.2
        */
        do_action( "admin_print_scripts-{$hook_suffix}" );

        /**
        * Fires when scripts are printed for all admin pages.
        *
        * @since 1.0.2
        */
        do_action( 'admin_print_scripts' );

    }

    public function footer(){

        $hook_suffix = $this->hook_suffix;

        /**
        * Prints scripts or data before the default footer scripts.
        *
        * @since 1.0.2
        *
        * @param string $data The data to print.
        */
        do_action( 'admin_footer', '' );
        
        /**
        * Prints scripts and data queued for the footer.
        *
        * The dynamic portion of the hook name, `$hook_suffix`,
        * refers to the global hook suffix of the current page.
        *
        * @since 1.0.2
        */
        do_action( "admin_print_footer_scripts-{$hook_suffix}" );
        
        /**
        * Prints any scripts and data queued for the footer.
        *
        * @since 1.0.2
        */
        do_action( 'admin_print_footer_scripts' );
        
        /**
        * Prints scripts or data after the default footer scripts.
        *
        * The dynamic portion of the hook name, `$hook_suffix`,
        * refers to the global hook suffix of the current page.
        *
        * @since 2.8.0
        */
        do_action( "admin_footer-{$hook_suffix}" );
        
        // get_site_option() won't exist when auto upgrading from <= 2.7
        if( function_exists( 'get_site_option' ) ){

            if( false === get_site_option( 'can_compress_scripts' ) ){
                compression_test();

            }
        }

    }

    public function styles(){
        $base_url = COMET_URL;

        wp_enqueue_media();
        wp_enqueue_style( 'cico', "{$base_url}src/css/cico.min.css", [], COMET_VERSION );
        wp_enqueue_style( "comet-editor", "{$base_url}src/css/editor.css", [], COMET_VERSION );
        wp_enqueue_style( "comet-view", "{$base_url}src/css/view.css", [], COMET_VERSION );
        wp_add_inline_style( "comet-view", comet_get_fonts( 'publish', 'css' ) );
        // @TODO RTL

    }

    public function scripts(){
        $editor_slug = "comet-editor";
        $i18n = comet_get_i18n( 'editor' );

        wp_localize_script( $editor_slug, '__cometdata', [
            'post_id'       => $this->post->ID,
            'preview_url'   => comet_get_dashboard_url( 'preview' ),
            'dashboard_url' => comet_get_rediction_url( $this->post->post_type ),
            'security'      => wp_create_nonce( 'comet-ajax-nonce' ),
            'ajax_url'      => admin_url( 'admin-ajax.php' ),
            'rtl'           => is_rtl() ? 'true' : 'false',
            'user'          => 'true'
        ] );
        wp_localize_script( $editor_slug, $i18n->get_id(), $i18n->get() );
        wp_enqueue_script( $editor_slug, COMET_URL . 'src/js/editor.js', [], COMET_VERSION, true );

    }

    public function body(){
        $post = $this->post;
        $post_type = $post->post_type;

        if( is_rtl() ){
            $classes .= ' rtl';

        }
        echo '<div id="comet-editor" class="comet-frameset">';

        do_action( 'add_meta_boxes', $post_type, $post );
        do_action( "add_meta_boxes_{$post_type}", $post );

        echo '<div id="comet-generalSettings" class="comet-general-settings">';
        echo '<form id="comet-postSettings" class="comet-general-settings__form">';
        echo '<header class="comet-general-settings__header comet-header">';
        echo '<h4>' . __( 'Post settings', 'comet' ) . '</h4>';
        echo '<button class="comet-general-settings__close" aria-label="' . __( 'Close', 'comet' ) . '">';
        echo '<span class="comet-general-settings__close__icon cico cico-x"></span>';
        echo '<span class="comet-general-settings__close__tooltip">' . __( 'Close', 'comet' ) . '</span>';
        echo '</button>';
        echo '</header>';
        echo '<section class="comet-general-settings__main comet-inner">';

        $this->do_meta_boxes( 'advanced', $post );
        $this->do_meta_boxes( 'side', $post );
        $this->do_meta_boxes( 'normal', $post );

        echo '</section>';
        echo '</form>';
        echo '</div>';

        echo '</div>';

        echo '<div id="comet-preloader" class="comet-preloader">';
        echo '<div>';
        echo '<span class="comet-preloader__icon cico cico-comet"></span>';
        echo '<span class="comet-preloader__text">' . __( 'Loading...', 'comet' ) . '</span>';
        echo '</div>';
        echo '</div>';

    }

    private function do_meta_boxes( $context, $object ){

        global $wp_meta_boxes;

        $context = trim( $context );
        $page = $this->current_screen->id;
        $i = 0;

        if( !isset( $wp_meta_boxes[$page][$context] ) ){
            return $i;
        }
        echo '<div class="comet-metaboxes comet-metaboxes' . ucfirst( $context ) .'">';

        foreach( [ 'high', 'sorted', 'core', 'default', 'low' ] as $priority ){

            if( !isset( $wp_meta_boxes[$page][$context][$priority] ) ){
                continue;

            }

            foreach( (array)$wp_meta_boxes[$page][$context][$priority] as $box ){

                if ( false == $box || ! $box['title'] ){
                    continue;

                }
                $i++;
                echo '<div id="' . $box['id'] . '" class="comet-metabox">' . "\n";

                echo "<h5 class='comet-metaboxTitle'>{$box['title']}</h5>\n";
                echo '<div class="comet-inside">' . "\n";

                if( isset( $box['callback'] ) ){
                    call_user_func($box['callback'], $object, $box );
                }
                echo "</div>\n";
                echo "</div>\n";
            }

        }
        echo '</div>';

        return $i;

    }

}
?>
