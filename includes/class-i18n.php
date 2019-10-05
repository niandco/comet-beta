<?php
namespace Comet\Library;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Comet_i18n {

	private $id = '__cometi18n';

	private $type = null;

	private $i18n = [];

	public function __construct( $type = null ){

		$types = [ 'editor', 'admin' ];

		$type = is_string( $type ) ? strtolower( trim( strip_tags( $type ) ) ) : null; 

		$this->type = $type !== null && in_array( $type, $types ) ? $type : null;

		$this->add( 'messages', [
			'error'	=> [
				'default'	=> __( 'An error has been occurred, please try again.', 'comet' ),
				'title'		=> __( 'The title is missing.', 'comet' ),
				'delete'	=> __( 'An error has been occurred while deleting.', 'comet' ),
				'unreach'	=> __( 'Unreachable content.', 'comet' ),
				'save'		=> __( 'An error has been occurred while saving.', 'comet' ),
			]

		] );

		$this->add( 'messages', [
			'success'	=> [
				'default'	=> __( 'No error found.', 'comet' )
			]
		] );

		$this->add( 'messages', [
			'warning'	=> [
				'delete'	=> __( 'Are you sure you want to delete it permanently ?', 'comet' ),
				'wait'		=> __( 'Please wait while loading. This may take a while.', 'comet' ),
			]

		] );

		$this->add( 'ui', [
			'close'			=> __( 'Close', 'comet' ),
			'cancel'		=> __( 'Cancel', 'comet' ),
			'delete'		=> __( 'Delete', 'comet' ),
			'done'			=> __( 'Done', 'comet' ),
			'save'			=> __( 'Save', 'comet' ),
			'search'		=> __( 'Search...', 'comet' ),
			'select'		=> __( 'Select', 'comet' ),
			'name'			=> __( 'Enter a title...', 'comet' ),
			'pTemplate'     => __( 'Previewing template', 'comet' ),
			'loading'		=> __( 'Loading...', 'comet' )

		] );

	}

	public function get_id(){
		return $this->id;

	}

	private function sanitize_slug( $slug ){

		return ( is_string( $slug ) ? preg_replace( '/(^[0-9]*|[^a-z0-9_]*)/i', '', $slug ) : '' );

	}

	public function add( $id, $data ){

		$this->i18n = $this->push( $id, $data, $this->i18n );

	}

	private function push( $id, $data, $in_array = array() ){

		$id = $this->sanitize_slug( $id );

		$exists = $this->id_exists_in_array( $id, $in_array );

		$in_array = is_array( $in_array ) ? $in_array : [];

		if( !$exists ){
			$in_array[$id] = $data;

		}

		if( !is_array( $data ) ){
			return $in_array;

		}

		foreach( $data  as $key => $value ){

			$in_array[$id] = $this->push( $key, $value, $in_array[$id] );

		}
		return $in_array;

	}

	public function reset(){
		$this->i18n = [];
		return $this->get();

	}

	public function remove( $id ){

		if( $this->id_exists( $id ) ){
			unset( $this->i18n[$id] );
			return true;

		}
		return false;

	}

	public function get(){

		if( $this->type !== null && method_exists( $this, $this->type ) ){
			call_user_func( [ $this, $this->type ] );

		}
		return ( is_array( $this->i18n ) ? $this->i18n : [] );

	}

	public function id_exists( $id ){

		return $this->id_exists_in_array( $id, $this->i18n );

	}

	public function id_exists_in_array( $id, $array ){

		return ( is_array( $array ) && is_string( $id ) && isset( $array[$id] ) );

	}

