<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class icon extends Comet_Element {

	public function __construct(){

		$this->set_element( 'icon', __( 'Icon', 'comet'), 'cico-icon' );

	}

	public function render( $data ){

		$edata = is_array( $data['el'] ) ? $data['el'] : [];
		$icon = isset( $edata['icon'] ) ? comet_get_svgicon( $edata['icon'] ) : '';
		$url = isset( $edata['url'] ) && is_string( $edata['url'] ) ? esc_url( trim( strip_tags( $edata['url'] ) ) ) : '';
		$tag = 'div';
		$classes = 'cpb-icon cpb-wrapper ' . Comet_Utils::get_alignment( isset( $edata['alg'] ) ? $edata['alg'] : 'c' );

		$output = "<div class=\"{$classes}\">";

		$attr = ' class="cpb-icon cpb-inner"';

		if( $url !== '' ){
			$tag = 'a';
			$attr .= " href=\"{$url}\"";

			if( isset( $edata['tar'] ) && Comet_Utils::is_enabled( $edata['tar'] ) ){
				$attr .= ' target="_blank"';

			}

		}
		$output .= "<{$tag}{$attr}>{$icon}</{$tag}>";
		$output .= '</div>';

		return $output;

	}

	public function view(){

		?>

		const content = ui.firstChild;
		const icon = comet.helpers.isString( data.el.icon ) ? data.el.icon.trim() : '';
		const url = comet.helpers.isString( data.el.url ) ? ( comet.helpers.stripTags( data.el.url ) ).trim() : '';
		var tag = 'div';
		var wrapper = false;
		var attr, classes;

		if( icon === '' ){
			content.innerHTML = comet.html.renderPlaceholder();
			return;

		}
		classes = 'cpb-icon cpb-wrapper';
		classes += ' ' + comet.helpers.sanitizeAlignment( data.el.alg );
		content.innerHTML = '<div class="' + classes + '"></div>';


		attr = ' class="cpb-icon cpb-inner"';

		if( url !== '' ){
			tag = 'a';
			attr += ' href="' + comet.helpers.escUrl( url ) + '"';

			if( comet.helpers.inArray( [ 'true', '1', 'TRUE', 'True' ], data.el.tar ) ){
				attr += ' target="_blank"';

			}

		}
		content.firstChild.innerHTML = '<' + tag + attr + '>' + comet.html.renderIcon( icon ) + '</' + tag + '>';

		<?php

	}

	public function css(){
		?>
		var css = '';
		var o, tmp;

		if( ( tmp = comet.helpers.sanitizeColor( data.el.bgc ) ) !== '' ){
			css += comet.css.property( 'background', tmp );

		}

		if( ( tmp = comet.helpers.sanitizeColor( data.el.ic ) ) !== '' ){
			css += comet.css.property( 'color', tmp );

		}
		css += comet.css.border({
			color: data.el.bc,
			style: data.el.bs,
			top: data.el.brt,
			right: data.el.brr,
			bottom: data.el.brb,
			left: data.el.brl,

		});
		css += comet.css.borderRadius( data.el.rdt, data.el.rdr, data.el.rdb, data.el.rdl );

		if( ( tmp = comet.helpers.sanitizeNumber({ value: data.el.pd, min: 0, max: 100 }) ) !== null || tmp > 0 ){
			css += comet.css.property( 'padding', tmp + 'px' );

		}
		o = comet.css.element( id, '.cpb-icon.cpb-inner', css );

		if( ( tmp = comet.helpers.sanitizeNumber({ value: data.el.isi, min: 20, max: 200 }) ) !== null ){
			o += comet.css.element( id, '.cpb-icon.cpb-inner svg', comet.css.property( 'width', tmp + 'px' ) );

		}

		if( ( tmp = comet.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-icon.cpb-wrapper', tmp );

		}

		if( ( tmp = comet.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-icon.cpb-wrapper', tmp, 't' );
			o += comet.css.responsive( 't', comet.css.element( id, '.cpb-icon.cpb-wrapper', tmp ) );

		}

		if( ( tmp = comet.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-icon.cpb-wrapper', tmp, 'm' );
			o += comet.css.responsive( 'm', comet.css.element( id, '.cpb-icon.cpb-wrapper', tmp ) );

		}
		return o;
		<?php

	}

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'icon', __( 'Icon', 'comet' ) );

		$this->register_field( $tid, $sid, 'icon', [
			'label'  => __( 'Icon', 'comet' ),
			'type'   => 'icon'
		] );

		$this->register_field( $tid, $sid, 'isi', [
			'label' => __( 'Size', 'comet' ),
			'type'  => 'range',
			'min'   => '20',
			'max'   => '200',
			'std'   => '30',
			'step'  => '1',
			'unit'  => 'px'
		] );

		$this->register_field( $tid, $sid, 'alg', [
			'label'  => __( 'Alignment', 'comet' ),
			'type'   => 'radio',
			'std'    => 'c',
			'values' => [
				'l' => [
					'title' => __( 'Left', 'comet' ),
					'icon'  => 'cico cico-align-left'
				],
				'c' => [
					'title' => __( 'Center', 'comet' ),
					'icon'  => 'cico cico-align-center'
				],
				'r' => [
					'title' => __( 'Right', 'comet' ),
					'icon'  => 'cico cico-align-right'
				],
			]
		] );

		$sid = $this->register_section( $tid, 'link', __( 'Link', 'comet' ) );

		$this->register_field( $tid, $sid, 'url', [
			'label' => __( 'Link', 'comet' ),
			'type'  => 'text'
		] );

		$this->register_field( $tid, $sid, 'tar', [
			'label' => __( 'Open in a new tab', 'comet' ),
			'type'  => 'checkbox',
			'std'   => 'true'
		] );

		$tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

		$sid = $this->register_section( $tid, 'colors', __( 'Colors', 'comet' ) );

		$this->register_field( $tid, $sid, 'ic', [
			'label' => __( 'Icon', 'comet' ),
			'type'  => 'color'
		] );

		$this->register_field( $tid, $sid, 'bgc', [
			'label' => __( 'Background', 'comet' ),
			'type'  => 'color'
		] );

		$sid = $this->register_section( $tid, 'border', __( 'Border', 'comet' ) );

		$this->register_field( $tid, $sid, 'br', Comet_Utils::numbers( __( 'Width', 'comet' ) ) );

		$this->register_field( $tid, $sid, 'bs', [
			'label'  => __( 'Style', 'comet' ),
			'type'   => 'select',
			'std'    => 'solid',
			'values' => Comet_Utils::borderStyle()
		] );

		$this->register_field( $tid, $sid, 'bc', [
			'label' => __( 'Color', 'comet' ),
			'type'  => 'color'
		] );

		$this->register_field( $tid, $sid, 'rd', Comet_Utils::numbers( __( 'Radius', 'comet' ) ) );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'pd', [
			'label' => __( 'Padding', 'comet' ),
			'type'  => 'range',
			'min'   => '0',
			'max'   => '50',
			'std'   => '20',
			'step'  => '1',
			'unit'  => 'px'
		] );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', true ) );

	}

}
?>