<?php
namespace Comet\Library;

if( !defined( 'ABSPATH' ) ){
	exit;

}

class Comet_Utils {

    static protected function numbers( $label, $desc = '', $std = '0', $res = false ){

        return [
            'label'  => $label,
            'desc'   => $desc,
            'std'    => $std,
            'type'   => 'numbers',
            'responsive' => $res || $res === 'true' || $res === 1 || $res === '1' ? 'true' : 'false',
            'values' => [
                't'    => [
                    'label' => __( 'Top', 'comet' ),
                    'std'   => $std,
                ],
                'r'  => [
                    'label' => __( 'Right', 'comet' ),
                    'std'   => $std,
                ],
                'b' => [
                    'label' => __( 'Bottom', 'comet' ),
                    'std'   => $std,
                ],
                'l'   => [
                    'label' => __( 'Left', 'comet' ),
                    'std'   => $std,
                ],
            ]
        ];

    }

    static protected function backgroundPosition(){
        $position = [];

        for( $choice = 1; $choice <= 9; $choice++ ){

            if($choice <= 3){
                $a = 'l';

            }elseif($choice > 3 && $choice <= 6){
                $a = 'r';

            }elseif($choice > 6 && $choice <= 9){
                $a = 'c';

            }

            if($choice === 1 || $choice === 4 || $choice === 7){
                $b = 't';

            }elseif($choice === 2 || $choice === 5 || $choice === 8){
                $b = 'c';

            }elseif($choice === 3 || $choice === 6 || $choice === 9){
                $b = 'b';

            }
            $id = "{$a}{$b}";
            $position[$id] = self::backgroundPositionName( $a, $b );

        }
        return $position;

    }

    static private function backgroundPositionName( $first, $second ){

        if( $first === 'l' ){

            if( $second === 't' ){
                return __( 'Left top', 'comet' );

            }

            if( $second === 'c' ){
                return __( 'Left center', 'comet' );

            }

            if( $second === 'b' ){
                return __( 'Left bottom', 'comet' );

            }

        }

        if( $first === 'r' ){

            if( $second === 't' ){
                return __( 'Right top', 'comet' );

            }

            if( $second === 'c' ){
                return __( 'Right center', 'comet' );

            }

            if( $second === 'b' ){
                return __( 'Right bottom', 'comet' );

            }

        }

        if( $first === 'c' ){

            if( $second === 't' ){
                return __( 'Top center', 'comet' );

            }

            if( $second === 'c' ){
                return __( 'Center', 'comet' );

            }

            if( $second === 'b' ){
                return __( 'Bottom center', 'comet' );

            }
        }

    }

    static protected function backgroundRepeat(){

        return [
            'r'  => __( 'Repeat', 'comet' ),
            'x'  => __( 'Repeat horizontally', 'comet' ),
            'y'  => __( 'Repeat vertically', 'comet' ),
            's'  => __( 'Space', 'comet' ),
            'rd' => __( 'Round', 'comet' ),
            'no' => __( 'No repeat', 'comet' )
        ];

    }

    static protected function borderStyle(){

        return [
            'solid'  => __( 'Solid', 'comet' ),
            'dotted' => __( 'Dotted', 'comet' ),
            'dashed' => __( 'Dashed', 'comet' ),
            'double' => __( 'Double', 'comet' ),
            'inset'  => __( 'Inset', 'comet' ),
            'outset' => __( 'Outset', 'comet' ),
            'none'   => __( 'None', 'comet' )
        ];

    }

    static protected function grid( $max = 3 ){
        $grid = [];
        $max = ( $max = (int)$max ) > 0 ? $max : 3;

        for( $count = 1; $count <= $max; $count++ ){
            $grid[$count] = sprintf( _n( '1 column', '%d columns', $count, 'comet' ), $count );

        }
        return $grid;

    }

    static protected function imageSizes(){
        global $_wp_additional_image_sizes;

        $sizes = [];

        foreach( get_intermediate_image_sizes() as $_size ){
            if( in_array( $_size, [ 'thumbnail', 'medium', 'medium_large', 'large' ] ) ){
                $width = get_option( "{$_size}_size_w" );
                $height = get_option( "{$_size}_size_h" );

            }elseif( isset( $_wp_additional_image_sizes[ $_size ] ) ){
                $width = $_wp_additional_image_sizes[ $_size ]['width'];
                $height = $_wp_additional_image_sizes[ $_size ]['height'];

            }else{
                continue;

            }
            $size = "{$width}x{$height}";
            $sizes[$_size] = ucfirst( $_size ) . ' ' . $size;

        }
        $sizes['full'] = __( 'Full', 'comet' );
        return $sizes;

    }

    static protected function listStyle(){

        return [
            'none'                 => __( 'None', 'comet' ),
            'img'                  => __( 'Custom image', 'comet' ),
            'disc'                 => __( 'Disc', 'comet' ),
            'circle'               => __( 'Circle', 'comet' ),
            'square'               => __( 'Square', 'comet' ),
            'armenian'             => __( 'Armenian', 'comet' ),
            'cjk_ideographic'      => __( 'Cjk ideographic', 'comet' ),
            'decimal'              => __( 'Decimal', 'comet' ),
            'decimal_leading_zero' => __( 'Decimal leading zero', 'comet' ),
            'georgian'             => __( 'Georgian', 'comet' ),
            'hebrew'               => __( 'Hebrew', 'comet' ),
            'hiragana'             => __( 'Hiragana', 'comet' ),
            'hiragana_iroha'       => __( 'Hiragana iroha', 'comet' ),
            'katakana'             => __( 'Katakana', 'comet' ),
            'katakana_iroha'       => __( 'Katakana iroha', 'comet' ),
            'lower_alpha'          => __( 'Lower alpha', 'comet' ),
            'lower_greek'          => __( 'Lower greek', 'comet' ),
            'lower_latin'          => __( 'Lower latin', 'comet' ),
            'lower_roman'          => __( 'Lower roman', 'comet' ),
            'upper_alpha'          => __( 'Upper alpha', 'comet' ),
            'upper_latin'          => __( 'Upper latin', 'comet' ),
            'upper_roman'          => __( 'Upper roman', 'comet' )
        ];

    }

