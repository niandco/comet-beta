<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}
require_once 'class-page.php';
use Comet\Admin\Comet_Page;

class Comet_Interface extends Comet_Page {

	private function _menu(){

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

	}

}