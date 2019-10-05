<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;
	
}

class Comet_Layout {

	private $base_path = COMET_PATH . 'includes/layout/';

	private $layout = array();

	public function __construct(){

		$path = $this->base_path;

		$this->set( '\Comet\Library\Layout\Section', "{$path}section.php" );
		$this->set( '\Comet\Library\Layout\Row', "{$path}row.php" );
		$this->set( '\Comet\Library\Layout\Column', "{$path}column.php" );

	}

	private function set( $class, $file ){

        if( !( $type = $this->sanitize_type( $class ) ) || !is_string( $file ) || !file_exists( $file = trim( $file ) ) ){
            return false;

        }

        if( $this->type_exists( $type ) ){
        	return false;

        }
        require_once $file;

        if( class_exists( $class ) ){
        	$current = new $class;

        	if( !( $current instanceof $class ) ){
        		return false;

        	}

        }
        $this->layout[$type] = $current;
        return true;

	}

	public function length(){

		return ( is_array( $this->layout ) ? count( $this->layout ) : 0 );

	}

	public function has_types(){

		return ( $this->length() > 0 );

	}

	public function type_exists( $type ){

		return ( $this->has_types() && isset( $this->layout[$type] ) );

	}

	public function unset( $type ){

		if( $this->type_exists( $type ) ){
			unset( $this->layout[$type] );
			return true;

		}
		return false;

	}

	public function reset(){
		$this->layout = array();

	}

	private function sanitize_type( $type ){

        if( !is_string( $type ) ){
            return false;

        }
        $type = strip_tags( $type ) ;
        $type = trim( strtolower( str_replace( '\Comet\Library\Layout\\', '' , $type ) ) );

        if( strlen( $type ) < 1 || preg_match( '/[^a-z\_]/i', $type ) ){
            return false;

        }
		return $type;

	}

	public function get_type_data( $type ){

		if( !$this->type_exists( $type ) ){
			return false;

		}
		$tabs = array();
		$Type = $this->get_type( $type );
		$name = ( method_exists( $Type, 'get_name' ) && is_string( $name = $Type->get_name() ) ? $name : '' );

		if( method_exists( $Type, 'get_data' ) ){

			$tabs = ( is_array( $tabs = $Type->get_data() ) ? $tabs : array() );

		}

		return array(
			'name'	=> $name,
			'tabs'	=> $tabs
		);


	}

	public function get_types_data(){

		if( !$this->has_types() ){
			return false;

		}
		$_types = [];

		foreach( $this->layout as $type => $class ){

			if( !( $data = $this->get_type_data( $type ) ) ){
				continue;

			}
			$_types[$type] = $data;

		}
		return $_types;

	}

	public function get_type( $slug ){

		$slug = is_string( $slug ) ? strtolower( trim( $slug ) ) : '';

		return isset( $this->layout[$slug] ) ? $this->layout[$slug] : false; 

	}

}
?>