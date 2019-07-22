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

        echo '<div class="comet-header comet-top comet-wrapper">';
        echo '<div class="comet-column">';
        echo '<h4>' . sprintf( _n( '%d template', '%d templates', $templates->found_posts, 'comet' ), $templates->found_posts ) . '</h4>';
        echo '</div>';
        echo '<div class="comet-column">';
        echo '<a id="comet-newTemplate" class="comet-mthOption comet-button comet-buttonPrimary cico cico-plus" title="' . __( 'Create new', 'comet' ) . '"></a>';
        echo '<div id="comet-importTemplate" class="comet-middleIb">';
        echo '<input type="file" id="comet-importTemplateFile" multiple accept=".json" />';
        echo '<button type="button" id="comet-importTemplateBtn" class="comet-mthOption comet-button cico cico-import" title="' . __( 'Import', 'comet' ) . '"></button>';
        echo '</div>';
        echo '</div>';

        echo '</div>';

        echo '<ul id="comet-map-templates">';

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

        $o = '<li class="comet-template">';
        $o .= '<div class="comet-informations">';
        $o .= '<h4 class="comet-title">' . ucfirst( get_the_title() ) . '</h4>';
        $o .= '<p><span class="comet-date">' . get_the_date() . '</span>•<span class="comet-author">' . get_the_author() . '</span></p>';
        $o .= '</div>';

        $o .= '<div class="comet-action">';
        $o .= '<a class="comet-templateEdit comet-button comet-buttonPrimary" href="' . $this->edit_link( $id ) . '">' . __( 'Edit', 'comet' ) . '</a>';
        $o .= '<a class="comet-templatePreview comet-button cico cico-eye" href="' . $this->preview_link( $id )  . '"title="' . __( 'Preview', 'comet' ) . '"></a>';
        $o .= '<a class="comet-templateExport comet-button cico cico-export" title="' . __( 'Export', 'comet' ) . '" data-id="' . $id . '"></a>';
        $o .= '<a class="comet-templateDelete comet-button cico cico-trash" title="' . __( 'Delete', 'comet' ) . '" data-id="' . $id . '"></a>';
        $o .= '</div>';
        $o .= '</li>';
        return $o;

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
