<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Pages {

	protected $pages = array();

	private function class_name( $class_name ){

        if( !is_string( $class_name ) ){
            return false;

        }
        $class_name = trim( strip_tags( $class_name ) );
        $class_name = str_replace( '\Comet\Admin\Dashboard\\', '' , $class_name );

        if( strlen( $class_name ) < 1 || preg_match( '/[^a-z\_]/i', $class_name ) ){
            return false;

        }
		return $class_name;

	}

    protected function set( $class, $file ){

        if( !( $class_name = $this->class_name( $class ) ) || !is_string( $file ) || !file_exists( $file = trim( $file ) ) ){
            return false;

        }
        require_once $file;

        if( !class_exists( $class ) ){
            return false;
        }

        if( !method_exists( ( $current = new $class ), 'instance' ) || !method_exists( $current, 'get_slug' ) ){
            return false;

        }

        if( !( $slug = $current->get_slug() ) || $this->page_exists( $slug ) ){
            return false;

        }
        $this->pages[$slug] = $current;
        return true;

    }

    public function unset( $slug ){

        if( !$this->page_exists( $slug ) ){
            return false;

        }
        unset( $this->pages[$slug] );
        return true;

    }

    public function page_exists( $slug ){

        return ( is_string( $slug ) && isset( $this->pages[$slug] ) );

    }

    public function pages(){

        return $this->pages;

    }


    public function page( $slug ){

        return ( $this->page_exists( $slug ) ? $this->pages[$slug] : false );

    }

}
?>