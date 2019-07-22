<?php
namespace Comet;

/**
 * The general functionalities of the plugin.
 *
 * @link       https://blacklead.fr
 * @since      1.0.0
 *
 * @package    Comet
 * @subpackage Comet/includes
 * @author     blacklead <contact@blacklead.fr>
 */
class Comet_Includes extends Comet{

	public function __construct(){

		add_action( 'init', [ $this, 'init' ], 99 );
		add_action( 'plugins_loaded', [ $this, 'load_plugin_textdomain' ] );

		//add_filter( 'wp_insert_post_data', array( $this, 'cache_templates' ) );
		//add_filter( 'template_include', array( $this, 'view_template' ) );


	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$path = COMET_PATH;

		load_plugin_textdomain( 'comet', false, "{$path}/languages/" );

	}

	/**
	 * Register comet_mytemplates post type.
	 *
	 * @since    1.0.0
	 */
	private function register_mytemplates() {
		
		$labels = [
			'name'                  => _x( 'My templates', 'Post Type General Name', 'comet' ),
			'singular_name'         => _x( 'My template', 'Post Type Singular Name', 'comet' ),
			'menu_name'             => __( 'My templates', 'comet' ),
			'name_admin_bar'        => __( 'My templates', 'comet' ),
			'archives'              => __( 'My templates', 'comet' ),
			'attributes'            => __( 'My templates', 'comet' ),
			'parent_item_colon'     => __( 'Parent template:', 'comet' ),
			'all_items'             => __( 'All templates', 'comet' ),
			'add_new_item'          => __( 'Add New template', 'comet' ),
			'add_new'               => __( 'Add New', 'comet' ),
			'new_item'              => __( 'New template', 'comet' ),
			'edit_item'             => __( 'Edit template', 'comet' ),
			'update_item'           => __( 'Update template', 'comet' ),
			'view_item'             => __( 'View template', 'comet' ),
			'view_items'            => __( 'View templates', 'comet' ),
			'search_items'          => __( 'Search template', 'comet' ),
			'not_found'             => __( 'Not found', 'comet' ),
			'not_found_in_trash'    => __( 'Not found in trash', 'comet' ),
			'featured_image'        => __( 'Featured Image', 'comet' ),
			'set_featured_image'    => __( 'Set featured image', 'comet' ),
			'remove_featured_image' => __( 'Remove featured image', 'comet' ),
			'use_featured_image'    => __( 'Use as featured image', 'comet' ),
			'insert_into_item'      => __( 'Insert into template', 'comet' ),
			'uploaded_to_this_item' => __( 'Uploaded to this template', 'comet' ),
			'items_list'            => __( 'templates list', 'comet' ),
			'items_list_navigation' => __( 'templates list navigation', 'comet' ),
			'filter_items_list'     => __( 'Filter templates list', 'comet' ),
		];
		
		$args = [
			'label'                 => __( 'My template', 'comet' ),
			'labels'                => $labels,
			'supports'              => [ 'title', 'author', 'custom-fields' ],
			'hierarchical'          => false,
			'public'                => false,
			'show_ui'               => true,
			'show_in_menu'          => false,
			'menu_position'         => 5,
			'show_in_admin_bar'     => false,
			'show_in_nav_menus'     => false,
			'can_export'            => true,
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'publicly_queryable'    => false,
			'rewrite'               => false,
			'capability_type'       => 'page',
			'show_in_rest'          => false,
		];

		register_post_type( 'comet_mytemplates', $args );

	}

