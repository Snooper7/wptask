<?php

Timber::$dirname = 'src/views';

const VERSION = 1.01;
const MODE = 0; // 0 - DEV, 1 - PROD
define('ASSETS', get_home_url() . '/resources/' . (MODE ? 'app' : 'dev') . '/assets');

#region Добавление стилей и скриптов
add_action('wp_enqueue_scripts', 'setup_work_files');
function setup_work_files(): void
{
    wp_enqueue_style('style', ASSETS . '/app.min.css', [], VERSION);
    wp_enqueue_script('javascript', ASSETS . '/app.min.js', [], VERSION, true);

    wp_dequeue_style('wp-block-library');
    wp_deregister_script('wp-embed');
}

add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [ 'script', 'style' ]);
});

remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
#endregion
#region Скрыть ненужные пункты меню
add_action('admin_menu', 'remove_admin_menu');
function remove_admin_menu(): void
{
    remove_menu_page('edit.php');
    remove_menu_page('tools.php');
}
#endregion

#region Скрыть панель админа
show_admin_bar(false);
#endregion

#region Отключение стандартных стилей WP
add_action('wp_enqueue_scripts', 'mywptheme_child_deregister_styles', 20);
function mywptheme_child_deregister_styles(): void
{
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');
}
#endregion

function mytheme_add_woocommerce_support(): void
{
    add_theme_support('woocommerce');
}
add_action('after_setup_theme', 'mytheme_add_woocommerce_support');

add_filter( 'upload_mimes', 'svg_upload_allow' );

# Добавляет SVG в список разрешенных для загрузки файлов.
function svg_upload_allow( $mimes ) {
    $mimes['svg']  = 'image/svg+xml';

    return $mimes;
}