	private function editor(){

		$this->add( 'options', [
			'section'	=> [
				'title'	=> __( 'Section', 'comet' ),
				'edit'	=> __( 'Section settings', 'comet' ),
				'move'	=> __( 'Move section', 'comet' ),
				'dup'	=> __( 'Duplicate section', 'comet' ),
				'del'	=> __( 'Delete section', 'comet' ),
			],
			'row'		=> [
				'title'	=> __( 'Row', 'comet' ),
				'edit'	=> __( 'Row settings', 'comet' ),
				'move'	=> __( 'Move row', 'comet' ),
				'dup'	=> __( 'Duplicate row', 'comet' ),
				'del'	=> __( 'Delete row', 'comet' ),
			],
			'column'    => [
				'title'	=> __( 'Column', 'comet' ),
				'edit'	=> __( 'Column settings', 'comet' ),
				'move'	=> __( 'Move column', 'comet' ),
				'dup'	=> __( 'Duplicate column', 'comet' ),
				'del'	=> __( 'Delete column', 'comet' ),
			],
			'element'   => [
				'title'	=> __( 'Element', 'comet' ),
				'edit'	=> __( 'Element settings', 'comet' ),
				'move'	=> __( 'Move element', 'comet' ),
				'dup'	=> __( 'Duplicate element', 'comet' ),
				'del'	=> __( 'Delete element', 'comet' ),
			]

		] );

		$this->add( 'ui', [
			'locked'			=> __( 'Locked', 'comet' ),
			'unlocked'			=> __( 'Unlocked', 'comet' ),
			'update'			=> __( 'Update', 'comet' ),
			'desktop'			=> __( 'Desktop', 'comet' ),
			'tablet'			=> __( 'Tablet', 'comet' ),
			'mobile'			=> __( 'Mobile', 'comet' ),
			'browse'			=> __( 'Browse', 'comet' ),
			'remove'			=> __( 'Remove', 'comet' ),
			'edit'				=> __( 'Edit', 'comet' ),
			'bold'				=> __( 'Bold', 'comet' ),
			'italic'			=> __( 'Italic', 'comet' ),
			'st'				=> __( 'Strikethrough', 'comet' ),
			'ilink'				=> __( 'Insert link', 'comet' ),
			'tempname'			=> __( 'Template name', 'comet' ),
			'back'				=> __( 'Back', 'comet' ),
			'underline'			=> __( 'Underline', 'comet' ),
			'preview'			=> __( 'Preview', 'comet' ),
			'insert'			=> __( 'Insert', 'comet' ),
			'elements'			=> __( 'Elements', 'comet' ),
			'layout'			=> __( 'Layout', 'comet' ),
			'sElement'			=> __( 'Search an element...', 'comet' ),
			'saTemplate'		=> __( 'Search a template...', 'comet' ),
			'sIcon'				=> __( 'Search an icon...', 'comet' ),
			'selImage'			=> __( 'Select an image', 'comet' ),
			'mytemplates'		=> __( 'My templates', 'comet' ),
			'saveTemplate'		=> __( 'Save as new template', 'comet' ),
			'editItem'			=> __( 'Item settings', 'comet' ),
			'addItem'			=> __( 'Add item', 'comet' ),
			'sort'				=> __( 'Sort', 'comet' ),
			'cockpit'			=> __( 'Cockpit', 'comet' ),
			'settings'			=> __( 'General settings', 'comet' ),
			'sTemplate'			=> __( 'Save as template', 'comet' ),
			'templates'			=> __( 'Templates library', 'comet' ),
			'exit'				=> __( 'Exit', 'comet' ),
			'clearNx'			=> __( 'Clear notifications', 'comet' ),
			'collapse'			=> __( 'Collapse Cockpit', 'comet' ),
			'notifications'		=> __( 'Notifications', 'comet' )
		] );

		$this->add( 'messages', [
			'stemplate'		=> __( 'Save this page as new template and re-use it on any page or sites you want.', 'comet' ),
			'rmtemplate'	=> __( 'Read more about templates', 'comet' ),
			'warning'		=> [
				'exit'		=> __( 'Are you sure you want to exit ?', 'comet' ),
				'ltemplate'	=> __( 'Please wait while loading the template.', 'comet' )
			],
			'error'			=> [
				'failed'		=> sprintf( __( 'Failed to load %s', 'comet' ), 'Comet' ),
				'savePost'		=> __( 'The post has not been saved.', 'comet' ),
				'noContent'		=> __( 'Failed to save empty content.', 'comet' ),
				'noMenu'		=> __( 'Undefined menu', 'comet' ),
				'ltemplate'		=> __( 'Failed to load the template.', 'comet' )
			],
			'success'		=> [
				'savePost'	=> __( 'The post has been correctly saved.', 'comet' ),
				'ltemplate'	=> __( 'The template has been correctly loaded.', 'comet' )
			]

		] );

	}

