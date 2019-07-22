<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
    exit;

}
require_once 'class-interface.php';

class settings extends Comet_Interface{

    protected $menu_title;

    protected $page_title;

    protected $slug = 'settings';

    private $settings = [];

    private $is_action = false;

    private $post = [];

    private $options = [];

    public function __construct(){

        $this->menu_title = __( 'Settings', 'comet' );
        $this->page_title = __( 'General settings', 'comet' );

    }

    public function instance( $pages ){
        $this->pages = $pages;

        $this->set_setting(
            'post_types', 
            array(
                'label'		=> __( 'Post Types', 'comet' ),
                'desc'		=> __( 'Check post types you want Comet works with.', 'comet' ),
                'type'		=> '_checkbox',
                'choices'	=> comet_get_post_types( 'apt_' )
            )
        );

        /*$this->set_setting(
            'googlekey',
            array(
                'label'		=> __( 'Google API key', 'comet' ),
                'desc'		=> __( 'Google Fonts requires authentication (API key). Comet uses it only from the dashboard.', 'comet' ) . ' <a target="_blank" href="'. esc_url( 'https://developers.google.com/fonts/docs/developer_api#identifying_your_application_to_google' ). '">' . __( 'Read more', 'comet' ) . '</a>.',
                'type'		=> '_text',
            )
        );*/

        $this->set_setting(
            'uninstall',
            array(
                'label'		=> __( 'Uninstall (Deep)', 'comet' ),
                'desc'		=> __( 'Check the box to completely remove all data on uninstall.', 'comet' ),
                'type'		=> '_checkbox',
                'choices'	=> array(
                    'uninstall'	=> __( 'Remove all data on uninstall ?', 'comet' )
                )
            )
        );
        $this->page();

    }

    private function sanitize_id( $id ){

        $_p = '/[^a-z\_]/i';

        return ( !is_string( $id ) || !strlen( $id = trim( strip_tags( $id ) ) ) || preg_match( $_p, $id ) ? false : $id );

    }

    private function setting_exists( $id ){

        return ( is_array( $this->settings ) && isset( $this->settings[$id] ) );

    }

    private function set_setting( $id, $data ){

        if( !( $id = $this->sanitize_id( $id ) ) || !is_array( $data ) || !isset( $data['type'] ) || !is_string( $type = $data['type'] ) ){
            return false;

        }

        if( !in_array( $type, array( '_select', '_text', '_number', '_checkbox', '_radio' ) ) || !method_exists( $this, $type ) ){
            return false;

        }

        if( !isset( $data['label'] ) || !is_string( $data['label'] ) ){
            return false;

        }

        if( !strlen( $data['label'] = trim( strip_tags( $data['label' ] ) ) ) ){
            return false;

        }
        $this->settings[$id] = $data;
        return true;

    }

    public function has_settings(){

        return ( is_array( $this->settings ) && count( $this->settings ) > 0 );

    }

    protected function content(){

        if( !$this->has_settings() ){
        	echo comet_message( __( 'No settings.', 'comet' ), 'warning' );
        	return;

        }
    	$this->post = ( is_array( $_POST ) ? $_POST : array() );
    	$this->is_action = isset( $this->post['_comet_nonce'] );
    	$this->options = get_option( 'comet_settings' );
    	$options = array();
    	$fields = '';

        foreach( $this->settings as $id => $param ){

            $field = call_user_func( array( $this, $param['type'] ), $id, $param );

            $fields .= '<div class="comet-setting comet-row col2">';
            $fields .= '<div class="comet-settingBlock first comet-column col1">';
            $fields .= '<label for="' . $id . '">' . $param['label'] . '</label>';

            if( isset( $param['desc'] ) && is_string( $param['desc'] ) ){
                $fields .= '<div class="comet-settingDesc">' . trim( strip_tags( $param['desc'], '<a><span><br>' ) ) . '</div>';

            }
            $fields .= '</div>';
            $fields .= '<div class="comet-settingBlock last comet-column col2">';

            if( is_array( $field ) ){

            	if( isset( $field['content'] ) && is_string( $field['content'] ) ){
            		$fields .= $field['content'];

            	}

            	if( isset( $field['value'] ) ){
            		$options[$id] = $field['value'];

            	}

            }
            $fields .= '</div>';
            $fields .= '</div>';


        }
        echo '<form action="' . esc_url( comet_get_dashboard_url( $this->slug ) ) . '" method="post">';

        if( $this->is_action ){

        	if( !wp_verify_nonce( $this->post['_comet_nonce'], 'comet_dash_settings_nonce' ) ){
        		echo comet_message( __( 'Action not valid.', 'comet' ), 'error' );

        	}else if( is_array( $options ) && update_option( 'comet_settings', $options ) ){
        		echo comet_message( __( 'Settings have been saved successfully.', 'comet' ), 'success' );


        	}else{
        		echo comet_message( __( 'Settings have not been saved.', 'comet' ), 'error' );

        	}

        }
        echo $fields;
        echo '<button type="submit" class="comet-button comet-buttonPrimary">' . __( 'Save', 'comet' ) . '</button>';
        echo '<input type="hidden" id="comet-nonce" name="_comet_nonce" value="' . wp_create_nonce( 'comet_dash_settings_nonce' ) . '" />';
        echo '</form>';

    }

