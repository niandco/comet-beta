<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-utils.php';

class Comet_Register extends Comet_Utils {

	protected $data = [];

	private $items = [];

	private function has_tab( $tab_id, $toItems = false ){

		$cData = $toItems ? $this->items : $this->data;

		return ( is_array( $cData ) && $tab_id >= 0 && isset( $cData[$tab_id] ) && is_array( $cData[$tab_id] ) );

	}

	private function has_section( $tab_id, $section_id, $toItems = false ){

		$cData = $toItems ? $this->items : $this->data;

		return ( $this->has_tab( $tab_id, $toItems ) && isset( $cData[$tab_id]['sections'] ) && is_array( $cData[$tab_id]['sections'] ) && $section_id  >= 0 && isset( $cData[$tab_id]['sections'][$section_id] ) && is_array( $cData[$tab_id]['sections'][$section_id] ) );

	}

	private function sanitize_slug( $slug ){

		return ( is_string( $slug ) ? strtolower( trim( $slug ) ) : '' );

	}

	protected function set_data( $dt, $toItems = false ){

		$toItems = isset( $toItems ) && is_bool( $toItems ) ? $toItems : false;

		if( !is_array( $dt ) ){
			return false;

		}

		if( $toItems ){
			$this->items = $dt;
			return true;

		}
		$this->data = $dt;
		return true;

	}

	protected function push_items( $name ){

		$slug = 'items';

		if( !is_array( $this->items ) || count( $this->items ) < 1 ){
			return false;

		}

		if( !is_array( $this->data ) ){
			$this->data = [];

		}

		$this->data[$slug] = [
			'slug'		=> $slug,
			'name'		=> ( is_string( $name ) ? trim( $name ) : '' ),
			'tabs'		=> $this->items
		];
		return $slug;


	}

	protected function register_tab( $slug, $name, $toItems = false ){

		$slug = $this->sanitize_slug( $slug );
		$toItems = isset( $toItems ) && is_bool( $toItems ) ? $toItems : false;

		if( empty( $slug ) || $slug === 'items' ){
			return false;

		}
		$cData = $toItems ? $this->items : $this->data;

		if( !is_array( $this->data ) ){
			$cData = [];

		}

		foreach( $cData as $id => $tab ){

			if( $slug === $tab['slug'] ){
				return $id;

			}

		}
		array_push( $cData, [
			'slug'		=> $slug,
			'name'		=> ( is_string( $name ) ? trim( $name ) : '' ),
			'sections'	=> []
		] );
		$this->set_data($cData, $toItems );
		return count( $cData ) - 1;

	}

	protected function register_section( $tab_id, $slug, $name, $toItems = false ){

		$tab_id = intval( $tab_id );
		$slug = $this->sanitize_slug( $slug );
		$toItems = isset( $toItems ) && is_bool( $toItems ) ? $toItems : false;

		if( empty( $slug ) || !$this->has_tab( $tab_id, $toItems ) ){
			return false;

		}
		$cData = $toItems ? $this->items : $this->data;

		if( !isset( $cData[$tab_id]['sections'] ) || !is_array( $cData[$tab_id]['sections'] ) ){
			$cData[$tab_id]['sections'] = [];

		}

		foreach( $cData[$tab_id]['sections'] as $id => $section ){

			if( $slug === $section['slug'] ){
				return $id;

			}

		}
		array_push( $cData[$tab_id]['sections'], [
			'slug'		=> $slug,
			'name'		=> ( is_string( $name ) ? trim( $name ) : '' ),
			'fields'	=> []
		] );
		$this->set_data( $cData, $toItems );
		return count( $cData[$tab_id]['sections'] ) - 1;

	}

	protected function register_field( $tab_id, $section_id, $slug, $options = [], $toItems = false ){

		$tab_id = intval( $tab_id );
		$section_id = intval( $section_id );
		$slug = $this->sanitize_slug( $slug );
		$toItems = isset( $toItems ) && is_bool( $toItems ) ? $toItems : false;

		if( empty( $slug ) || !$this->has_section( $tab_id, $section_id, $toItems ) ){
			return false;

		}
		$cData = $toItems ? $this->items : $this->data;

		if( !isset( $cData[$tab_id]['sections'][$section_id]['fields'] ) && !is_array( $cData[$tab_id]['sections'][$section_id]['fields'] ) ){
			$cData[$tab_id]['sections'][$section_id] += [ 'fields' => [] ];

		}
		$cData[$tab_id]['sections'][$section_id]['fields'] += [ $slug => $options ];
		$this->set_data( $cData, $toItems );

		return true;

	}

	protected function deregister_tab( $tab_id ){

		$tab_id = intval( $tab_id );

		if( $this->has_tab( $tab_id ) ){
			unset( $this->data[$tab_id] );
			return true;

		}
		return false;

	}

	protected function deregister_section( $tab_id, $section_id ){

		$tab_id = intval( $tab_id );
		$section_id = intval( $section_id );

		if( $this->has_section( $tab_id, $section_id ) ){
			unset( $this->data[$tab_id]['sections'][$section_id] );
			return true;

		}
		return false;

	}

	protected function deregister_field( $tab_id, $section_id, $slug ){

		$tab_id = intval( $tab_id );
		$section_id = intval( $section_id );
		$slug = $this->sanitize_slug( $slug );

		if( empty( $slug ) || !$this->has_section( $tab_id, $section_id ) ){
			return false;

		}
		
		if( is_array( $this->data[$tab_id]['sections'][$section_id]['fields'] ) && isset( $this->data[$tab_id]['sections'][$section_id]['fields'][$slug] ) ){
			unset( $this->data[$tab_id]['sections'][$section_id]['fields'][$slug] );

		}
		return true;

	}
	
}
?>