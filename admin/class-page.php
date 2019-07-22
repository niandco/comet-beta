<?php

namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
    exit;

}

class Comet_Page {

	public function page(){

        if( !$this->is_slug() ){
            comet_die( '<strong>Fatal error</strong>. Undefined or not valid variable "slug".', 'Fatal error' );

        }
        $slug = $this->slug;

        @header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

        if ( !defined( 'WP_ADMIN' ) ) {
            require_once  ABSPATH . 'wp-admin/admin.php';

        }
        $page_title = isset( $this->page_title ) && is_string( $this->page_title ) ? $this->page_title : '';
        $title = esc_html( sprintf( 'Comet: %s < %s', $page_title, get_bloginfo( 'name') ) );
        $classes = 'comet-admin comet-page';
        $classes .= " comet-{$slug}";

        if( is_string( $_classes = apply_filters( 'comet_admin_body_class', '' ) ) ){
            $classes .= ' ' . trim( $_classes );

        }
        $classes = 'class="' . $classes . '"';

        _wp_admin_html_begin();

        echo '<meta name="viewport" content="width=device-width,initial-scale=1.0">' . "\r\n";
        echo "<title>{$title}</title>\r\n";

        do_action( 'comet_admin_header' );

        do_action( "comet_admin_header_{$slug}" );

        echo "\r\n</head>\r\n";
        echo "<body {$classes}>\r\n";

        if( method_exists( $this, 'body' ) ){
            $this->body();

        }

        do_action( "comet_admin_footer_{$slug}" );
        do_action( 'comet_admin_footer' );
        echo "\r\n</body>\r\n";
        echo "</html>\r\n";
        exit;

    }

    private function is_slug(){

        return ( isset( $this->slug ) && is_string( $this->slug ) && !preg_match( '/[^a-z\_]/i', $this->slug ) );

    }

    public function get_slug(){

        return ( $this->is_slug() ? $this->slug : false );

    }

    public function get_data(){

        return (object)[
            'menu_title'    => isset( $this->menu_title ) && is_string( $this->menu_title ) ? $this->menu_title : '',
            'page_title'    => isset( $this->page_title ) && is_string( $this->page_title ) ? $this->page_title : '',
            'capability'    => isset( $this->capability ) && is_string( $this->capability ) ? $this->capability : 'manage_options',
            'help'          => isset( $this->help ) && is_string( $this->help ) ? $this->help : '',
            'public'        => isset( $this->public ) && is_bool( $this->public ) ? $this->public : true,

        ];

    }

}
?>