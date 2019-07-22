<?php
global $comet_lib;
$comet_lib = '\Comet\Library';

function comet_get_dashboard_url( $slug = null ){
  $base = add_query_arg( 'page', 'comet', admin_url( 'admin.php' ) );

  return ( !is_string( $slug ) || preg_match( '/[^a-z_\-]/i', $slug ) ? $base : add_query_arg( 'rq', trim( $slug ), $base ) );

}

function comet_get_post_edit_link( $id, $default = true ){
  $default = is_bool( $default ) ? $default : true;

  return add_query_arg( 'comet', ( $default ? 'default' : 'template' ), get_edit_post_link( $id ) );
  
}

function comet_message( $str = '', $type = 'note', $echo = false ){
  $types = [ 'warning', 'error', 'success', 'note' ];
  $type = ( is_string( $type ) && in_array( $type = trim( strtolower( $type ) ), $types ) ? $type : 'note' );
  $str = esc_html( is_string( $str ) ? strip_tags( $str, comet_inline_tags() ) : '' );

  $output = "<div class=\"comet-message comet-{$type}\"><p>{$str}</p></div>";

  if( is_bool( $echo ) && $echo ){
    echo $output;

  }else{
    return $output;

  }

}

function comet_get_fonts( $status = 'any', $onreturn = 'both' ){

  $onreturn = is_string( $onreturn ) ? strtolower( $onreturn ) : 'both';
  $onreturn = in_array( $onreturn, [ 'fonts', 'css' ] ) ? $onreturn : 'both';

  $args = [
    'post_type'       => 'comet_fonts',
    'post_status'     => $status,
    'nopaging'        => true,
    'posts_per_page'  => -1,
    'has_password'    => false
  ];

  $Fonts = new WP_Query( $args );
  $fonts = [];
  $css = '';
  
  while ( $Fonts->have_posts() ){
    $Fonts->the_post();
    $id = $Fonts->post->ID;
    $meta = get_post_meta( $id, '_cometMetaData', true );

    if( !is_array( $meta ) || count( $meta ) < 1 ){
      continue;

    }
    $fonts[] = [
      'id'      => $id,
      'family'  => get_the_title(),
      'weight'  => isset( $meta['weight'] ) && is_array( $meta['weight'] ) ? $meta['weight'] : []

    ];

    foreach( $meta['weight'] as $weight => $value ){

      if( is_string( $value ) ){
        $css .= $value;

      }

    }

  }
  wp_reset_postdata();

  return ( $onreturn === 'fonts' ? $fonts : ( $onreturn === 'css' ? $css : [ 'fonts' => $fonts, 'css' => $css ] ) );

}

function comet_get_mytemplates( $args = [], $query = true ){

  $default = [
    'post_type'       => 'comet_mytemplates',
    'post_status'     => 'publish',
    'nopaging'        => true,
    'posts_per_page'  => -1,
    'has_password'    => false
  ];

  $args = is_array( $args ) ? $args : [];
  $Templates = new WP_Query( array_merge( $default, $args ) );

  if( is_bool( $query ) && $query ){
    return $Templates;

  }
  return $Templates->posts;

}

function comet_get_mytemplate( $id, $meta = false ){
  $post = comet_get_post( $id );
  
  return ( $post->has_post() && ( $the_post = $post->get_post( $meta ) ) && isset( $the_post->post_type ) && $the_post->post_type === 'comet_mytemplates' ? $the_post : false );

}

function comet_get_post( $id = null ){
  global $comet_lib;

  $path = COMET_PATH;
  $post = "{$comet_lib}\Comet_Post";
  $file = "{$path}includes/class-post.php";


  return ( !( $post = comet_requires( $post, $file ) ) || !( $_post = new $post( $id ) ) || !( $_post instanceof $post ) ? false : $_post );

}

function comet_layout(){
  global $comet_lib;

  $path = COMET_PATH;

  return comet_autoload( "{$comet_lib}\Comet_Layout", "{$path}includes/class-layout.php" );
  
}

