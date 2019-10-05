<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}

final class Comet_Home {

	private $user = null;

	public function __construct(){
		$this->user = wp_get_current_user();

	}

	final private function help(){
		$help = __( 'Welcome to your Comet dashboard! This screen gives you access to the general features of Comet.', 'comet' );
		$help .= '<br><br>';
		$help .= __( 'The Comet logo at the top left is the main menu and provides links to all of the Comet administration screens.', 'comet' );
		$help .= '<br><br>';
		$help .= __( 'The cross at the top right allows you to close the Comet dashboard.', 'comet' );

		return $help;

	}

	final public function response(){

		return [
			'user_login'	=> $this->user->user_login,
			'help'			=> $help,
			'widgets'		=> [
				'intro'		=> $this->intro(),
				'slider'	=> $this->slider(),
				'docs'		=> $this->docs(),
				'learn'		=> $this->learn()
			],
		];

	}

	final private function intro(){

		return [
			'h2'		=> sprintf( __( 'Hi %s !', 'comet' ), $this->user->user_login ),
			'p1'		=> __( 'Welcome to Comet. Here is the dashboard to manage some parts of Comet.', 'comet' ),
			'p2'		=> __( 'Your opinion is really important to us to bring new ideas and make Comet better. We truly appreciate the time you may take to write some lines about your experience with Comet.', 'comet' ),
			'button'	=> [
				'title'	=> __( 'Write a review', 'comet' ),
				'url'	=> esc_url( 'https://wordpress.org/support/plugin/comet-lite/reviews/?filter=5#new-post' )
			]

		];

	}

	final private function slider(){

		$o1 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'Settings', 'comet' ) . '</strong>';
		$o2 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'Fonts', 'comet' ) . '</strong>';
		$o3 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'My templates', 'comet' ) . '</strong>';

		return [

			'buttonset'	=> [
				'next'	=> __( 'Next', 'comet' ),
				'back'	=> __( 'Back', 'comet' )

			],

			'slides'	=>[
				[
					'id'		=> 'start',
					'title'		=> __( 'Getting started with Comet.', 'comet' ),
				],
				[
					'id'		=> 'setup',
					'title'		=> __( 'Setup', 'comet' ),
					'content'	=> sprintf( __( 'Comet requires only one step to get it fully ready. To setup the general settings go to %s.', 'comet' ), $o1 ),
				],
				[
					'id'		=> 'fonts',
					'title'		=> __( 'Fonts', 'comet' ),
					'content'	=> sprintf( __( 'Comet allows you to import fonts from Google Fonts easily and use them on your projects. To manage your fonts go to %s.', 'comet' ), $o2 ),
				],
				[
					'id'		=> 'template',
					'title'		=> __( 'My templates', 'comet' ),
					'content'	=> sprintf( __( 'With Comet you can save your projects as templates for a later use. You can also edit, remove, export or import the templates. To manage your templates go to %s.', 'comet' ), $o3 ),
				],
			]
		];

	}

	final private function learn(){

		return [
			[
				'title'	=> __( 'Comet', 'comet' ),
				'desc'	=> __( 'Know more about Comet and the features.', 'comet' ),
				'url'	=> esc_url( 'https://blacklead.fr/support/docs/comet' ),
			],
			[
				'title'	=> __( 'Dashboard overview', 'comet' ),
				'desc'	=> __( 'Getting started with the major components of the UI.', 'comet' ),
				'url'	=> esc_url( 'https://blacklead.fr/support/docs/comet/user-interface/' ),
			],
			[
				'title'	=> __( 'Editor overview', 'comet' ),
				'desc'	=> __( 'Learn to use the basic layout.', 'comet' ),
				'url'	=> esc_url( 'https://blacklead.fr/support/docs/comet/user-interface/' ),
			],
		];

	}

	final private function docs(){

		return [
			'title'	=> __( 'Read the documentation', 'comet' ),
			'url'	=> esc_url( 'https://blacklead.fr/support/docs/comet' )
		];

	}

}
?>