    private function _toClasses(){

        return 'comet-input comet-field';

    }

    private function _onreturn( $content, $value = false ){

    	return array(
    		'content'	=> is_string( $content ) ? $content : '',
    		'value'		=> is_string( $value ) || is_array( $value ) || is_numeric( $value ) || is_bool( $value ) ? $value : '' 
    	);

    }

    private function _get_value( $id ){

    	if( isset( $this->post[$id] ) ){
    		return $this->post[$id];

    	}

    	if( is_array( $this->options ) && isset( $this->options[$id] ) ){
    		return $this->options[$id];

    	}

    	if( isset( $this->settings['std'] ) ){
    		return $this->settings['std'];

    	}
    	return '';

    }

    private function _text( $id ){
    	$value = sanitize_text_field( $this->_get_value( $id ) );

    	$input = '<input class="' . $this->_toClasses() . '" type="text" id="' . $id . '" name="' . $id . '" value="' . esc_attr( $value ) . '" />';

    	return $this->_onreturn( $input, $value );

    }

    private function _select( $id ){
    	$value = $this->_get_value( $id );
    	$select = '';
    	$is_valid = false;

        if( isset( $this->settings[$id]['choices'] ) && is_array( $choices = $this->settings[$id]['choices'] ) ){
        	$select = '<select id="' . $id . '" class="' . $this->_toClasses() . '" name="' . $id . '">';

        	foreach( $choices as $key => $label ){
        		$selected = '';

        		if( $key === $value ){
        			$is_valid = true;
        			$selected = ' selected="selected"';

        		}
            	$select .= '<option value="' . esc_attr( $key ) . '"' . $selected . '>' . $label . '</option>';

            }
            $select .= '</select>';

        }

        if( !$is_valid ){
        	$value = '';

        }
        return $this->_onreturn( $select, $value );

    }

    private function _number( $id ){
    	$value = (float) $this->_get_value( $id );

        $input = '<input class="comet-inline ' . $this->_toClasses() . '" type="number" id="' . $id . '" name="' . $id . '" value="' . esc_attr( $value ) . '" />';

        if( isset( $this->settings[$id]['unit'] ) ){
            $input .= '<span class="comet-inline">' . $this->settings[$id]['unit'] . '</label>';

        }
        return $this->_onreturn( $input, $value );

    }

    private function _radio( $id ){
    	$value = $this->_get_value( $id );
    	$radio = '';
    	$is_valid = false;
        $i = 0;

        if( isset( $this->settings[$id]['choices'] ) && is_array( $choices = $this->settings[$id]['choices'] ) ){

        foreach( $choices as $key => $label ){
        	$checked = '';
        	$class = 'comet-wrapper';
        	$id_ = $id . $i;

        	if( $value === $key ){
        		$is_valid = true;
        		$checked = ' checked="checked"';
        		$class .= ' comet-active';

        	}
        	$radio .= '<label for="' . $id . $i . '" class="' . $class . '">';
            $radio .= '<span>'. ( is_string( $label ) ? trim( strip_tags( $label ) ) : __( 'Undefined', 'comet' ) ) . '</span>';
            $radio .= '<input class="' . $this->_toClasses() . '" type="radio" name="' . $id . '" id="' . $id_ . '" value="' . esc_attr( $key ) . '"' . $checked . ' />';
            $radio .= '</label>';
            $i++;
        }
    }

        if( !$is_valid ){
        	$value = '';

        }
        return $this->_onreturn( $radio, $value );

    }

    private function _checkbox( $id ){
    	$values = is_array( $values = $this->_get_value( $id ) ) ? $values : array();
    	$checkbox = '';
    	$i = 0;

        if( isset( $this->settings[$id]['choices'] ) && is_array( $choices = $this->settings[$id]['choices'] ) ){

        	foreach( $choices as $key => $label ){
        		$id_ = $id . $i;
        		$name = "{$id}[{$key}]";
        		$checked = '';

        		if( isset( $values[$key] ) && (int)$values[$key] === 1 ){
        			$checked = ' checked="checked"';

        		}
        		$checkbox .= '<div class="comet-fieldCheckbox">';
        		$checkbox .= '<input class="' . $this->_toClasses() . '" type="checkbox" name="'. $name .'" id="' . $id_ . '" value="1"' . $checked . ' />';
        		$checkbox .= '<label for="' . $id_ . '" class="comet-middleIb">' . ( is_string( $label ) ? trim( strip_tags( $label ) ) : __( 'Undefined', 'comet' ) ) . '</label>';
        		$checkbox .= '</div>';
        		$i++;
        	}
        }
        return $this->_onreturn( $checkbox, $values );

    }

}
?>
