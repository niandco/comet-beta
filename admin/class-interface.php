<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-page.php';
use Comet\Admin\Comet_Page;

class Comet_Interface extends Comet_Page {

	/*private function _menu(){

		if( !isset( $this->pages ) || !is_array( $this->pages ) ){
			return;

		}
		echo '<ul id="comet-dashboardSidebarMenu" class="comet-row col2">';

		foreach( $this->pages as $slug => $class ){

			if( !is_object( $class ) || !is_object( $class->get_data() ) || !( $_slug = $class->get_slug() ) ){
				continue;

			}
			$data = $class->get_data();

			if( !current_user_can( $data->capability ) || ( is_bool( $data->public ) && !$data->public ) ){
				continue;

			}
			echo '<li class="comet-dashboardSidebarMenuItem comet-column">';
			echo '<a href="'. esc_url( comet_get_dashboard_url( $_slug ) ) .'">';
			echo $data->menu_title;
			echo '</a></li>';

		}
		echo '</ul>';

	}

	protected function body(){

		$data = $this->get_data();

		echo '<div class="comet-header">';

		echo '<div class="comet-column col1">';
		echo '<div class="comet-middleIb comet-dashTopBarMenuPop">';
		echo '<a href="#" id="comet-doSidebarOpen" class="comet-dashTopBarItem"><span class="comet-icon cico cico-comet"></span></a>';
		echo '<div id="comet-dashboardSidebar">';
		echo '<div>';
		echo '<button id="comet-doSidebarClose" class="comet-button comet-buttonPrimary"><span class="comet-icon cico cico-arrow-left-alt"></span>' . __( 'Close', 'comet' ) . '</button>';
		$this->_menu();
		echo '</div>';
		echo '</div>';
		echo '</div>';
		echo '</div>';

		echo '<div class="comet-column col2">';
		echo '<h1>' . $data->page_title . '</h1>';
		echo '</div>';

		echo '<div class="comet-column col3">';
		echo '<div class="comet-middleIb comet-dashTopBarMenuPop comet-tooltip">';
		echo '<a href="#" class="comet-dashTopBarItem comet-buttonTooltip"><span class="comet-icon cico cico-question"></span></a>';
		echo '<div class="comet-innerTooltip">';
		echo '<div class="comet-headerTooltip comet-blockTooltip">';
		echo '<h4>' . __( 'Help', 'comet' ) . '</h4>';
		echo '</div>';

		if( !empty( $data->help ) ){
			echo '<div class="comet-mainTooltip comet-blockTooltip"><p>' . $data->help . '</p></div>';

		}
		echo '<div class="comet-footerTooltip comet-blockTooltip">';
		echo '<a class="comet-linkTooltip" href="' . esc_url( 'https://blacklead.fr/support/docs/comet' ) . '" target="_blank">' . __( 'Documentation', 'comet' ) . '<span class="cico cico-arrow-right"></span></a>';
		echo '<a class="comet-linkTooltip" href="' . esc_url( 'https://wordpress.org/support/plugin/comet-lite/' ) . '" target="_blank">' . __( 'Support', 'comet' ) . '<span class="cico cico-arrow-right"></span></a>';
		echo '</div>';
		echo '</div>';
		echo '</div>';
		echo '<div class="comet-middleIb comet-dashTopBarMenuPop">';
		echo '<a href="' . esc_url( get_admin_url() ) . '" class="comet-dashTopBarItem"><span class="comet-icon cico cico-x"></span></a>';
		echo '</div>';
		echo '</div>';

		echo '</div>';
		echo '<div class="comet-content comet-main">';
		echo '<div class="comet-boxed comet-content">';

		if( !current_user_can( $data->capability ) ){
			echo comet_message( __( 'Access denied.', 'comet' ), 'warning' );

		}else if( method_exists( $this, 'content' ) ){
			$this->content();

		}
		echo '</div>';
		echo '</div>';

	}*/

	private function __menuItem( $slug, $title, $url ){

		$className = 'comet-page--dashboard__sidebar__menu__item';

		echo <<<ITEM
		<li class="$className {$className}--{$slug}">
			<a class="{$className}__url {$className}__url--{$slug}" href="$url" aria-label="$title">$title</a>
		</li>
ITEM;

	}

	private function __cardItem( $id, $url, $icon, $title ){
		$className = "comet-page--dashboard__sidebar";

		echo <<<CARD
		<a class="{$className}__card {$className}__card--c{$id}" href="$url" target="_blank">
			<figure><span class="cico cico-{$icon}"></span></figure>
			<aside>$title</aside>
		</a>
CARD;

	}

