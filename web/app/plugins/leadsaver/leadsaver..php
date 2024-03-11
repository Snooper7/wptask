<?php
/*
* Plugin Name: Leadsaver
* Description: Добавляет возможность сохранения любого запроса в базу данных ( Преднозначено для сохранения заявок с форм)
* Version: 1.0.0
*/

register_activation_hook( __FILE__, [ 'LeadSaver', 'create_table' ] );
include "templates/admin-menu-page.php";

class LeadSaver
{
    static $table = 'leadsaver';

    static function add( $data )
    {
        global $wpdb;

        $wpdb->insert( $wpdb->prefix . LeadSaver::$table, [
            'data' => $wpdb->prepare( json_encode( $data, JSON_UNESCAPED_UNICODE ) ),
        ], [
            '%s',
        ] );
    }

    public function __construct()
    {
        $this->register_admin_page();
    }

    public function get_leads()
    {
        global $wpdb;

        $limit = 20;

        if ( isset( $_GET[ 'limit' ] ) ) {
            $limit = (int) $limit;
        }

        $leads = [];
        $table_name = $wpdb->prefix . LeadSaver::$table;
        $leads_raw = $wpdb->get_results( "SELECT * FROM {$table_name} ORDER BY time DESC LIMIT {$limit}" );

        foreach ( $leads_raw as $lead ) {
            $data = json_decode( $lead->data, true );

            if ($data) {
                foreach ( $data as $key => $field ) {
                    if ( in_array( $key, $this->remove_field_list() ) ) {
                        unset( $data[ $key ] );
                    }
                }

                $lead->data = $data;

                $leads[] = $lead;
            }
        }

        return $leads;
    }

    private function remove_field_list()
    {
        return [
            'recaptcha_response'
        ];
    }

    private function register_admin_page()
    {
        add_action( 'admin_menu', function ()
        {
            add_menu_page(
                'Leadsaver',
                'Leadsaver',
                'administrator',
                'leadsaver_identifier',
                'leadsaver_admin_menu_page',
                'dashicons-database-view'
            );
        } );
    }

    public function pretty( $obj )
    {
        echo '<pre style="white-space: break-spaces">';
        print_r( $obj );
        echo '</pre>';
    }

    static function create_table()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . LeadSaver::$table;
        $charset_collate = $wpdb->get_charset_collate();

        if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {
            $sql = "CREATE TABLE $table_name (" .
                "id mediumint(9) NOT NULL AUTO_INCREMENT," .
                "data TEXT," .
                "time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL," .
                "UNIQUE KEY id (id)" .
                ") $charset_collate;";

            require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
            dbDelta( $sql );
        }
    }
}

new LeadSaver();
