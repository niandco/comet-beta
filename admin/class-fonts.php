<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;

}

final class Comet_Fonts {

	final private function help(){
		$help = __( 'All the fonts you’ve downloaded are listed here and loaded on your site. Comet provides standard set of fonts but not listed on this screen.', 'comet' );
		$help .= '<br><br>';
		$help .= __( 'The fonts library allows you to select fonts to download from Google fonts and remove fonts of your list.', 'comet' );
		$help .= '<br><br>';
		$help .= __( 'Note that the fonts affect page load performance (load time).', 'comet' );

		return $help;

	}

	final public function response(){

		return [
			'help'	=> $this->help(),
			'fonts'	=> comet_get_fonts( 'any', 'fonts' )
		];

	}

}
?>