function comet_iconsets(){
  global $comet_lib;
  $path = COMET_PATH;

  return comet_autoload( "{$comet_lib}\Comet_Iconsets", "{$path}includes/class-iconsets.php" );

}

function comet_get_iconsets(){
  $Sets = comet_iconsets();

  return ( !$Sets ? [] : $Sets->get_sets() );

}

function comet_get_icons( $set_id ){
  $Sets = comet_iconsets();

  return ( !$Sets || !( $Set = $Sets->get_set( $set_id ) ) ? false : $Set );

}

function comet_get_icon( $set_id, $icon_id ){
  $set = comet_get_icons( $set_id );

  return ( !is_array( $set ) || !isset( $set['set'] ) || !is_array( $set['set'] ) || !is_string( $icon_id ) || !isset( $set['set'][$icon_id] ) || !is_array( $set['set'][$icon_id] ) ? false : $set['set'][$icon_id] );

}

function comet_get_svgicon( $entry ){
  $Sets = comet_iconsets();

  if( !$Sets || !( $decoded = $Sets->decode( $entry ) ) || !( $Set = $Sets->get_set_object( $decoded['set_id'] ) ) ){
    return '';

  }
  return $Set->get_svg( $decoded['icon_id'] );

}

/*function comet_get_fonts( $r = false ){
  return get_option( 'comet_fonts', $r );

}

function comet_fonts_url(){

  if( !is_array( $fonts = comet_get_fonts() ) ){
    return false;

  }
  $str = implode( '|', $fonts );
  return "https://fonts.googleapis.com/css?family={$str}";

}

function comet_enqueue_fonts(){

  if( !( $url = comet_fonts_url() ) ){
    return;

  }
  wp_enqueue_style( 'webfont', esc_url( $url ) );

}*/

function comet_get_header( $name = null ){

  $name = apply_filters( 'comet_template_header', $name );

  get_header( $name );

}

function comet_get_footer( $name = null ){

  $name = apply_filters( 'comet_template_footer', $name );

  get_footer( $name );

}

function comet_get_post_types( $prefix = false ){

  if( !is_array( $post_types = get_post_types( [ 'public' => true ] ) ) ){
    return false;

  }
  $choices = [];
  $prefix = ( is_string( $prefix ) ? preg_replace( '/[^a-z_]/i', '', $prefix ) : '' );

  foreach( $post_types as $post_type ){

    if( !is_string( $post_type ) || ( $post_type = trim( strtolower( $post_type ) ) ) === 'attachment' ){
      continue;

    }

    if( $post_type === 'attachment' ){
      continue;

    }
    $choice = "{$prefix}{$post_type}";
    $choices[$choice] = ucfirst( $post_type );

  }
  return $choices;

}

function comet_get_supported_post_types(){
  $prefix = 'apt_';
  $op = get_option( 'comet_settings' );
  $post_types = comet_get_post_types();
  $support = [];

  if( !is_array( $op ) || !isset( $op['post_types'] ) || !is_array( $pt = $op['post_types'] ) || !is_array( $post_types ) ){
    return $support;

  }

  foreach( $post_types as $post_type => $name ){

    if( ( $g = "{$prefix}{$post_type}" ) && isset( $pt[$g] ) && (int)$pt[$g] === 1 ){
      $support[$post_type] = $name;

    }

  }
  return $support;

}

function comet_parse_json( $data ){

  if( is_string( $data ) ){
    $data = json_decode( urldecode( $data ), true );

  }

  if( is_bool( $data ) || is_null( $data ) || !is_array( $data ) ){
    return false;

  }
  return $data;

}

