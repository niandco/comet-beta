<?php
namespace Comet;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Render{

	private $meta = false;

	private function is_set( $entry ){
		return ( is_array( $this->meta ) && is_string( $entry ) && isset( $this->meta[$entry] ) );

	}

	private function has_connection( $entry ){

		return ( $this->is_set( $entry ) && is_array( $this->meta[$entry] ) && count( $this->meta[$entry] ) > 0 );

	}

	private function build_data( $id ){
		$_data = [
			'el'	=> []
		];

		if( !is_array( $this->meta ) || !isset( $this->meta['elements'] ) || !( $id = comet_parse_id( $id ) ) ){
			return $_data;

		}

		if( !isset( $this->meta['elements'][$id] ) || !is_array( $this->meta['elements'][$id] ) ){
			return $_data;

		}
		$_data['el'] = $this->meta['elements'][$id];

		if( !isset( $this->meta['items'] ) || !is_array( $this->meta['items'] ) || !isset( $_data['el']['_items'] ) ){
			return $_data;

		}

		if( !is_array( $ids = comet_parse_ids( $_data['el']['_items'] ) ) || ( $length = count( $ids ) ) < 1 ){
			return $_data;

		}
		$_data['items'] = [];

		for( $i = 0; $i < $length; $i++ ){

			if( !( $idsa = comet_parse_id( $ids[$i] ) ) || !isset( $this->meta['items'][$idsa] ) ){
				continue;

			}
			$_data['items'][$idsa] = $this->meta['items'][$idsa];

		}
		return $_data;

	}

	private function background( $meta = array() ){

		$meta = is_array( $meta ) ? $meta : array();
		$_a_true = [ 'true', true ];
		$url = isset( $meta['vurl'] ) && is_string( $meta['vurl'] ) ? trim( strip_tags( $meta['vurl'] ) ) : '';
		$output = '<div class="cpb-backgroundComponents">';

		if( isset( $meta['vid'] ) && in_array( $meta['vid'], $_a_true ) && !empty( $url ) ){
			$output .= '<video class="cpb-backgroundVideo" src="' . esc_url( $url ) . '" muted loop autoplay preload="auto"></video>';

		}

		if( isset( $meta['ov'] ) && in_array( $meta['ov'], $_a_true ) && isset( $meta['ovc'] ) ){
			$output .= '<div class="cpb-backgroundOverlay"></div>';

		}
		$output .= '</div>';
		return $output;

	}

	public function render( $meta ){

		if( !is_array( $meta ) || !isset( $meta['_sections'] ) ){
			return '';

		}
		$this->meta = $meta;

		if( !$this->has_connection( 'sections' ) || !is_array( $ids = comet_parse_ids( $meta['_sections'] ) ) ){
			return '';

		}
		$output = '';

		for( $a = 0; $a < count( $ids ); $a++ ){

			$output .= $this->section( $ids[$a] );

		}
		return $output;

	}

	private function section( $id ){

		if( !isset( $this->meta['sections'][$id] ) || !is_array( $meta = $this->meta['sections'][$id] ) ){
			return '';

		}
		$output = "<div class=\"cpb-section-{$id} cpb-section\" data-id=\"{$id}\">";
		$output .= '<div class="cpb-rows cpb-sectionContent">';
		$output .= $this->background( $meta );

		if( $this->has_connection( 'rows' ) && isset( $meta['_rows'] ) && is_array( $ids = comet_parse_ids( $meta['_rows'] ) ) ){

			for( $a = 0; $a < count( $ids ); $a++ ){
				$output .= $this->row( $ids[$a] );

			}


		}
		$output .= '</div>';
		$output .= '</div>';

		return $output;

	}

	private function row( $id ){

		if( !isset( $this->meta['rows'][$id] ) || !is_array( $meta = $this->meta['rows'][$id] ) ){
			return '';

		}
		$output = "<div class=\"cpb-row-{$id} cpb-row\" data-id=\"{$id}\">";
		$output .= '<div class="cpb-rowContent" data-ncol="0">';
		$output .= $this->background( $meta );

		if( $this->has_connection( 'columns' ) && isset( $meta['_columns'] ) && is_array( $ids = comet_parse_ids( $meta['_columns'] ) ) ){

			for( $a = 0; $a < count( $ids ); $a++ ){
				$output .= $this->column( $ids[$a] );

			}


		}
		$output .= '</div>';
		$output .= '</div>';

		return $output;

	}

	private function column( $id ){

		if( !isset( $this->meta['columns'][$id] ) || !is_array( $meta = $this->meta['columns'][$id] ) ){
			return '';

		}
		$output = "<div class=\"cpb-column-{$id} cpb-column\" data-id=\"{$id}\">";
		$output .= '<div class="cpb-columnContent">';
		$output .= $this->background( $meta );

		if( $this->has_connection( 'elements' ) && isset( $meta['_elements'] ) && is_array( $ids = comet_parse_ids( $meta['_elements'] ) ) ){

			for( $a = 0; $a < count( $ids ); $a++ ){
				$output .= $this->element( $ids[$a] );

			}


		}
		$output .= '</div>';
		$output .= '</div>';

		return $output;

	}

	private function element( $id ){

		if( !isset( $this->meta['elements'][$id] ) || !is_array( $meta = $this->meta['elements'][$id] ) ){
			return '';

		}

		if( !isset( $meta['_type'] ) && !is_string( $meta['_type'] ) ){
			return '';

		}
		$slug = trim( $meta['_type'] );

		if( !( $element = comet_get_element( $slug ) ) || !method_exists( $element, 'render' ) ){
			return '';

		}
		$output = "<div class=\"cpb-element cpb-element-{$slug} cpb-elementNode{$id}\" data-id=\"{$id}\">";
		$output .= '<div class="cpb-elementContent">';
		$output .= $element->render( $this->build_data( $id ) );
		$output .= '</div>';
		$output .= '</div>';

		return $output;

	}

}
?>