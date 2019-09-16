<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
    exit;
}
require_once 'class-interface.php';

class mytemplates extends Comet_Interface {

    protected $menu_title;

    protected $page_title;

    protected $slug = 'mytemplates';

    private $className = [
        'main'      => 'comet-page--mytemplates',
    ];

    public function __construct(){

        $this->menu_title = __( 'My templates', 'comet' );
        $this->page_title = __( 'My templates', 'comet' );

    }

    public function instance( $pages ){
        $this->pages = $pages;
        $this->page();

    }

    protected function content() {
        $action = comet_get_dashboard_url( 'mytemplates' );
        $templates = comet_get_mytemplates([
            'post_status'     => 'any',
            'nopaging'        => false,
            'posts_per_page'  => 50
        ]);
        $nbTemplates = sprintf( _n( '%d template', '%d templates', $templates->found_posts, 'comet' ), $templates->found_posts );
        $cnew = __( 'Create new', 'comet' );
        $cimport = __( 'Import', 'comet' );

        echo <<<CONTENT
        <header class="{$this->className['main']}__header">
            <div class="{$this->className['main']}__header__column {$this->className['main']}__header__column--c1">
                <h4>$nbTemplates</h4>
            </div>
            <div class="{$this->className['main']}__header__column {$this->className['main']}__header__column--c2">
                <button class="comet-button comet-button--primary comet-button--circle comet-button--has-icon {$this->className['main']}__new" title="$cnew">
                    <span class="comet-button__icon cico cico-plus"></span>
                </button>
                <div class="{$this->className['main']}__import">
                    <input type="file" id="{$this->className['main']}__import__files" class="{$this->className['main']}__import__files" multiple accept=".json" />
                    <button class="comet-button comet-button--circle comet-button--has-icon {$this->className['main']}__import__select" title="$cimport">
                        <span class="comet-button__icon cico cico-import"></span>
                    </button>
                </div>
            </div>
        </header>

        <ul class="{$this->className['main']}__list">
CONTENT;

        if( $templates->have_posts() ){

            while( $templates->have_posts() ){
                $templates->the_post();
                $single = $templates->post;
                $id = $single->ID;
                echo self::template( $id, $single );
                
            }
            wp_reset_postdata();

        }
        echo '</ul>';

    }

    private function template( $id, $single ){

        $className = "{$this->className['main']}__list__item";
        $date = get_the_date();
        $author = get_the_author();
        $title = ucfirst( get_the_title() );

        $events = [
            'edit'      => [
                'title'     => __( 'Edit', 'comet' ),
                'url'       => $this->edit_link( $id ),
                'inner'		=> 'title',

            ],
            'preview'   => [
                'title'     => __( 'Preview', 'comet' ),
                'url'       => $this->preview_link( $id ),
                'icon'		=> 'cico cico-eye',
                'inner'		=> 'icon',
                
            ],
            'export'    => [
                'title'     => __( 'Export', 'comet' ),
                'icon'		=> 'cico cico-export',
                'inner'		=> 'icon',
                'data'      => [
                    'id'    => $id
                ]
                
            ],
            'delete'   => [
                'title'     => __( 'Delete', 'comet' ),
                'icon'		=> 'cico cico-trash',
                'inner'		=> 'icon',
                'data'      => [
                    'id'    => $id
                ]
                
            ],
        ];

        $oEvents = '';

        foreach( $events as $key => $values ){
        	$attr = '';
        	$inner = '';

        	if( isset( $values['url'] ) && is_string( $values['url'] ) ){
        		$attr .= 'href="' . esc_url( trim( $values['url'] ) ) . '"';

        	}

        	if( isset( $values['data'] ) && is_array( $values['data'] ) ){

        		foreach( $values['data'] as $datakey => $value ){

        			if( is_string( $datakey ) ){
        				$value = esc_attr( $value );
        				$attr .= " data-{$datakey}=\"$value\"";

        			}

        		}

        	}

        	if( isset( $values['title'] ) && is_string( $values['title'] ) ){
        		$attr .= " title=\"{${esc_attr( $values['title'] ) }}\"";

        	}
        	$attr = trim( $attr );

        	if( isset( $values['inner'] ) ){

        		if( $values['inner'] === 'icon' && is_string( $values['icon'] ) ){
        			$inner = "<span class=\"comet-button__icon {$values['icon']}\"></span>";

        		}else if( is_string( $values['title'] ) ){
        			$inner = $values['title'];

        		}

        	}


        	$oEvents .= <<<ITEM
                <a class="comet-button comet-button--primary {$className}__event {$className}__event--{$key}" $attr>$inner</a>
ITEM;

        }

        return <<<ITEM
        <li class="$className">
            <div class="{$className}__meta">
                <h4 class="{$className}__title">$title</h4>
                <p>
                <span class="{$className}__date">$date</span>•<span class="{$className}__author">$author</span>
                </p>
            </div>

            <div class="{$className}__events">
            	$oEvents
            </div>
        </li>
ITEM;

    }

    private function edit_link( $id ){

        return comet_get_post_edit_link( $id, false );

    }

    private function preview_link( $id ){

        return add_query_arg( 'id', $id, comet_get_dashboard_url( 'preview' ) );

        /*return add_query_arg(
          array(
            'page'    => 'cometmuscreen',
            'action'  => 'preview',
            'id'      => $id
        ),
          get_admin_url( null, 'admin.php' )
      );*/

    }

}
?>
