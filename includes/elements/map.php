<?php
namespace Comet\Library\Elements;

if( !defined( 'ABSPATH' ) ){
    exit;
    
}
require_once COMET_PATH . 'includes/class-element.php';
use Comet\Library\Comet_Element;
use Comet\Library\Comet_Utils;

class map extends Comet_Element {

    public function __construct(){

        $this->set_element( 'map', __( 'Google map', 'comet'), 'cico-map' );

    }

    public function render( $data ){

        $edata = is_array( $data['el'] ) ? $data['el'] : [];
        $w = Comet_Utils::sanitize_number( ( isset( $edata['wi'] ) ? $edata['wi'] : 200 ), 200, 2000, 200 );
        $h = Comet_Utils::sanitize_number( ( isset( $edata['he'] ) ? $edata['he'] : 200 ), 200, 2000, 200 );
        $args = [
            'output'    => 'embed',
            '=iwloc'    => 'B',
            'z'         => Comet_Utils::sanitize_number( ( isset( $edata['zoom'] ) ? $edata['zoom'] : 10 ), 0, 21, 10 ),
            'width'     => $w,
            'height'    => $h,

        ];

        if( isset( $edata['q'] ) && is_string( $edata['q'] ) ){
            $args['q'] = trim( strip_tags( $edata['q'] ) );

        }

        if( isset( $edata['mt'] ) && in_array( $edata['mt'], [ 'satellite', 's', 'S', 'SATELLITE' ] ) ){
            $args['t'] = 'k';

        }
        $src = esc_url( add_query_arg( $args, 'https://maps.google.com/maps' ) );

        $output = "<iframe class=\"cpb-map cpb-frame\" width=\"{$w}\" height=\"{$h}\" src=\"{$src}\" allowfullscreen  scrolling=\"no\" frameborder=\"0\">";
        $output .= __( 'No map to show', 'comet' );
        $output .= "</iframe>";
        return $output;

    }

    public function view(){

    	?>

    	const w = toolkit.sanitize.number({ value: data.el.wi, min: 200, max: 2000, default: 200 });
    	const h = toolkit.sanitize.number({ value: data.el.he, min: 200, max: 2000, default: 200 });
    	var src, tmp, o;

    	src = 'https://maps.google.com/maps?output=embed&=iwloc=B';
    	if( toolkit.utils.isString( data.el.q ) ){
    		src += '&q=' + toolkit.utils.trim( toolkit.utils.stripTags( data.el.q ) );

    	}
    	src += '&z=' + toolkit.sanitize.number({ value: data.el.zoom, min: 0, max: 21, default: 10 });

    	if( !toolkit.utils.isStringEmpty( data.el.mt ) && [ 'satellite', 's' ].indexOf( tmp = toolkit.utils.trim( data.el.mt ) ) > -1 ){
    		src += '&t=k';

    	}
    	src += '&width=' + w;
    	src += '&height=' + h;

    	o = '<iframe class="cpb-map cpb-frame" width="' + w + '" height="' + h + '"';
    	o += ' src="' + toolkit.utils.escUrl( src ) + '" allowfullscreen  scrolling="no" frameborder="0">';
    	o += __( 'No map to show', 'comet' );
    	o += '</iframe>';

    	ui.firstChild.innerHTML = o;
    	<?php

    }

    public function css(){
    	?>
    	var o = '';
    	var tmp;

    	if( ( tmp = toolkit.css.margin( data.el.mrt, data.el.mrr, data.el.mrb, data.el.mrl, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-map.cpb-frame', tmp );

    	}

    	if( ( tmp = toolkit.css.margin( data.el.mrtt, data.el.mrrt, data.el.mrbt, data.el.mrlt, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-map.cpb-frame', tmp, 't' );
            o += toolkit.css.responsive( 't', toolkit.css.element( id, '.cpb-map.cpb-frame', tmp ) );

    	}

    	if( ( tmp = toolkit.css.margin( data.el.mrtm, data.el.mrrm, data.el.mrbm, data.el.mrlm, 'px', 'px' ) ) !== '' ){
            o += toolkit.css.element( id, '.cpb-map.cpb-frame', tmp, 'm' );
    		o += toolkit.css.responsive( 'm', toolkit.css.element( id, '.cpb-map.cpb-frame', tmp ) );

    	}
    	return o;
    	<?php

    }

	protected function _register_settings(){

		$tid = $this->register_tab( 'general', __( 'General', 'comet' ) );

		$sid = $this->register_section( $tid, 'settings', __( 'Settings', 'comet' ) );

		$this->register_field( $tid, $sid, 'q', [
            'label'     => __( 'Address', 'comet' ),
            'type'      => 'text',
            'std'       => 'Eiffel Tower, Paris France'
        ] );

		$this->register_field( $tid, $sid, 'zoom', [
            'label'  => __( 'Zoom level', 'comet' ),
            'desc'   => __( 'The initial resolution at which to display the map is set by the zoom property, where zoom 0 corresponds to a map of the Earth fully zoomed out, and higher zoom levels zoom in at a higher resolution.', 'comet' ),
            'type'   => 'range',
            'std'    => '18',
            'min'    => '0',
            'max'    => '21'
        ] );

		$this->register_field( $tid, $sid, 'mt', [
            'label'  => __( 'Map type', 'comet' ),
            'type'   => 'select',
            'std'    => 'r',
            'values' => [
                'r'    => __( 'Roadmap', 'comet' ),
                's'    => __( 'Satellite', 'comet' )
            ]
        ] );

		$this->register_field( $tid, $sid, 'wi', [
            'label'  => __( 'Width', 'comet' ),
            'type'   => 'range',
            'min'    => '200',
            'max'    => '2000',
            'std'    => '500',
            'unit'   => 'px'
        ] );

		$this->register_field( $tid, $sid, 'he', [
            'label'  => __( 'Height', 'comet' ),
            'type'   => 'range',
            'min'    => '200',
            'max'    => '2000',
            'std'    => '500',
            'unit'   => 'px'
        ] );

		$sid = $this->register_section( $tid, 'spacing', __( 'Spacing', 'comet' ) );

		$this->register_field( $tid, $sid, 'mr', Comet_Utils::numbers( __( 'Margin', 'comet' ), '', '0', 'true' ) );

	}

}
?>