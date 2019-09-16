<?php
namespace Comet\Admin\Dashboard;

if( !defined( 'ABSPATH' ) ){
    exit;

}
require_once 'class-interface.php';

class main extends Comet_Interface {

    protected $menu_title;

    protected $page_title;

    protected $help;

    protected $slug = 'main';

    private $className = [
        'widget'      => 'comet-page--main__widget'
    ];

    public function __construct(){

    	$help = __( 'Welcome to your Comet dashboard! This screen gives you access to the general features of Comet.', 'comet' );
    	$help .= '<br><br>';
    	$help .= __( 'The Comet logo at the top left is the main menu and provides links to all of the Comet administration screens.', 'comet' );
    	$help .= '<br><br>';
    	$help .= __( 'The cross at the top right allows you to close the Comet dashboard.', 'comet' );

        $this->menu_title = __( 'Dashboard', 'comet' );
        $this->page_title = __( 'Dashboard', 'comet' );
        $this->help = $help;

    }

    public function instance( $pages ){
        $this->pages = $pages;
        $this->page();

    }

    protected function content(){

        $className = 'comet-page--main__content';

        echo <<<CONTENT
        <div class="$className">

            <div class="{$className}__column {$className}__column--c1">
                {$this->welcome()}
            </div>

            <div class="{$className}__column {$className}__column--c2">
                {$this->tour()}
            </div>

            <div class="{$className}__column {$className}__column--c3">
                {$this->learn()}
                {$this->support()}
            </div>

        </div>
CONTENT;

    }

    private function welcome(){
        $user = wp_get_current_user();
        $url = esc_url( 'https://wordpress.org/support/plugin/comet-lite/reviews/?filter=5#new-post' );
        $content = [
            'h2'        => sprintf( __( 'Hi %s !', 'comet' ), $user->user_login ),
            'p1'        => __( 'Welcome to Comet. Here is the dashboard to manage some parts of Comet.', 'comet' ),
            'p2'        => __( 'Your opinion is really important to us to bring new ideas and make Comet better. We truly appreciate the time you may take to write some lines about your experience with Comet.', 'comet' ),
            'button'    => __( 'Write a review', 'comet' )

        ];

        $output = <<<CONTENT
        <div class="{$this->className['widget']} {$this->className['widget']}--intro">
            <h2>{$content['h2']}</h2>
            <p>{$content['p1']}</p>
            <p>{$content['p2']}</p>
            <a class="comet-button comet-button--rounded {$this->className['widget']}--intro__button" href="$url" target="_blank">
                {$content['button']}
            </a>
        </div>

CONTENT;

        return $output;

    }

    private function tour(){

        $o1 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'Settings', 'comet' ) . '</strong>';
        $o2 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'Fonts', 'comet' ) . '</strong>';
        $o3 = '<strong>' . __( 'Comet dashboard', 'comet' ) . '</strong> > <strong>' . __( 'Menu', 'comet' ) . '</strong> > <strong>' . __( 'My templates', 'comet' ) . '</strong>';

        $slides = [
            [
                'id'    => 'start',
                'title' => __( 'Getting started with Comet.', 'comet' ),
            ],
            [
                'id'       => 'setup',
                'title'    => __( 'Setup', 'comet' ),
                'content'  => sprintf( __( 'Comet requires only one step to get it fully ready. To setup the general settings go to %s.', 'comet' ), $o1 ),
            ],
            [
                'id'       => 'fonts',
                'title'    => __( 'Fonts', 'comet' ),
                'content'  => sprintf( __( 'Comet allows you to import fonts from Google Fonts easily and use them on your projects. To manage your fonts go to %s.', 'comet' ), $o2 ),
            ],
            [
                'id'       => 'template',
                'title'    => __( 'My templates', 'comet' ),
                'content'  => sprintf( __( 'With Comet you can save your projects as templates for a later use. You can also edit, remove, export or import the templates. To manage your templates go to %s.', 'comet' ), $o3 ),
            ],
        ];

        $total = count( $slides );

        $o = <<<ITEMS
        <div class="{$this->className['widget']} {$this->className['widget']}--slider">
