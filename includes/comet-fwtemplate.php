<?php
/**
 * Full width template
 * 
 * @since   1.0.0
 */

if( ! defined( 'ABSPATH' ) ){
    exit;
}

comet_get_header();

do_action( 'comet_before_post' );

while( have_posts() ){
    the_post();
    the_content();
}

do_action( 'comet_after_post' );
 
comet_get_footer();

?>