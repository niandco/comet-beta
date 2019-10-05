<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
	exit;
}

final class Comet_Templates {

	final public function response(){

		return [
			'templates' => comet_get_mytemplates( null, false )
		];


	}

}
?>