function comet_allowed_tags( $toStr = true ){

  $tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section', 'span', 'aside', 'figure', 'img', 'sup', 'sub', 'code', 'pre', 'blockquote', 'a', 'article', 'audio', 'b', 'br', 'strong', 'u', 'i', 'canvas', 'svg', 'button', 'caption', 'cite', 'col', 'colgroup', 'dd', 'del', 'dl', 'dt', 'em', 'embed', 'fieldset', 'input', 'select', 'textarea', 'video', 'figcaption', 'form', 'footer', 'header', 'iframe', 'li', 'ul', 'ol', 'label', 'nav', 'mark', 'legend', 'object', 'optgroup', 'option', 'param', 'q', 'cite', 's', 'small', 'source', 'table', 'tbody', 'tfoot', 'td', 'tr', 'thead', 'th', 'track', 'title', 'var' ];

  if( isset( $toStr ) && !$toStr ){
    return $tags;

  }
  $_tags = '';

  foreach( $tags as $tag ){
    $_tags .= "<{$tag}>"; 

  }
  return $_tags;

}

function comet_inline_tags( $toString = true ){

  $tags = [ 'span', 'img', 'sup', 'sub', 'code', 'a', 'b', 'br', 'strong', 'u', 'i', 'del', 'em', 'li', 'ul', 'ol', 'small', 'strike' ];

  if( is_bool( $toString ) && !$toString ){
    return $tags;

  }
  $_tags = '';

  foreach( $tags as $tag ){
    $_tags .= "<{$tag}>"; 

  }
  return $_tags;

}

function comet_js( $id = null, $public = true ){
  global $comet_lib;

  $path = COMET_PATH;
  $js = "{$comet_lib}\Comet_Js";
  $file = "{$path}includes/class-js.php";

  return ( !( $js = comet_requires( $js, $file ) ) || !( $_js = new $js( $id, $public ) ) || !( $_js instanceof $js ) ? false : $_js->get_data() );

}

function comet_elements(){
  global $comet_lib;

  $path = COMET_PATH;

  return comet_autoload( "{$comet_lib}\Comet_Elements", "{$path}includes/class-elements.php" );

}

function comet_get_elements_data(){

  return ( !( $elements = comet_elements() ) ? false : $elements->get_elements_data() );

}

function comet_get_element_data( $slug ){

  return ( !( $elements = comet_elements() ) ? false : $elements->get_element_data( $slug ) );

}

function comet_get_elements(){

  return ( !( $elements = comet_elements() ) ? false : $elements->get_elements() );

}

function comet_get_element( $slug ){

  return ( !( $elements = comet_elements() ) ? false : $elements->get_element( $slug ) );

}

function comet_get_element_ajax( $slug = '', $id = null, $data ){

  if( !( $element = comet_get_element( $slug ) ) || !( $element instanceof $slug ) || !method_exists( $element, 'render' ) ){
    return false;

  }
  return $element->render( $data );

}

function comet_get_i18n( $type = null ){
  global $comet_lib;

  $path = COMET_PATH;
  $i18n = "{$comet_lib}\Comet_i18n";
  $file = "{$path}includes/class-i18n.php";

  return ( !( $i18n = comet_requires( $i18n, $file ) ) || !( $_i18n = new $i18n( $type ) ) || !( $_i18n instanceof $i18n ) ? false : $_i18n );

}

function comet_requires( $className, $file ){

  if( !is_string( $className ) || !is_string( $file ) || !file_exists( $file = trim( $file ) ) ){
    return false;

  }
  require_once $file;
  return ( class_exists( $className ) ? $className : false );

}

function comet_autoload( $className, $file ){

  return ( !( $class = comet_requires( $className, $file ) ) || !( $_class = new $class ) || !( $_class instanceof $class ) ? false : $_class );

}

function comet_parse_id( $id ){

  return ( is_int( $id = (int)$id ) && $id > -1 ? $id : false );

}

function comet_parse_ids( $entry ){

  if( !is_string( $entry ) || !is_array( $ids = explode( ',', $entry ) ) ){
    return false;

  }
  $nids = [];

  foreach( $ids as $index => $value ){

    if( !( $id = comet_parse_id( $value ) ) ){
      continue;

    }
    $nids[] = $id;

  }
  return ( count( $nids ) < 1 ? false : $nids );

}

?>
