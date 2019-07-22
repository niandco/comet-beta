<?php
/**
 * @link       https://blacklead.fr
 * @since      1.0.0
 *
 * @package    Comet
 */

if( !defined( 'WP_UNINSTALL_PLUGIN' ) || !current_user_can( 'delete_plugins' ) ){
	exit;
}

$slugs = [
	'comet_settings',
	'comet_fonts'
];

$post_types = [
	'comet_fonts',
	'comet_mytemplates'
];

$settings = get_option( $slugs[0] );

if( !is_array( $settings ) || !isset( $settings['uninstall'] ) || (int)$settings['uninstall'] !== 1 ){
	return;

}
delete_option( $slugs[0] );
delete_option( $slugs[1] );

$c_posts = new WP_Query([
	'post_type'			=> 'any',
	'post_status'		=> 'any',
	'nopaging'			=> true,
	'posts_per_page'	=> -1
]);

while( $c_posts->have_posts() ){
	$c_posts->the_post();
	$c_post = $posts->post;
	delete_post_meta( $c_post->ID, '_cometMetaData' );

	if( isset( $c_post->post_type ) && in_array( $c_post->post_type, $post_types ) ){
		wp_delete_post( $c_post->ID, true );

	}

}
wp_reset_postdata();

?>