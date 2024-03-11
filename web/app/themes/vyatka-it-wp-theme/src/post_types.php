<?php

add_action('init', 'register_post_types');

function register_post_types()
{
    register_post_type('production', [
        'label'  => null,
        'labels' => [
            'name'               => 'Продукция', // основное название для типа записи
            'singular_name'      => 'Продукт', // название для одной записи этого типа
            'add_new'            => 'Добавить продукт', // для добавления новой записи
            'add_new_item'       => 'Добавление продукта', // заголовка у вновь создаваемой записи в админ-панели.
            'edit_item'          => 'Редактирование продукт', // для редактирования типа записи
            'new_item'           => 'Новый продукт', // текст новой записи
            'view_item'          => 'Смотреть продукт', // для просмотра записи этого типа.
            'search_items'       => 'Искать продукт', // для поиска по этим типам записи
            'not_found'          => 'Не найдено продуктов', // если в результате поиска ничего не было найдено
            'not_found_in_trash' => 'Не найдено в корзине', // если не было найдено в корзине
            'parent_item_colon'  => '', // для родителей (у древовидных типов)
            'menu_name'          => 'Продукты', // название меню
        ],
        'description'            => '',
        'public'                 => true,
// 'publicly_queryable'  => null, // зависит от public
// 'exclude_from_search' => null, // зависит от public
// 'show_ui'             => null, // зависит от public
// 'show_in_nav_menus'   => null, // зависит от public
        'show_in_menu'           => null, // показывать ли в меню админки
// 'show_in_admin_bar'   => null, // зависит от show_in_menu
        'show_in_rest'        => null, // добавить в REST API. C WP 4.7
        'rest_base'           => null, // $post_type. C WP 4.7
        'menu_position'       => null,
        'menu_icon'           => null,
//'capability_type'   => 'post',
//'capabilities'      => 'post', // массив дополнительных прав для этого типа записи
//'map_meta_cap'      => null, // Ставим true чтобы включить дефолтный обработчик специальных прав
        'hierarchical'        => false,
        'supports'            => [ 'title', 'editor', 'thumbnail', 'excerpt' ], // 'title','editor','author','thumbnail','excerpt','trackbacks','custom-fields','comments','revisions','page-attributes','post-formats'
        'taxonomies'          => [],
        'has_archive'         => false,
        'rewrite'             => true,
        'query_var'           => true,
    ]);

    register_post_type('service', [
    'label'  => null,
    'labels' => [
    'name'               => 'Услуги', // основное название для типа записи
    'singular_name'      => 'Услуга', // название для одной записи этого типа
    'add_new'            => 'Добавить услугу', // для добавления новой записи
    'add_new_item'       => 'Добавление услуги', // заголовка у вновь создаваемой записи в админ-панели.
    'edit_item'          => 'Редактирование услуги', // для редактирования типа записи
    'new_item'           => 'Новая услуга', // текст новой записи
    'view_item'          => 'Смотреть услугу', // для просмотра записи этого типа.
    'search_items'       => 'Искать услугу', // для поиска по этим типам записи
    'not_found'          => 'Не найдено услуги', // если в результате поиска ничего не было найдено
    'not_found_in_trash' => 'Не найдено в корзине', // если не было найдено в корзине
    'parent_item_colon'  => '', // для родителей (у древовидных типов)
    'menu_name'          => 'Услуги', // название меню
    ],
    'description'            => '',
    'public'                 => true,
// 'publicly_queryable'  => null, // зависит от public
// 'exclude_from_search' => null, // зависит от public
// 'show_ui'             => null, // зависит от public
// 'show_in_nav_menus'   => null, // зависит от public
    'show_in_menu'           => null, // показывать ли в меню админки
// 'show_in_admin_bar'   => null, // зависит от show_in_menu
    'show_in_rest'        => null, // добавить в REST API. C WP 4.7
    'rest_base'           => null, // $post_type. C WP 4.7
    'menu_position'       => null,
    'menu_icon'           => null,
//'capability_type'   => 'post',
//'capabilities'      => 'post', // массив дополнительных прав для этого типа записи
//'map_meta_cap'      => null, // Ставим true чтобы включить дефолтный обработчик специальных прав
    'hierarchical'        => false,
    'supports'            => [ 'title', 'editor', 'thumbnail' ], // 'title','editor','author','thumbnail','excerpt','trackbacks','custom-fields','comments','revisions','page-attributes','post-formats'
    'taxonomies'          => [],
    'has_archive'         => false,
    'rewrite'             => true,
    'query_var'           => true,
    ]);

    register_post_type('project', [
        'label'  => null,
        'labels' => [
            'name'               => 'Проекты', // основное название для типа записи
            'singular_name'      => 'Проект', // название для одной записи этого типа
            'add_new'            => 'Добавить проект', // для добавления новой записи
            'add_new_item'       => 'Добавление проекта', // заголовка у вновь создаваемой записи в админ-панели.
            'edit_item'          => 'Редактирование проекта', // для редактирования типа записи
            'new_item'           => 'Новый проект', // текст новой записи
            'view_item'          => 'Смотреть проект', // для просмотра записи этого типа.
            'search_items'       => 'Искать проект', // для поиска по этим типам записи
            'not_found'          => 'Не найдено проектов', // если в результате поиска ничего не было найдено
            'not_found_in_trash' => 'Не найдено в корзине', // если не было найдено в корзине
            'parent_item_colon'  => '', // для родителей (у древовидных типов)
            'menu_name'          => 'Проекты', // название меню
        ],
        'description'            => '',
        'public'                 => true,
// 'publicly_queryable'  => null, // зависит от public
// 'exclude_from_search' => null, // зависит от public
// 'show_ui'             => null, // зависит от public
// 'show_in_nav_menus'   => null, // зависит от public
        'show_in_menu'           => null, // показывать ли в меню админки
// 'show_in_admin_bar'   => null, // зависит от show_in_menu
        'show_in_rest'        => null, // добавить в REST API. C WP 4.7
        'rest_base'           => null, // $post_type. C WP 4.7
        'menu_position'       => null,
        'menu_icon'           => null,
//'capability_type'   => 'post',
//'capabilities'      => 'post', // массив дополнительных прав для этого типа записи
//'map_meta_cap'      => null, // Ставим true чтобы включить дефолтный обработчик специальных прав
        'hierarchical'        => false,
        'supports'            => [ 'title', 'editor', 'thumbnail' ], // 'title','editor','author','thumbnail','excerpt','trackbacks','custom-fields','comments','revisions','page-attributes','post-formats'
        'taxonomies'          => [],
        'has_archive'         => false,
        'rewrite'             => true,
        'query_var'           => true,
    ]);
}
