<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class text extends Comet_Element{

	public function __construct(){

		$this->set_element( 'text', __( 'Text', 'comet'), 'cico-text' );

	}

	public function render( $data ){

		$edata = is_array( $data['el'] ) ? $data['el'] : [];
		$content = isset( $edata['content'] ) && is_string( $edata['content'] ) ? $edata['content'] : ''; 
		$classes = 'cpb-text cpb-wrapper ' . Comet_Utils::get_alignment( isset( $edata['alg'] ) ? $edata['alg'] : 'l' );
		$tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre' ];
		$tag = 'p';

		if( isset( $edata['tag'] ) && is_string( $edata['tag'] ) ){
			$tag = strtolower( trim( $edata['tag'] ) );

			if( !in_array( $tag, $tags ) ){
				$tag = 'p';

			}

		}
		$output = "<div class=\"{$classes}\">";
		$output .= "<{$tag}>{$content}</{$tag}>";
		$output .= "</div>";

		return $output;

	}

	public function view(){

		?>

		const content = ui.firstChild;
		const classes = [ 'cpb-text', 'cpb-wrapper', comet.helpers.sanitizeAlignment( data.el.alg ) ];

		content.innerHTML = '<div class="' + comet.helpers.joinClasses( classes ) + '"><span></span></div>';

		comet.html.renderEditor( content.firstChild.firstChild, {
			id: id,
			slug: 'content',
			content: data.el.content,
			tag: data.el.tag
		});

		<?php

	}

	public function css(){
		?>
		var css = '';
		var tmp, tmp1, o;

		if( ( tmp = comet.helpers.sanitizeNumber( { value: data.el.lh, float: true } ) ) !== null && tmp > 0 ){
			css += comet.css.property( 'line-height', tmp );

		}

		if( ( tmp = comet.helpers.sanitizeNumber( data.el.ls ) ) !== null ){
			css += comet.css.property( 'letter-spacing', tmp + 'px' );

		}

		if( ( tmp = comet.helpers.sanitizeColor( data.el.tc ) ) !== '' ){
			css += comet.css.property( 'color', tmp );

		}

		if( comet.helpers.isString( data.el.fo ) && data.el.fo !== '0' ){
			css += comet.css.property( 'font-family', data.el.fo.trim() );

		}

		css += comet.css.textShadow({
			color: data.el.tsc,
			blur: data.el.tsb,
			x: data.el.tsh,
			y: data.el.tsv

		});

		if( ( tmp = comet.helpers.sanitizeColor( data.el.bg ) ) !== '' ){
			css += comet.css.property( 'background', tmp );

		}

		css += comet.css.border({
			style: data.el.bs,
			color: data.el.bc,
			top: data.el.brt,
			right: data.el.brr,
			bottom: data.el.brb,
			left: data.el.brl
		});
		css += comet.css.padding( data.el.pdt, data.el.pdr, data.el.pdb, data.el.pdl, 'px', 'px' );
		css += comet.css.borderRadius( data.el.rdt, data.el.rdr, data.el.rdb, data.el.rdl );
		css += comet.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' );
		o = comet.css.element( id, '.cpb-text.cpb-wrapper', css );


		css = '';

		if( ( tmp = comet.helpers.sanitizeNumber( data.el.fs ) ) !== null && tmp > 0 ){
			css += comet.css.property( 'font-size', tmp + 'px' );

		}

		if( ( tmp = comet.helpers.sanitizeNumber( data.el.fw ) ) !== null && tmp > 99 && tmp < 901 ){
			css += comet.css.property( 'font-weight', tmp );

		}
		o += comet.css.element( id, '.cpb-text.cpb-wrapper *', css );

		tmp = comet.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' );
		tmp1 = comet.css.padding( data.el.pdtt, data.el.pdrt, data.el.pdbt, data.el.pdlt, 'px', 'px' );
		o += comet.css.element( id, '.cpb-text.cpb-wrapper', ( tmp + tmp1 ), 't' );
		o += comet.css.responsive( 't', comet.css.element( id, '.cpb-text.cpb-wrapper', ( tmp + tmp1 ) ) );

		tmp = comet.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' );
		tmp1 = comet.css.padding( data.el.pdtm, data.el.pdrm, data.el.pdbm, data.el.pdlm, 'px', 'px' );
		o += comet.css.element( id, '.cpb-text.cpb-wrapper', ( tmp + tmp1 ), 'm' );
		o += comet.css.responsive( 'm', comet.css.element( id, '.cpb-text.cpb-wrapper', ( tmp + tmp1 ) ) );
		return o;

		<?php

	}

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'text', __( 'Text', 'comet' ) );

		$this->register_field( $tid, $sid, 'tag', [
			'label'		=> __( 'HTML Tag', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'p',
			'values'	=> [
				'p'				=> __( 'Paragraph', 'comet' ),
				'h1'			=> __( 'Heading 1', 'comet' ),
				'h2'			=> __( 'Heading 2', 'comet' ),
				'h3'			=> __( 'Heading 3', 'comet' ),
				'h4'			=> __( 'Heading 4', 'comet' ),
				'h5'			=> __( 'Heading 5', 'comet' ),
				'h6'			=> __( 'Heading 6', 'comet' ),
				'blockquote'	=> __( 'Blockquote', 'comet' ),
				//'code'		=> 'code',
				'pre'			=> __( 'Preformatted', 'comet' ),
			]
		] );

		$this->register_field( $tid, $sid, 'alg', [
			'label'		=> __( 'Alignment', 'comet' ),
			'type'		=> 'radio',
			'std'		=> 'l',
			'values'		=> [
				'l'		=> [
					'title'		=> __( 'Left', 'comet' ),
					'icon'		=> 'cico cico-align-left'
				],
				'c'		=> [
					'title'		=> __( 'Center', 'comet' ),
					'icon'		=> 'cico cico-align-center'
				],
				'r'		=> [
					'title'		=> __( 'Right', 'comet' ),
					'icon'		=> 'cico cico-align-right'
				]
			]
		] );

		$this->register_field( $tid, $sid, 'content', [
			'label'		=> __( 'Content', 'comet' ),
			'type'		=> 'editor'
		] );


		$tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

		$sid = $this->register_section( $tid, 'typography', __( 'Typography', 'comet' ) );

		$this->register_field( $tid, $sid, 'tc', [
			'label'		=> __( 'Color', 'comet' ),
			'type'		=> 'color',
		] );

		$this->register_field( $tid, $sid, 'fo', [
			'label'		=> __( 'Font', 'comet' ),
			'type'		=> 'select',
			'std'		=> '',
			'values'	=> Comet_Utils::fonts()
		] );

		$this->register_field( $tid, $sid, 'fs', [
			'label'		=> __( 'Size', 'comet' ),
			'type'		=> 'range',
			'std'		=> '',
			'min'		=> '10',
			'max'		=> '200',
			'step'   	=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'fw', [
			'label'		=> __( 'Weight', 'comet' ),
			'desc'		=> __( 'The weight property sets how thick or thin characters in text should be displayed.', 'comet' ),
			'type'		=> 'select',
			'std'		=> '400',
			'values'	=> Comet_Utils::weight()
		] );

		$this->register_field( $tid, $sid, 'lh', [
			'label'		=> __( 'Line height', 'comet' ),
			'desc'		=> __( 'The line height property specifies the height of a line.', 'comet' ),
			'type'		=> 'range',
			'std'		=> '1',
			'min'		=> '1',
			'max'		=> '5',
			'step'		=> '0.1'
		] );

		$this->register_field( $tid, $sid, 'ls', [
			'label'		=> __( 'Letter spacing', 'comet' ),
			'type'		=> 'range',
			'std'		=> '',
			'min'		=> '-5',
			'max'		=> '20',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$sid = $this->register_section( $tid, 'shadow', __( 'Text shadow', 'comet' ) );

		$this->register_field( $tid, $sid, 'tsc', [
			'label'		=> __( 'Color', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'tsb', [
			'label'		=> __( 'Blur', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '0',
			'max'		=> '50',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'tsv', [
			'label'		=> __( 'Vertical', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '-50',
			'max'		=> '50',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'tsh', [
			'label'		=> __( 'Horizontal', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '-50',
			'max'		=> '50',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$sid = $this->register_section( $tid, 'background', __( 'Background', 'comet' ) );

		$this->register_field( $tid, $sid, 'bg', [
			'label'		=> __( 'Color', 'comet' ),
			'type'		=> 'color'
		] );

		$sid = $this->register_section( $tid, 'border', __( 'Border', 'comet' ) );

		$this->register_field( $tid, $sid, 'br', Comet_Utils::numbers( __( 'Width', 'comet' ) ) );

		$this->register_field( $tid, $sid, 'bs', [
			'label'		=> __( 'Style', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'none',
			'values'	=> Comet_Utils::borderStyle()
		] );

		$this->register_field( $tid, $sid, 'bc', [
			'label'		=> __( 'Color', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'rd', Comet_Utils::numbers( __( 'Radius', 'comet' ) ) );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'pd', Comet_Utils::numbers( __( 'Padding', 'comet' ), '', '0', 'true' ) );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', 'true' ) );

	}

}
?>