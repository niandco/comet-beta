<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class button extends Comet_Element {

	public function __construct(){

		$this->set_element( 'button', __( 'Button', 'comet'), 'cico-click' );

	}

	public function render( $data ){

		$edata = is_array( $data['el'] ) ? $data['el'] : [];
		$text = isset( $edata['text'] ) && is_string( $edata['text'] ) ? trim( strip_tags( $edata['text'] ) ) : '';
		$icon = isset( $edata['icon'] ) && is_string( $edata['icon'] ) ? comet_get_svgicon( $edata['icon'] ) : '';

		$classe = 'cpb-button cpb-wrapper ' . Comet_Utils::get_alignment( isset( $edata['alg'] ) ? $edata['alg'] : 'c' );

		$output = "<div class=\"{$classe}\">";
		$ca = 'cpb-link';

		if( isset( $edata['ani'] ) && is_string( $edata['ani'] ) ){

			switch( $animation = strtolower( trim( $edata['ani'] ) ) ){
				case 'none':
				break;

				case 'stt':
				case 'stl':
				case 'stb':
				case 'str':
				$ca += " cpb-hvrbt cpb-hvrbt-{$animation}";
				break;

				default:

				if( in_array( $animation, [ 'pulse', 'tada' ] ) ){
					$ca .= ' cpb-animated cpb-efInfinite';

				}
				$ca .= " cpb-ef-{$animation}";
				break;

			}

		}
		$url = isset( $edata['link'] ) && is_string( $edata['link'] ) ? esc_url( trim( strip_tags( $edata['link'] ) ) ) : '#';
		$tar = isset( $edata['tar'] ) && Comet_Utils::is_enabled( $edata['tar'] ) ? ' target="_blank"' : '';
		$dir = isset( $edata['ipos'] ) && is_string( $edata['ipos'] ) && $edata['ipos'] === 'r' ? 'r' : 'l';

		$output .= "<a class=\"{$ca}\" href=\"{$url}\"{$tar}>";

		if( $dir === 'l' && $icon !== '' ){
			$output .= "<span class=\"cpb-icon\">{$icon}</span>";

		}
		$output .= "<span class=\"cpb-title\">{$text}</span>";

		if( $dir === 'r' && $icon !== '' ){
			$output .= "<span class=\"cpb-icon\">{$icon}</span>";

		}
		$output .= '</a>';
		$output .= '</div>';

		return $output;

	}

	public function view(){

		?>

		const content = ui.firstChild;
		const text = comet.helpers.isString( data.el.text ) ? ( comet.helpers.stripTags( data.el.text ) ).trim() : '';
		const icon = comet.helpers.isString( data.el.icon ) ? data.el.icon.trim() : '';
		var o, classe, ca, dir, tar, url, b_icon;


		if( text === '' && icon === '' ){
			content.innerHTML = comet.html.renderPlaceholder();
			return;

		}
		classe = 'cpb-button cpb-wrapper ' + comet.helpers.sanitizeAlignment( data.el.alg );

		o = '<div class="' + classe + '">';
		ca = 'cpb-link';

		if( comet.helpers.isString( data.el.ani ) && data.el.ani.length > 0 ){

			switch( data.el.ani = ( data.el.ani.trim() ).toLowerCase() ){
				case 'none':
				break;

				case 'stt':
				case 'stl':
				case 'stb':
				case 'str':
				ca += ' cpb-hvrbt cpb-hvrbt-' + data.el.ani;
				break;

				default:

				if( comet.helpers.inArray( [ 'pulse', 'tada' ], data.el.ani ) ){
					ca += ' cpb-animated cpb-efInfinite';

				}
				ca += ' cpb-ef-' + data.el.ani;
				break;

			}

		}
		url = comet.helpers.isString( data.el.link ) ? ( comet.helpers.stripTags( data.el.link ) ).trim() : '#';
		tar = comet.helpers.inArray( [ 'true', 'TRUE', 'True' ], data.el.tar ) ? ' target="_blank"' : '';
		dir = data.el.ipos === 'r' ? 'r' : 'l';

		o += '<a class="' + ca + '" href="' + comet.helpers.escUrl( url ) + '"' + tar + '>';

		if( dir === 'l' && icon !== '' ){
			o += '<span class="cpb-icon">' + comet.html.renderIcon( icon ) + '</span>';

		}
		o += '<span class="cpb-title">' + text + '</span>';

		if( dir === 'r' && icon !== '' ){
			o += '<span class="cpb-icon">' + comet.html.renderIcon( icon ) + '</span>';

		}
		o += '</a>';
		o += '</div>';
		content.innerHTML = o;

		<?php

	}

	public function css(){
		?>
		var o = '';
		var bg, abg, hsp, vsp, css, tmp;

		if( data.el.sty === 'g' ){
			bg = comet.css.gradient( 'linear', data.el.ang , data.el.gbg );
			abg = comet.css.gradient( 'linear', data.el.ang , data.el.ghbg );

		}else{
			bg = comet.helpers.sanitizeColor( data.el.bg );
			abg = comet.helpers.sanitizeColor( data.el.hbg );

		}
		vsp = comet.helpers.sanitizeNumber({ value: data.el.vsp, min: 0, max: 70 });
		hsp = comet.helpers.sanitizeNumber({ value: data.el.hsp, min: 0, max: 100 });

		if( ( tmp = comet.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-button.cpb-wrapper', tmp );

		}
		css = comet.css.padding( vsp, hsp, vsp, hsp, 'px', 'px' );

		if( ( tmp = comet.helpers.sanitizeNumber({ value: data.el.fs, min: 0 }) ) !== null ){
			css += comet.css.property( 'font-size', tmp + 'px' );

		}

		if( bg !== '' ){
			css += comet.css.property( 'background', bg );

		}

		if( ( tmp = comet.helpers.sanitizeColor( data.el.tc ) ) !== '' ){
			css += comet.css.property( 'color', tmp );

		}
		css += comet.css.border({
			color: data.el.bc,
			style: data.el.bs,
			top: data.el.brt,
			right: data.el.brr,
			bottom: data.el.brb,
			left: data.el.brl
		});

		css += comet.css.borderRadius( data.el.rdt, data.el.rdr, data.el.rdb, data.el.rdl );

		css += comet.css.boxShadow({
			x: data.el.sx,
			y: data.el.sy,
			blur: data.el.sbl,
			spread: data.el.ssp,
			color: data.el.shc,
			inset: data.el.sin

		});
		o += comet.css.element( id, '.cpb-button.cpb-wrapper .cpb-link', css );
		css = '';

		if( ( tmp = comet.helpers.sanitizeNumber({ value: data.el.is, min: 10, max: 70, default: 20 }) ) !== null ){
			css += comet.css.property( 'width', tmp + 'px' );

		}

		if( ( tmp = comet.helpers.sanitizeNumber({ value: data.el.isp, min: 0, max: 100 }) ) > 0 ){

			if( data.el.ipos === 'r' ){
				css += comet.css.property( 'margin-left', tmp + 'px' );

			}else{
				css += comet.css.property( 'margin-right', tmp + 'px' );

			}

		}
		o += comet.css.element( id, '.cpb-button.cpb-wrapper .cpb-icon', css );
		css = '';

		/* Hover */

		if( abg !== '' ){
			css += comet.css.property( 'background', abg );

		}

		if( ( tmp = comet.helpers.sanitizeColor( data.el.htc ) ) !== '' ){
			css += comet.css.property( 'color', tmp );

		}

		if( ( tmp = comet.helpers.sanitizeColor( data.el.hbc ) ) !== '' ){
			css += comet.css.property( 'border-color', tmp );

		}
		o += comet.css.element( id, '.cpb-button.cpb-wrapper .cpb-link:hover', css );

		if( ( tmp = comet.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-button.cpb-wrapper', tmp, 't' );
			o += comet.css.responsive( 't', comet.css.element( id, '.cpb-button.cpb-wrapper', tmp ) );

		}

		if( ( tmp = comet.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
			o += comet.css.element( id, '.cpb-button.cpb-wrapper', tmp, 'm' );
			o += comet.css.responsive( 'm', comet.css.element( id, '.cpb-button.cpb-wrapper', tmp ) );

		}
		return o;
		<?php

	}

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'button', __( 'Button', 'comet' ) );

		$this->register_field( $tid, $sid, 'text', [
			'label'		=> __( 'Text', 'comet' ),
			'type'		=> 'text',
			'std'		=> __( 'Hello', 'comet' )
		] );

		$this->register_field( $tid, $sid, 'link', [
			'label'		=> __( 'Link', 'comet' ),
			'type'		=> 'text',
			'std'		=> '#'
		] );

		$this->register_field( $tid, $sid, 'tar', [
			'label'		=> __( 'Open in a new tab ?', 'comet' ),
			'type'		=> 'checkbox',
			'std'		=> 'true'
		] );

		$this->register_field( $tid, $sid, 'alg', [
			'label'		=> __( 'Alignment', 'comet' ),
			'type'		=> 'radio',
			'std'		=> 'c',
			'values'	=> [
				'l' => [
					'title'		=> __( 'Left', 'comet' ),
					'icon'		=> 'cico cico-align-left'
				],
				'c' => [
					'title'		=> __( 'Center', 'comet' ),
					'icon'		=> 'cico cico-align-center'
				],
				'r' => [
					'title'		=> __( 'Right', 'comet' ),
					'icon'		=> 'cico cico-align-right'
				],
				'j' => [
					'title'		=> __( 'Justified', 'comet' ),
					'icon'		=> 'cico cico-justify'
				]
			]
		] );

		$sid = $this->register_section( $tid, 'icon', __( 'Icon', 'comet' ) );

		$this->register_field( $tid, $sid, 'icon', [
			'label'		=> __( 'Icon', 'comet' ),
			'type'		=> 'icon'
		] );

		$this->register_field( $tid, $sid, 'ipos', [
			'label'		=> __( 'Position', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'l',
			'values'	=> [
				'l'		=> __( 'Left', 'comet' ),
				'r'		=> __( 'Right', 'comet' )
			]
		] );

		$tid = $this->register_tab( 'design', __( 'Design', 'comet' ) );

		$sid = $this->register_section( $tid, 'background', __( 'Background', 'comet' ) );

		$this->register_field( $tid, $sid, 'sty', [
			'label'		=> __( 'Style', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'f',
			'switch'	=> [
				'f'		=> [ 'bg', 'hbg' ],
				'g'		=> [ 'gbg', 'ghbg', 'ang' ]
			],
			'values'	=> [
				'f'		=> __( 'Flat', 'comet' ),
				'g'		=> __( 'Gradient', 'comet' )
			]
		] );

		$this->register_field( $tid, $sid, 'bg', [
			'label'		=> __( 'Color (inactive)', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'hbg', [
			'label'		=> __( 'Color (active)', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'gbg', [
			'label'		=> __( 'Gradient (inactive)', 'comet' ),
			'type'		=> 'gradient',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'ghbg', [
			'label'		=> __( 'Gradient (active)', 'comet' ),
			'type'		=> 'gradient',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'ang', [
			'label'		=> __( 'Angle', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '0',
			'max'		=> '360',
			'unit'		=> __( 'deg', 'comet' ),
			'step'		=> '1',
			'hidden'	=> true
		] );

		$sid = $this->register_section( $tid, 'text', __( 'Text', 'comet' ) );

		$this->register_field( $tid, $sid, 'fs', [
			'label'		=> __( 'Size', 'comet' ),
			'type'		=> 'range',
			'std'		=> '20',
			'min'		=> '10',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'tc', [
			'label'		=> __( 'Color (inactive)', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'htc', [
			'label'		=> __( 'Color (active)', 'comet' ),
			'type'		=> 'color'
		] );

		$sid = $this->register_section( $tid, 'icon', __( 'Icon', 'comet' ) );

		$this->register_field( $tid, $sid, 'is', [
			'label'		=> __( 'Size', 'comet' ),
			'type'		=> 'range',
			'std'		=> '20',
			'min'		=> '10',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$sid = $this->register_section( $tid, 'border', __( 'Border', 'comet' ) );

		$this->register_field( $tid, $sid, 'br', Comet_Utils::numbers( __( 'Width', 'comet' ) ) );

		$this->register_field( $tid, $sid, 'bs', [
			'label'		=> __( 'Type', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'none',
			'values'	=> Comet_Utils::borderStyle()
		] );

		$this->register_field( $tid, $sid, 'bc', [
			'label'		=> __( 'Color (inactive)', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'hbc', [
			'label'		=> __( 'Color (active)', 'comet' ),
			'type'		=> 'color'
		] );

		$this->register_field( $tid, $sid, 'rd', Comet_Utils::numbers( __( 'Radius', 'comet' ) ) );

		$sid = $this->register_section( $tid, 'shadow', __( 'Shadow', 'comet' ) );

		$this->register_field( $tid, $sid, 'sha', [
			'label'		=> __( 'Type', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'n',
			'switch'	=> [
				'c'		=> [ 'shc', 'sx', 'sy', 'sbl', 'ssp', 'sin' ]
			],
			'values'	=> [
				'n'		=> __( 'None', 'comet' ),
				'c'		=> __( 'Custom', 'comet' )
			]
		] );

		$this->register_field( $tid, $sid, 'shc', [
			'label'		=> __( 'Color', 'comet' ),
			'type'		=> 'color',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'sx', [
			'label'		=> __( 'Offset x', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '-70',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'sy', [
			'label'		=> __( 'Offset y', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '-70',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'sbl', [
			'label'		=> __( 'Blur', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '0',
			'max'		=> '70',
			'unit'		=> 'px',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'ssp', [
			'label'		=> __( 'Spread', 'comet' ),
			'type'		=> 'range',
			'std'		=> '0',
			'min'		=> '-70',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px',
			'hidden'	=> true
		] );

		$this->register_field( $tid, $sid, 'sin', [
			'label'		=> __( 'Inside', 'comet' ),
			'type'		=> 'checkbox',
			'std'		=> 'false',
			'hidden'	=> true
		] );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'vsp', [
			'label'		=> __( 'Vertical', 'comet' ),
			'type'		=> 'range',
			'std'		=> '10',
			'min'		=> '0',
			'max'		=> '70',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'hsp', [
			'label'		=> __( 'Horizontal', 'comet' ),
			'type'		=> 'range',
			'std'		=> '25',
			'min'		=> '0',
			'max'		=> '100',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'isp', [
			'label'		=> __( 'Icon', 'comet' ),
			'type'		=> 'range',
			'std'		=> '25',
			'min'		=> '0',
			'max'		=> '100',
			'step'		=> '1',
			'unit'		=> 'px'
		] );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', 'true' ) );

		$sid = $this->register_section( $tid, 'animation', __( 'Animation', 'comet' ) );

		$this->register_field( $tid, $sid, 'ani', [
			'label'		=> __( 'Effect', 'comet' ),
			'desc'		=> __( 'Play an effect on hovering the button.', 'comet' ),
			'type'		=> 'select',
			'std'		=> 'none',
			'values'	=> [
				'none'		=> __( 'None', 'comet' ),
				'zoom'		=> __( 'Zoom', 'comet' ),
				'fade'		=> __( 'Fade', 'comet' ),
				'shrink'		=> __( 'Shrink', 'comet' ),
				'pulse'		=> __( 'Pulse', 'comet' ),
				'tada'		=> __( 'Tada', 'comet' ),
				'left'		=> __( 'Left', 'comet' ),
				'right'		=> __( 'Right', 'comet' ),
				'up'		=> __( 'Up', 'comet' ),
				'down'		=> __( 'Down', 'comet' ),
				/*'stt'		=> __( 'Sweep to top', 'comet' ),
				'stl'		=> __( 'Sweep to left', 'comet' ),
				'stb'		=> __( 'Sweep to bottom', 'comet' ),
				'str'		=> __( 'Sweep to right', 'comet' ),*/
			]
		] );

	}

}
?>