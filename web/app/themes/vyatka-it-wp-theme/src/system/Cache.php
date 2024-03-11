<?php

namespace App\System;

class Cache {
    const CACHE_DIR = '/wp-content/cache/';
    const TIME_LIST = [
        'D' => 60 * 60 * 24,
        'W' => 60 * 60 * 24 * 7,
        'M' => 60 * 60 * 24 * 31,
        'Y' => 60 * 60 * 24 * 365,
    ];

    public function __construct() {
        add_action( 'wp_ajax_cache_clear', [ $this, 'clear' ] );
        add_action( 'wp_ajax_nopriv_cache_clear', [ $this, 'clear' ] );

        add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
            $args = [
                'id' => 'cache-clear-link',
                'title' => 'Очистить кеш',
                'href' => get_site_url() . '/wp-admin/admin-ajax.php?action=cache_clear',
                'meta' => [
                    'target' => '_blank'
                ]
            ];
            $wp_admin_bar->add_node( $args );
        }, 90 );
    }

    function clear() {
        $transient_dir = $_SERVER[ 'DOCUMENT_ROOT' ] . self::CACHE_DIR;
        $transient_files = glob( $transient_dir . 'transient_*.cache' );

        foreach ( $transient_files as $transient_file ) {
            if ( !unlink( $transient_file ) ) {
                return false;
            }
        }

        wp_die('Готово!');
    }

    static function set( $transient_name, $transient_value = '', $expiration = 'Y' ) {
        if (empty($transient_value)) return;

        $expiration = isset( self::TIME_LIST[ $expiration ] ) ? self::TIME_LIST[ $expiration ] : self::TIME_LIST[ 'Y' ];

        $transient_dir = $_SERVER[ 'DOCUMENT_ROOT' ] . self::CACHE_DIR;
        $transient_file_name = "transient_" . $transient_name . '_' . ( time() + $expiration );
        $transient_file = $transient_dir . $transient_file_name . '.cache';

        if ( !is_dir( $transient_dir ) ) {
            if ( !mkdir( $transient_dir, 0755, true ) ) {
                return false;
            }
        }

        if ( !file_put_contents( $transient_file, serialize( $transient_value )  ) ) {
            return false;
        }

        return true;
    }

    static function get( $transient_name ) {
        $transient_dir = $_SERVER[ 'DOCUMENT_ROOT' ] . self::CACHE_DIR;
        $transient_file_name = "transient_" . $transient_name;
        $transient_files = glob( $transient_dir . $transient_file_name . '_*.cache' );

        foreach ( $transient_files as $transient_file ) {
            $expiration = intval( str_replace( [
                $transient_dir . $transient_file_name . '_',
                '.cache'
            ], '', $transient_file ) );

            if ( $expiration > time() ) {
                return unserialize( file_get_contents( $transient_file ) );
                break;
            } else {
                if ( !unlink( $transient_file ) ) {
                    return false;
                }
            }
        }

        return false;
    }

    static function getField($filed_name, $source = 'options') {
        $field = Cache::get('acf_' . $filed_name . '_' . $source);

        if (!$field) {
            $field = get_field($filed_name, $source);

            if ($field) {
                Cache::set('acf_' . $filed_name . '_' . $source, $field);
            }
        }

        return $field;
    }
}