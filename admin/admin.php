<?php
if( !defined( 'ABSPATH' ) ){
	exit;

}

function comet_get_args(){

  return ( isset( $_GET ) && is_array( $_GET ) ? $_GET : [] );

}

function comet_get_rediction_url( $post_type ){

  if( $post_type === 'comet_mytemplates' ){
    return comet_get_dashboard_url( 'mytemplates' );

  }
  return add_query_arg( 'post_type', $post_type, admin_url( 'edit.php' ) );

}

function comet_die( $message = false, $title = '' ){
  $die = '\Comet\Admin\Comet_Die';
  $file = 'class-die.php';

  if( !( $die = comet_requires( $die, $file ) ) || !( $_die = new $die( $message, $title ) ) || !( $_die instanceof $die ) ){
    exit;

  }
  $_die->render();
  exit;

}

function comet_is_id( $id = null ){

  return ( !is_null( $id ) && is_integer( $id ) && $id > -1 );

}

function comet_get_id(){
  $args = comet_get_args();

  return ( isset( $args['id'] ) && ( $id = (int)$args['id'] ) > -1 ? $id : null );

}

function comet_localize( $name, $data ){

  if( !is_string( $name ) || preg_match( '/[^a-z0-9\_]/i', trim( $name ) ) ){
    return;

  }

  foreach( (array) $data as $key => $value ){

    if( !is_scalar($value) ){
      continue;

    }
    $data[$key] = html_entity_decode( (string) $value, ENT_QUOTES, 'UTF-8');

  }
  echo "<script>const {$name} = " . wp_json_encode( $data ) . ";</script>\r\n";

}

function comet_print_style( $src = '', $version = null, $media = 'all' ){

  if( !is_string( $src ) ){
    return;

  }
  $media = is_string( $media ) && in_array( strtolower( $media ), [ 'print', 'screen', 'speech' ] ) ? $media : 'all';
  $src = trim( strip_tags( $src ) );

  if( is_string( $version ) || is_numeric( $version ) ){
    $src = add_query_arg( 'ver', trim( strip_tags( $version ) ), $src );

  }
  echo '<link rel="stylesheet" type="text/css" href="' . esc_url( $src ) . '" media="' . $media . '" />' . "\r\n";

}

function comet_print_script( $src = '', $version = null ){

  if( !is_string( $src ) ){
    return;

  }
  $src = trim( strip_tags( $src ) );

  if( is_string( $version ) || is_numeric( $version ) ){
    $src = add_query_arg( 'ver', trim( strip_tags( $version ) ), $src );

  }
  echo '<script src="' . esc_url( $src ) . '"></script>' . "\r\n";

}

function comet_inline_style( $style ){

  if( !is_string( $style ) || strlen( $style ) < 1 ){
    return false;

  }
  echo '<style type="text/css">' . strip_tags( $style ) . '</style>' . "\r\n";

}
?>