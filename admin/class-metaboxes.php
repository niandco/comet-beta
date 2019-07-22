<?php
namespace Comet\Admin;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-page.php';

class Comet_Metaboxes extends Comet_Page {

  public function metaboxes(){

    $post = $this->post;
    $post_type = $post->post_type;

    /*$thumbnail_support = current_theme_supports( 'post-thumbnails', $post_type ) && post_type_supports( $post_type, 'thumbnail' );

    if ( ! $thumbnail_support && 'attachment' === $post_type && $post->post_mime_type ) {
      if ( wp_attachment_is( 'audio', $post ) ) {
        $thumbnail_support = post_type_supports( 'attachment:audio', 'thumbnail' ) || current_theme_supports( 'post-thumbnails', 'attachment:audio' );
      } elseif ( wp_attachment_is( 'video', $post ) ) {
        $thumbnail_support = post_type_supports( 'attachment:video', 'thumbnail' ) || current_theme_supports( 'post-thumbnails', 'attachment:video' );
      }
    }
    foreach ( get_object_taxonomies( $post ) as $tax_name ) {
      $taxonomy = get_taxonomy( $tax_name );
      if ( ! $taxonomy->show_ui || false === $taxonomy->meta_box_cb ) {
        continue;
      }
      $label = $taxonomy->labels->name;
      if ( ! is_taxonomy_hierarchical( $tax_name ) ) {
        $tax_meta_box_id = 'tagsdiv-' . $tax_name;
      } else {
        $tax_meta_box_id = $tax_name . 'div';
      }
      add_meta_box( $tax_meta_box_id, $label, $taxonomy->meta_box_cb, null, 'side', 'core', array( 'taxonomy' => $tax_name ) );
    }

    if ( post_type_supports( $post_type, 'page-attributes' ) || count( get_page_templates( $post ) ) > 0 ) {
      add_meta_box( 'pageparentdiv', $post_type_object->labels->attributes, 'page_attributes_meta_box', null, 'side', 'core' );
    }*/

    add_meta_box( 'poststatus', __( 'Status', 'comet' ), [ $this, 'status' ], null, 'side', 'core' );

    add_meta_box( 'posttitle', __( 'Title', 'comet' ), [ $this, 'title' ], null, 'advanced', 'core' );

    if ( post_type_supports( $post_type, 'excerpt' ) ) {
      add_meta_box( 'postexcerpt', __( 'Excerpt', 'comet' ), [ $this, 'excerpt' ], null, 'advanced', 'core' );

    }

    /*if ( $thumbnail_support && current_user_can( 'upload_files' ) ) {
      add_meta_box( 'postimagediv', __( 'Thumbnail', 'comet' ), array( $this, 'thumbnail' ), null, 'side', 'low' );
    }*/
    /*if ( post_type_supports( $post_type, 'trackbacks' ) ) {
      add_meta_box( 'trackbacksdiv', __( 'Send Trackbacks' ), 'post_trackback_meta_box', null, 'normal', 'low' );
    }
    if ( post_type_supports( $post_type, 'custom-fields' ) ) {
      add_meta_box( 'postcustom', __( 'Custom Fields' ), 'post_custom_meta_box', null, 'normal', 'core' );
    }*/
  }

  public function status( $post, $box ){

    $this->post_status( $post, $box );
    //$this->post_format( $post, $box );

    // @TODO  Post format
    // @TODO  Post thumbnail
    // @TODO  Custom save action
    // @TODO  Taxonomies

  }

  public function title( $post, $box ){

    echo '<input id="title" name="post_title" value="' . esc_attr( $post->post_title ) . '" />';

  }

  public function excerpt( $post, $box ){

    echo '<textarea id="excerpt" name="post_excerpt">' . $post->post_excerpt . '</textarea>';
    echo '<a href="' . esc_url( 'https://codex.wordpress.org/Excerpt' ) . '" target="_blank">';
    echo __( 'Learn more about excerpt', 'comet' );
    echo '</a>';

  }

  private function post_status( $post, $box ){

    $statuses = is_post_type_hierarchical( trim( $post->post_type ) ) ? get_page_statuses() : get_post_statuses();
    $label = __( 'Visibility', 'comet' );

    echo '<div class="comet-row">';
    echo '<div class="comet-inner">';
    echo "<label for=\"status\">{$label}</label>";
    echo '<select id="status" name="post_status">';

    foreach( $statuses as $status => $name ){
      $value = esc_attr( $status );
      $selected = selected( $post->post_status, $status, false );
      $name = esc_html( $name );
      echo "<option value=\"{$value}\" {$selected}>{$name}</option>";

    }
    echo '</select>';
    echo '</div>';
    echo '</div>';

  }


  private function post_format( $post, $box ){

    if( !current_theme_supports( 'post-formats' ) || !post_type_supports( $post->post_type, 'post-formats' ) ){
      return;

    }

    if( !is_array( $formats = get_theme_support( 'post-formats' ) ) || !is_array( $formats[0] ) ){
      return;

    }
    $post_format = get_post_format( $post->ID );

    if( !$post_format ){
      $post_format = '0';

    }

    if( $post_format && !in_array( $post_format, $formats[0] ) ){
      $formats[0][] = $post_format;

    }
    $label = __( 'Post format', 'comet' );

    echo '<div class="comet-row">';
    echo '<div class="comet-inner">';
    echo "<label for=\"format\">{$label}</label>";
    echo '<select id="format" name="format">';
    /*echo '<option value="0" ' . selected( $post_format, '0', false ) . '>';
    echo get_post_format_string( 'standard' );
    echo '</option>';*/

    foreach( $formats[0] as $format ){
      $value = esc_attr( $format );
      $selected = selected( $post_format, $format, false );
      $format = esc_html( get_post_format_string( $format ) );
      echo "<option value=\"{$value}\" {$selected}>{$format}</option>";

    }
    echo '</select>';
    echo '</div>';
    echo '</div>';


  }

  public function thumbnail( $post, $box ){
    $thumbnail_id = get_post_meta( $post->ID, '_thumbnail_id', true );
    echo _wp_post_thumbnail_html( $thumbnail_id, $post->ID );

  }
}
?>