	/**
	 * Register comet_fonts post type.
	 *
	 * @since    1.1.0
	 */
	private function register_fonts() {
		
		$labels = [
			'name'                  => _x( 'Fonts', 'Post Type General Name', 'comet' ),
			'singular_name'         => _x( 'Font', 'Post Type Singular Name', 'comet' ),
			'menu_name'             => __( 'Fonts', 'comet' ),
			'name_admin_bar'        => __( 'Fonts', 'comet' ),
			'archives'              => __( 'Fonts', 'comet' ),
			'attributes'            => __( 'Fonts', 'comet' ),
			'parent_item_colon'     => __( 'Parent font:', 'comet' ),
			'all_items'             => __( 'All fonts', 'comet' ),
			'add_new_item'          => __( 'Add New font', 'comet' ),
			'add_new'               => __( 'Add New', 'comet' ),
			'new_item'              => __( 'New font', 'comet' ),
			'edit_item'             => __( 'Edit font', 'comet' ),
			'update_item'           => __( 'Update font', 'comet' ),
			'view_item'             => __( 'View font', 'comet' ),
			'view_items'            => __( 'View fonts', 'comet' ),
			'search_items'          => __( 'Search font', 'comet' ),
			'not_found'             => __( 'Not found', 'comet' ),
			'not_found_in_trash'    => __( 'Not found in trash', 'comet' ),
			'featured_image'        => __( 'Featured Image', 'comet' ),
			'set_featured_image'    => __( 'Set featured image', 'comet' ),
			'remove_featured_image' => __( 'Remove featured image', 'comet' ),
			'use_featured_image'    => __( 'Use as featured image', 'comet' ),
			'insert_into_item'      => __( 'Insert into font', 'comet' ),
			'uploaded_to_this_item' => __( 'Uploaded to this font', 'comet' ),
			'items_list'            => __( 'Fonts list', 'comet' ),
			'items_list_navigation' => __( 'Fonts list navigation', 'comet' ),
			'filter_items_list'     => __( 'Filter fonts list', 'comet' ),
		];
		
		$args = [
			'label'                 => __( 'Fonts', 'comet' ),
			'labels'                => $labels,
			'supports'              => [ 'title', 'author', 'custom-fields' ],
			'hierarchical'          => false,
			'public'                => false,
			'show_ui'               => true,
			'show_in_menu'          => false,
			'menu_position'         => 5,
			'show_in_admin_bar'     => false,
			'show_in_nav_menus'     => false,
			'can_export'            => true,
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'publicly_queryable'    => false,
			'rewrite'               => false,
			'capability_type'       => 'page',
			'show_in_rest'          => false,
		];

		register_post_type( 'comet_fonts', $args );

	}

	/**
	 * Init action.
	 *
	 * @since     1.0.0
	 */ 
	public function init() {

		$this->register_mytemplates();

		$this->register_fonts();

		/*if( !is_array( $post_types = comet_get_supported_post_types() ) ){
			return;

		}

		foreach( $post_types as $post_type => $name ){
			add_filter( "theme_{$post_type}_templates", [ $this, 'templates' ], 10, 4 );

		}*/

	}

    /**
     * Add new template to the dropdown. (Wordpress 4.7+).
     * 
     * @since   1.0.0
     */
    public function templates( $templates ) {
    	$templates = is_array( $templates ) ? $templates : [];
    	$templates['comet-fwtemplate.php'] = __( 'Comet (full width)', 'comet' );
    	return $templates;
    }

    /**
     * Add new template to the cache.
     * 
     * @since   1.0.0
     */
    public function cache_templates( $atts ) {

    	$cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

    	$templates = wp_get_theme()->get_page_templates();
    	if ( empty( $templates ) ) {
    		$templates = array();
    	}

    	wp_cache_delete( $cache_key , 'themes');

    	$templates = $this->templates( $templates );

    	wp_cache_add( $cache_key, $templates, 'themes', 1800 );
    	return $atts;
    }

    /**
     * Check if the template is assigned to the page.
     * 
     * @since   1.0.0
     */
    public function view_template( $template ){
    	global $post;

    	if( !$post ){
    		return $template;
    	}
    	$templates = $this->templates( array() );
    	$meta = get_post_meta( $post->ID, '_wp_page_template', true );

    	if( !isset( $templates[$meta] ) ){
    		return $template;
    	}
    	$file = $this->base_path . $meta;

    	if( file_exists( $file ) ){
    		return $file;
    	}else{
    		echo $file;
    	}
    	return $template;

    }

}
?>