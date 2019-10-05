<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}

final class Comet_Settings {

	private $options = null;

	private $settings = [];

	private $slugs = [];

	public function __construct(){

		$this->options = get_option( 'comet_settings' );
		$this->register_sections();
		$this->register_settings();


	}

	final public function response(){

		return [
			'save'		=> __( 'Save', 'comet' ),
			'options'	=> $this->options,
			'settings'	=> $this->get_settings(),
		];

	}

	final public function get_settings(){
		return $this->settings;

	}

	final private function register_sections(){

		$this->set_section(
			'post_types',
			[
				'label'		=> __( 'Post Types', 'comet' ),
				'desc'		=> __( 'Check post types you want Comet works with.', 'comet' ),
			]
		);

		$this->set_section(
			'uninstall',
			[
				'label'		=> __( 'Uninstall (Deep)', 'comet' ),
				'desc'		=> __( 'Check the box to completely remove all data on uninstall.', 'comet' ),
			]
		);

	}

	final private function register_settings(){
		$post_types = comet_get_post_types( 'apt_' );

		foreach( $post_types as $key => $value ){

			$this->set_setting(
				'post_types',
				$key,
				[
					'label'	=> $value,
					'type'	=> 'checkbox',
					'std'	=> '0'
				]
			);

		}

		$this->set_setting(
			'uninstall',
			'uninstall',
			[
				'label'		=> __( 'Remove all data on uninstall ?', 'comet' ),
				'type'		=> 'checkbox',
				'std'		=> '0'
			]
		);

	}

	final private function sanitize_slug( $slug ){
		$slug = strtolower( $slug );
		$slug = preg_replace( '/[^a-z_]/', '', $slug );

		return !strlen( $slug ) ? false : $slug;

	}

	final private function slug_exists( $slug ){

		if( !$this->has_settings() ){
			$this->reset();
			return false;

		}
		return in_array( $slug, $this->slugs );

	}

	final private function section_exists( $section ){

		if( !$this->has_settings() ){
			$this->reset();
			return false;

		}
		return isset( $this->settings[$section] );


	}

	final private function has_settings(){

		return is_array( $this->settings ) && is_array( $this->slugs );

	}

	final private function reset(){
		$this->settings = [];
		$this->slugs = [];

	}

	final private function sanitize_type( $type ){
		$type = trim( strtolower( $type ) );
		$types = [ 'checkbox', 'text', 'textarea', 'radio', 'select' ];

		return !in_array( $type, $types ) ? false : $type;

	}

	final private function set_setting( $section, $slug, $data ){
		$section = $this->sanitize_slug( $section );
		$slug = $this->sanitize_slug( $slug );

		if( !$section || !$this->section_exists( $section ) ){
			return;

		}

		if( !$slug || $this->slug_exists( $slug ) || !is_array( $data ) ){
			return;

		}

		if( !is_array( $data ) || !isset( $data['type'] ) || !( $data['type'] = $this->sanitize_type( $data['type'] ) ) ){
			return;

		}

		if( isset( $data['label'] ) ){
			$data['label'] = is_string( $data['label'] ) ? trim( strip_tags( $data['label' ] ) ) : '';

		}

		if( isset( $data['desc'] ) ){
			$data['desc'] = is_string( $data['desc'] ) ? trim( strip_tags( $data['desc' ], '<a><b><i><strong><u><span>' ) ) : '';

		}
		$this->slugs[] = $slug;
		$this->settings[$section]['settings'][$slug] = $data;

	}


	final private function set_section( $section, $data ){
		$section = $this->sanitize_slug( $section );

		if( !$section || $this->section_exists( $section ) || !is_array( $data ) ){
			return;

		}
		if( isset( $data['label'] ) ){
			$data['label'] = is_string( $data['label'] ) ? trim( strip_tags( $data['label' ] ) ) : '';

		}

		if( isset( $data['desc'] ) ){
			$data['desc'] = is_string( $data['desc'] ) ? trim( strip_tags( $data['desc' ], '<a><b><i><strong><u><span>' ) ) : '';

		}
		$data['settings'] = [];
		$this->settings[$section] = $data;

	}

}
?>