	private function admin(){

		$this->add( 'ui', [
			'edit'			=> __( 'Edit', 'comet' ),
			'download'		=> __( 'Download', 'comet' ),
			'import'		=> __( 'Import', 'comet' ),
			'export'		=> __( 'Export', 'comet' ),
			'create'		=> __( 'Create', 'comet' ),
			'selFonts'		=> __( 'Select fonts', 'comet' ),
			'fonts'			=> __( 'Fonts', 'comet' ),
			'addFont'		=> __( 'Add new font', 'comet' ),
			'finish'		=> __( 'Finish downloading', 'comet' ),
			'template'		=> [
				'template'	=> __( '%d template', 'comet' ),
				'templates'	=> __( '%d templates', 'comet' ),
				'new'		=> __( 'Create new template', 'comet' ),
				'import'	=> __( 'Import templates', 'comet' ),
				'preview'	=> __( 'Preview', 'comet' ),
			],
			'nFont'			=> [
				'font'	=> __( '%d font', 'comet' ),
				'fonts'	=> __( '%d fonts', 'comet' ),
			],
			'custom'		=> __( 'Custom', 'comet' ),
			'resource'		=> __( 'Resource type', 'comet' ),
			'embed'			=> __( 'Embed code', 'comet' )

		] );

		$this->add( 'messages', [
			'selFile'	=> __( 'Select one or multiple template to import.', 'comet' ),
			'selFonts1'	=> __( 'Import fonts from your favorite cloud font providers.', 'comet' ),
			'selFonts2'	=> __( 'Here\'s how to get started with importing great fonts to Comet.', 'comet' ),
			'fontSt1'	=> __( 'Browse thousands of fonts from a cloud provider such Google Fonts, TypeKit (Adobe Fonts) or Typography.com (H&Co).', 'comet' ),
			'fontSt2'	=> __( 'Copy the embed code (link or @import) provided. In Comet > Fonts click the button to add a new font and paste the code in the Embed code field then click import.', 'comet' ),
			'fontSt3'	=> __( 'You can now use it all over your pages just by selecting font from element controls. That\'s it!', 'comet' ),
			'redirect'	=> __( 'You will be redirected to the edit page automatically. If it fails please click the link:', 'comet' ),
			'editPage'	=> __( 'Go to the edit page', 'comet' ),
			'warning'	=> [
				'export'	=> __( 'Exporting is only supported on computers with up to date and modern browser. You may encounter compatibility issues and errors if it\'s not the case.', 'comet' ),
				'import'	=> __( 'You must not exit the current session while importing the templates.', 'comet' )
			],
			'error'		=> [
				'export'		=> __( 'An error has been occurred while exporting the template.', 'comet' ),
				'noTemplate'	=> __( 'Template not found.', 'comet' ),
				'failedFonts'	=> __( 'Failed to connect with Google Fonts. Please verify your API key.', 'comet' ),
				'noFonts'		=> __( 'No fonts found.', 'comet' ),
				'unreachFont'	=> __( 'Unreachable font. Please make sure the embed code is valid.', 'comet' ),
				'noFont'		=> __( 'Font not found.', 'comet' ),
				'failFont'		=> __( 'Font has not been imported correctly.', 'comet' ),
				'delFont'		=> __( 'The font and its styles have not been deleted.', 'comet' )
			],
			'success'	=> [
				'export'		=> __( 'The template has been correctly created and ready to be downloaded. Click the link below to download the template.', 'comet' ),
				'newTemplate'	=> __( 'The template has been correctly created.', 'comet' ),
				'delTemplate'	=> __( 'The template has been correctly deleted.', 'comet' ),
				'delFont'		=> __( 'The font and its styles have been correctly deleted.', 'comet' ),
			]

		] );
		
	}
}
?>