    static protected function fonts(){

        $default = [
            '0'               => __( 'Default', 'comet' ),
            'arial'           => 'Arial',
            'arial black'     => 'Arial Black',
            'courier new'     => 'Courier New',
            'georgia'         => 'Georgia',
            'helvetica'       => 'Helvetica',
            'tahoma'          => 'Tahoma',
            'times new roman' => 'Times New Roman',
            'verdana'         => 'Verdana',
        ];

        $fonts = comet_get_fonts( 'publish', 'fonts' );

        if( is_array( $fonts ) && count( $fonts ) > 0 ){

            foreach( $fonts as $index => $font ){

                if( isset( $font['family'] ) && is_string( $font['family'] ) ){
                    $name = $font['family'];
                    $default[$name] = $name;

                }

            }
        }
        return $default;

    }

    static protected function weight(){

        $w = [];

        for( $a = 1; $a < 10; $a++ ){
            $v = $a * 100;
            $w[$v] = $v;

        }
        return $w;

    }

    static protected function is_true( $entry ){

        return self::is_enabled( $entry ) || $entry === true || $entry === 1;

    }

    static protected function is_false( $entry ){

        return self::is_disabled( $entry ) || $entry === false || $entry === 0;

    }

    static protected function is_enabled( $entry ){

        return in_array( $entry, [ 'true', 'TRUE', 'on', 'ON', '1' ] );

    }

    static protected function is_disabled( $entry ){

        return in_array( $entry, [ 'false', 'FALSE', 'off', 'OFF', '0' ] );

    }

    static protected function parse_number( $entry ){

        return ( is_string( $entry ) || is_numeric( $entry ) ? ( is_numeric( $entry = (float)$entry ) ? $entry : null ) : null );
    }

    static protected function sanitize_number( $value, $min, $max, $default ){

        if( ( $value = $this->parse_number( $value ) ) !== null ){

            if( ( $min = $this->parse_number( $min ) ) !== null && $value < $min ){
                return $min;

            }

            if( ( $max = $this->parse_number( $max ) ) !== null && $value > $max ){
                return $max;

            }
            return $value;

        }
        return $this->parse_number( $default );

    }

    static private function get_image_size( $url ){
        global $wpdb;
        $img = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE guid='%s';", $url ) );

        if( is_array( $img ) && isset( $img[0] ) ){

            if( is_array( $meta = wp_get_attachment_metadata( $img[0] ) ) && isset( $meta['width'] ) && isset( $meta['height'] ) ){
                $w = $meta['width'];
                $h = $meta['height'];

                return "width=\"{$w}\" height=\"{$h}\"";

            }

        }

        if( ini_get( 'allow_url_fopen' ) && is_array( $meta = getimagesize( $url ) ) && isset( $meta[3] ) ){
            return $meta[3];

        }
        return '';

    }

    static protected function get_image( $src = '', $alt = '' ){

        $src = is_string( $src ) ? esc_url( strip_tags( $src ) ) : '';
        $alt = is_string( $alt ) ? esc_attr( $alt ) : '';
        $size = self::get_image_size( $src );

        return "<img class=\"cpb-image\" {$size} src=\"{$src}\" alt=\"{$alt}\" />";

    }

    static protected function get_alignment( $entry = '' ){
        $prefix = 'cpb-align';
        $entry = is_string( $entry ) ? trim( strtolower( $entry ) ) : $entry;

        switch( $entry ){
            case 'l':
            case 'left':
            case '<':
            return "{$prefix}left";

            case 'r':
            case 'right':
            case '>':
            return "{$prefix}right";

            case 'j':
            case 'justify':
            case '=':
            return "{$prefix}justify";

            case 'm':
            case 'middle':
            return "{$prefix}middle";

            case 't':
            case 'top':
            case '^':
            return "{$prefix}top";

            case 'b':
            case 'bottom':
            case 'v':
            return "{$prefix}bottom";

            default:
            return "{$prefix}center";
        }

    }

    static protected function foreach_item( $data, $callback ){

        $data = is_array( $data ) ? $data : [];

        if( !is_array( $data ) || !is_array( $data['el'] ) || !is_array( $data['items'] ) || !is_callable( $callback ) ){
            return '';

        }

        if( !isset( $data['el']['_items'] ) || !is_string( $data['el']['_items'] ) ){
            return '';

        }

        if( !is_array( $ids = comet_parse_ids( $data['el']['_items'] ) ) || ( $length = count( $ids ) ) < 1 ){
            return '';

        }
        $output = '';

        for( $i = 0; $i < $length; $i++ ){

            if( !isset( $data['items'][$ids[$i]] ) ){
                continue;

            }
            $output .= $callback( $ids[$i], $data['items'][$ids[$i]] );

        }
        return $output;

    }

}
?>
