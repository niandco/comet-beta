<?php
namespace Comet;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://blacklead.fr
 * @since      1.0.0
 *
 * @package    Comet
 * @subpackage Comet/includes
 * @author     blacklead <contact@blacklead.fr>
 */
class Comet {

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $slug    The string used to uniquely identify this plugin.
	 */
	private $slug = 'comet';

	/**
	 * The name of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $name    The name to identify this plugin.
	 */
	private $name = 'Comet';


	/**
	 * The description of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $description    The description of this plugin.
	 */
	private $description;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version = COMET_VERSION;

	/**
	 * Plugin directory path.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $base_path    The directory path of the plugin.
	 */
	protected $base_path = COMET_PATH;


	/**
	 * The plugin dependencies.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array    $registered    The plugin dependencies.
	 */
	private $registered = [];


	public function __construct(){

		$path = $this->base_path;
		$this->description = __( 'The visual page builder that\'s light, fast and modern. Bring your ideas to life fast through the drag & drop and the advanced features.', 'comet' );

		$this->register( '\Comet\Comet_Includes', "{$path}includes/class-includes.php" );
		$this->register( '\Comet\Comet_Ajax', "{$path}includes/class-ajax.php" );
		$this->register( '\Comet\Admin\Comet_Admin', "{$path}admin/class-admin.php" );
		$this->register( '\Comet\Comet_Frontend', "{$path}includes/class-frontend.php" );
		
	}

	private function sanitize_slug( $slug ){

        if( !is_string( $slug ) ){
            return false;

        }
        $slug = trim( strip_tags( $slug ) );

        if( ( $pos = strrpos( $slug, '\\' ) ) > -1 && ( $pos = $pos + 1 ) < strlen( $slug ) ){
        	$slug = substr( $slug, $pos );

        }

        if( strlen( $slug ) < 1 || preg_match( '/[^a-z\_]/i', $slug ) ){
            return false;

        }
		return $slug;

	}

	private function register( $class, $file ){

		if( !( $slug = $this->sanitize_slug( $class ) ) || !is_string( $file ) || !file_exists( $file = trim( $file ) ) ){
			return false;

		}

		if( $this->is_registered( $slug ) ){
			return false;

		}

		$this->registered[$slug] = (object)[
			'class'		=> $class,
			'file'		=> $file
		];

		return $this->registered[$slug];

	}

	private function autoload( $slug ){

		if( !( $reg = $this->get( $slug ) ) ){
			return false;

		}
		require_once $reg->file;

		if( class_exists( $reg->class ) ){
			$current = new $reg->class;

			if( $current instanceof $reg->class ){
				return $current;

			}

		}
		return false;

	}

	private function is_registered( $slug ){

		return ( is_array( $this->registered ) && is_string( $slug ) && isset( $this->registered[$slug] ) );

	}

	public function get( $slug ){

		return ( $this->is_registered( $slug ) ? $this->registered[$slug] : false );

	}

	public function run(){

		$path = $this->base_path;

		require_once "{$path}includes/includes.php";
		$this->autoload( 'Comet_Includes' );
		$this->autoload( 'Comet_Ajax' );

		if( is_admin() ){
			require_once "{$path}admin/admin.php";
			$this->autoload( 'Comet_Admin' );
			return;

		}
		$this->autoload( 'Comet_Frontend' );

	}

	/**
	 * The name of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_name() {
		return $this->name;

	}

	/**
	 * The slug of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The slug of the plugin.
	 */
	public function get_slug() {
		return $this->slug;

	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;

	}

	/**
	 * Retrieve the description of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The description of the plugin.
	 */
	public function get_description(){
		return $this->description;

	}

}
