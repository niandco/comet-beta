<?php
namespace Comet\Admin;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://blacklead.fr
 * @since      1.0.0
 *
 * @package    Comet
 * @subpackage Comet/admin
 * @author     blacklead <contact@blacklead.fr>
 */

 class Comet_Admin {

	public function __construct(){

		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
		add_filter( 'replace_editor', [ $this, 'editor' ], 10, 2 );
		add_filter( 'page_row_actions', [ $this, 'action' ], 10, 2 );
		add_filter( 'post_row_actions', [ $this, 'action' ], 10, 2 );

	}

	public function admin_menu() {
		
		$hook = add_menu_page(
			'Comet',
			'Comet',
			'edit_posts',
			'comet',
			function(){exit;},
			'data:image/svg+xml;base64,' . base64_encode( '<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="m336.5 82.8c-40.2-28-91.3-22.1-143.9 16.7-10.1 7.5-20.3 16.2-30.2 25.8-2-17.4.1-38.1 3-51 2.4-10.8-4.4-21.4-15.2-23.8s-21.5 4.4-23.9 15.2c-.1.7-3.7 16.6-4.5 36.7-1 23.5 2 43.1 8.8 58.2-18.4 23.1-35.1 49.1-48.5 76-13.6 27.3-23.4 54.8-28.3 79.6-5.6 28.3-5.2 53 1.4 73.5 5.9 18.5 16.6 33 31.7 43.2 15.4 10.4 35.2 15.9 58.6 16.3h2.2c85.7 0 185.5-79.1 189.8-82.5 8.6-6.9 10-19.5 3.1-28.1s-19.5-10-28.1-3.1c-.2.2-23.9 19.1-56.9 37.7-42.4 24-80.2 36.4-109.4 36-18.4-.3-43.9-3.9-52.8-31.7-9-28 .2-74 24.6-123 11.3-22.6 25-44.4 40.1-64.1 4.7 2.4 9.8 4.2 15.3 5.2 36.4 7.2 75.8 3.6 111-10.2 32.5-12.8 57.1-32.7 65.9-53.3 8-18.8 2.7-37.8-13.8-49.3zm-36.9 49c-23.7 18.3-67.3 32.8-112.7 25.6 9.7-9.7 19.5-18.4 29.4-25.7 26.7-19.7 65.2-38.4 97.2-16.1.1.1.1.1.2.2-.8 2.3-4.1 8.3-14.1 16z"/><path fill="white" d="m446.6 266.8c-6.1-9.2-18.5-11.7-27.7-5.6l-33.3 22.2c-9.2 6.1-11.7 18.5-5.6 27.7s18.5 11.7 27.7 5.6l33.3-22.2c9.3-6.1 11.8-18.5 5.6-27.7z"/></svg>' ),
			82
		);

		add_action( "load-{$hook}", [ $this, 'page' ] );

	}

	public function editor( $a, $post ){

		$path = COMET_PATH;
		$class = '\Comet\Admin\Comet_Post_Edit';
		$file = "{$path}admin/class-post-edit.php";

		if( ( $class = comet_requires( $class, $file ) ) && ( $Editor = new $class( $post ) ) &&  $Editor instanceof $class && $Editor->is_editing() ){
			$Editor->page();
			return true;

		}
		return $a;

	}

	public function page(){

		$path = COMET_PATH;

		if( ( $Dashboard = comet_autoload( '\Comet\Admin\Dashboard\Comet_Dashboard', "{$path}admin/class-dashboard.php" ) ) ){
			$Dashboard->instance();

		}
		exit;

	}

	public function action( $actions, $post ){

		if( !is_object( $post ) || !isset( $post->post_type ) ){
			return $actions;

		}
		$post_type = trim( $post->post_type );
		$post_type = "apt_{$post_type}";
		$options = get_option( 'comet_settings' );

		if( !is_array( $options ) || !isset( $options['post_types'] ) || !is_array( $post_types = $options['post_types'] ) ){
			return $actions;

		}

		if( isset( $post_types[$post_type] ) && (int)$post_types[$post_type] === 1 ){
			$title = sprintf( __( 'Edit &#8220;%s&#8221; with Comet', 'comet' ), $post->post_title );
			$actions['comet'] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				esc_url( comet_get_post_edit_link( $post->ID ) ),
				esc_attr( $title ),
				__( 'Edit with Comet', 'comet' )
			);

		}
		return $actions;

	}

}
