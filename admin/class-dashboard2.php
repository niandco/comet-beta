<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-pages2.php';
use Comet\Admin\Comet_pages2;

final class Comet_Dashboard2 extends Comet_pages2 {

	private $base_path = COMET_PATH . 'admin/';

	public function __construct(){

		parent::__construct();

		add_action( 'comet_admin_header', [ $this, 'styles' ] );
		add_action( 'comet_admin_footer', [ $this, 'scripts' ] );


	}


	final public function styles(){

		$url = COMET_URL;

		comet_print_style( "{$url}src/css/cico.min.css" );
		comet_print_style( "{$url}src/css/admin.css" );

	}

	final public function scripts(){
		$url = COMET_URL;
		$i18n = comet_get_i18n( 'admin' );

		comet_localize( 
			'__cometdata',
			[
				'ajax_url'		=> admin_url( 'admin-ajax.php' ),
				'admin_url'		=> admin_url(),
				'security'		=> wp_create_nonce( 'comet-ajax-nonce' ),
				'edit_url'		=> admin_url( 'post.php' ),
				'pages'			=> $this->get_pages(),
				'help'			=> [
					'title'	=> __( 'Help', 'comet' ),
					'links'	=> [
						[
							'title'	=> __( 'Documentation', 'comet' ),
							'url'	=> esc_url( 'https://blacklead.fr/support/docs/comet' )
						],
						[
							'title'	=> __( 'Support', 'comet' ),
							'url'	=> esc_url( 'https://wordpress.org/support/plugin/comet-lite/' )
						]
					]
				],
				'user'			=> 'true'
			]
		);
		comet_localize( $i18n->get_id(), $i18n->get() );
		comet_print_script( "{$url}src/js/admin.js" );

	}

	final public function render(){

		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

		if ( !defined( 'WP_ADMIN' ) ) {
			require_once  ABSPATH . 'wp-admin/admin.php';

		}

		_wp_admin_html_begin();

		echo <<<HEAD
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<title>Comet</title>
HEAD;

		do_action( 'comet_admin_header' );

		echo <<<HEAD
		</head>
		<body class="comet-page">
HEAD;

		do_action( 'comet_admin_footer' );

		echo <<<HEAD
		</body>
		</html>
HEAD;
		exit;

	}

}
?>