ITEMS;

        for( $n = 0; $n < $total; $n++ ){
            $slide = $slides[$n];
            $has_title = ( isset( $slide['title'] ) && !empty( $slide['title'] ) );
            $has_content = ( isset( $slide['content'] ) && !empty( $slide['content'] ) );

            if( !$has_title && !$has_content ){
                continue;

            }
            $id = $n + 1;

            $o .= <<<ITEM
            <div class="{$this->className['widget']}--slider__slide {$this->className['widget']}--slider__slide--{$slide['id']}">
                <div class="{$this->className['widget']}--slider__slide__counter">
                    <span>{$id}/{$total}</span>
                </div>
                <div class="{$this->className['widget']}--slider__slide__content">
ITEM;

            if( $has_title ){
                $o .= '<h4>' . $slide['title'] . '</h4>';

            }

            if( $has_content ){
                $o .= '<p>' . $slide['content'] . '</p>';

            }
            $o .= '</div>';
            $o .= "<div class=\"{$this->className['widget']}--slider__slide__buttonset\">";

            if( $id > 1 ){
                $title = __( 'Back', 'comet' );
                $o .= "<button class=\"{$this->className['widget']}--slider__slide__button {$this->className['widget']}--slider__slide__button--prev\" title=\"$title\">";
                $o .= '<span class="cico cico-arrow-left-alt"></span>';
                $o .= '</button>';

            }

            if( $id < $total ){
                $title = __( 'Next', 'comet' );
                $o .= "<button class=\"{$this->className['widget']}--slider__slide__button {$this->className['widget']}--slider__slide__button--next\" title=\"$title\">";
                $o .= '<span class="cico cico-arrow-right-alt"></span>';
                $o .= '</button>';

            }
            $o .= '</div>';
            $o .= '</div>';

        }
        $o .= '</div>';

        return $o;

    }

    private function learn(){

        $docs = [
            [
                'title' => __( 'Comet', 'comet' ),
                'desc'  => __( 'Know more about Comet and the features.', 'comet' ),
                'url'   => 'https://blacklead.fr/support/docs/comet',
            ],
            [
                'title' => __( 'Dashboard overview', 'comet' ),
                'desc'  => __( 'Getting started with the major components of the UI.', 'comet' ),
                'url'   => 'https://blacklead.fr/support/docs/comet/user-interface/',
            ],
            [
                'title' => __( 'Editor overview', 'comet' ),
                'desc'  => __( 'Learn to use the basic layout.', 'comet' ),
                'url'   => 'https://blacklead.fr/support/docs/comet/user-interface/',
            ],
        ];
        $total = count( $docs );
        $o = "<ul class=\"{$this->className['widget']} {$this->className['widget']}--learn\">";

        for( $n = 0; $n < $total; $n++ ){
            $doc = $docs[$n];
            $url = isset( $doc['url'] ) && is_string( $doc['url'] ) ? esc_url( trim( strip_tags( $doc['url'] ) ) ) : '';

            $o .= <<<ITEM
            <li class="{$this->className['widget']}--learn__item">
                <a class="{$this->className['widget']}--learn__item__url" href=\"{$url}\" target=\"_blank\">
ITEM;

            if( isset( $doc['title'] ) && is_string( $doc['title'] ) ){
                $title = strip_tags( $doc['title'] );
                $o .= "<h4 class=\"{$this->className['widget']}--learn__item__title\">{$title}</h4>";

            }

            if( isset( $doc['desc'] ) && is_string( $doc['desc'] ) ){
                $desc = strip_tags( $doc['desc'] );
                $o .= "<p class=\"{$this->className['widget']}--learn__item__desc\">{$desc}</p>";

            }
            $o .= '</a></li>';

        }
        $o .= '</ul>';

        return $o;

    }

    private function support(){

        $url = esc_url( 'https://blacklead.fr/support/docs/comet' );
        $title = __( 'Read the documentation', 'comet' );

        return <<<CONTENT

        <div class="{$this->className['widget']} {$this->className['widget']}--docs">
            <a class="{$this->className['widget']}--docs__url" href="$url" target="_blank">$title</a>
        </div>

CONTENT;

    }

}
?>