	private function __sidebar(){

		if( !isset( $this->pages ) || !is_array( $this->pages ) ){
			return;

		}
		$className = "comet-page--dashboard__sidebar";

		echo <<<NAV
		<nav class="$className">
			<ul class="{$className}__menu">

NAV;

		$this->__menuItem( 'close', __( 'WordPress', 'comet' ), esc_url( get_admin_url() ) );

		foreach( $this->pages as $slug => $class ){

			if( !is_object( $class ) || !is_object( $class->get_data() ) || !( $_slug = $class->get_slug() ) ){
				continue;

			}
			$data = $class->get_data();

			if( !current_user_can( $data->capability ) || ( is_bool( $data->public ) && !$data->public ) ){
				continue;

			}
			$this->__menuItem( $_slug, $data->menu_title, esc_url( comet_get_dashboard_url( $_slug ) ) );

		}
		$rate = __( 'Rate', 'comet' );

		echo <<<NAV
			</ul>
			<div class="{$className}__cards">
NAV;
		$this->__cardItem(
			1,
			esc_url( 'https://blacklead/support/docs/comet' ),
			'comet',
			__( 'Get started with Comet', 'comet' )
		);

		$this->__cardItem(
			2,
			esc_url( 'https://wordpress.org/support/plugin/comet-lite/reviews/?filter=5#new-post' ),
			'icon',
			__( 'Rate', 'comet' )
		);

		$this->__cardItem(
			3,
			esc_url( 'https://blacklead.fr/comet' ),
			'bookmark',
			'Blacklead'
		);

		echo <<<NAV
			</div>
		</nav>

NAV;

	}

	protected function body(){

		$data = $this->get_data();
		$tooltip = [
			'title'		=> __( 'Help', 'comet' ),
			'content'	=> ( !empty( $data->help ) ? '<p class="comet-page--dashboard__header__tooltip__content">' . $data->help . '</p>' : '' ),
			'links'		=> [
				'docs'		=> [
					'title'	=> __( 'Documentation', 'comet' ),
					'link'	=> esc_url( 'https://blacklead.fr/support/docs/comet' )
				],
				'support'	=> [
					'title'	=> __( 'Support', 'comet' ),
					'link'	=> esc_url( 'https://wordpress.org/support/plugin/comet-lite/' )
				]
			]
		];

		$this->__sidebar();

		echo <<<LAYOUT
		<main class="comet-page--dashboard__wrap">
			<header class="comet-page--dashboard__header">

				<div class="comet-page--dashboard__header__column comet-page--dashboard__header__column--c1">
					<a href="#" class="comet-page--dashboard__sidebar__toggle comet-page--dashboard__header__item">
						<span class="comet-icon cico cico-comet"></span>
					</a>
				</div>

				<div class="comet-page--dashboard__header__column comet-page--dashboard__header__column--c2">
					<h1 class="comet-page--dashboard__header__item">{$data->page_title}</h1>
				</div>

				<div class="comet-page--dashboard__header__column comet-page--dashboard__header__column--c3">
					<div class="comet-tooltip comet-page--dashboard__header__tooltip">
						<a href="#" class="comet-page--dashboard__header__item">
							<span class="comet-icon cico cico-question"></span>
						</a>
						<div class="comet-tooltip__main comet-tooltip__main--right">
							<h4 class="comet-page--dashboard__header__tooltip__title">{$tooltip['title']}</h4>
							{$tooltip['content']}
							<div class="comet-page--dashboard__header__tooltip__footer">
LAYOUT;

			foreach( $tooltip['links'] as $key => $value ){

				echo <<<LINKS
				<a class="comet-page--dashboard__header__tooltip__footer__link" href="{$value['link']}" target="_blank">
					{$value['title']}
					<span class="cico cico-arrow-right"></span>
				</a>
LINKS;

			}

		echo <<<LAYOUT
							</div>
						</div>
					</div>
				</div>

			</header>

			<section class="comet-page--dashboard__main">
				<div class="comet-page--dashboard__content">
LAYOUT;

				if( !current_user_can( $data->capability ) ){
					echo comet_message( __( 'Access denied.', 'comet' ), 'warning' );

				}else if( method_exists( $this, 'content' ) ){
					$this->content();

				}

			echo <<<LAYOUT
				</div>
			</section>
		</main>
LAYOUT;

	}

}