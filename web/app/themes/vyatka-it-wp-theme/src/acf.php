<?php

if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => 'Контактные данные',
        'menu_title'    => 'Контактные данные',
        'menu_slug'     => 'contacts-settings',
        'capability'    => 'edit_posts',
        'position'      => 23,
        'icon_url'      => 'dashicons-phone',
        'redirect'      => false
    ));

    acf_add_local_field_group(array(
        'key' => 'contacts-page',
        'title' => 'Контактные данные',
        'fields' => array (
            array (
                'key' => 'phone',
                'label' => 'Телефон',
                'name' => 'Телефон',
                'type' => 'text',
            ),
            array (
                'key' => 'email',
                'label' => 'E-Mail',
                'name' => 'E-Mail',
                'type' => 'text',
            ),
            array (
                'key' => 'vk',
                'label' => 'ВКонтакте',
                'name' => 'ВКонтакте',
                'type' => 'text',
            ),
            array (
                'key' => 'tg',
                'label' => 'Telegram',
                'name' => 'Telegram',
                'type' => 'text',
            ),
            array (
                'key' => 'ok',
                'label' => 'Однокласники',
                'name' => 'Однокласники',
                'type' => 'text',
            ),
            array (
                'key' => 'wa',
                'label' => 'Whatsapp',
                'name' => 'Whatsapp',
                'type' => 'text',
            ),
            array (
                'key' => 'vb',
                'label' => 'Viber',
                'name' => 'Viber',
                'type' => 'text',
            ),
            array (
                'key' => 'yt',
                'label' => 'YouTube',
                'name' => 'YouTube',
                'type' => 'text',
            ),
            array (
                'key' => 'ozon',
                'label' => 'Ozon',
                'name' => 'Ozon',
                'type' => 'text',
            ),
            array (
                'key' => 'wb',
                'label' => 'Wildberries',
                'name' => 'Wildberries',
                'type' => 'text',
            ),
            array (
                'key' => 'ya',
                'label' => 'Яндекс Маркет',
                'name' => 'Яндекс Маркет',
                'type' => 'text',
            ),
            array (
                'key' => 'sb',
                'label' => 'Сбер МегаМаркет',
                'name' => 'Сбер МегаМаркет',
                'type' => 'text',
            ),
            array (
                'key' => 'requisits',
                'label' => 'Реквизиты',
                'name' => 'requisits',
                'type' => 'file',
            ),
            array (
                'key' => 'header_code',
                'label' => 'Код в head',
                'name' => 'Код в head',
                'type' => 'textarea',
            ),
            array (
                'key' => 'footer_code',
                'label' => 'Код в footer',
                'name' => 'Код в footer',
                'type' => 'textarea',
            ),
        ),
        'location' => array (
            array (
                array (
                    'param' => 'options_page',
                    'operator' => '==',
                    'value' => 'contacts-settings',
                ),
            ),
        ),
    ));

    acf_add_options_page(array(
        'page_title'    => 'Контент',
        'menu_title'    => 'Контент',
        'menu_slug'     => 'content-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));

    acf_add_options_sub_page(array(
        'page_title'    => 'Секция "Главный экран"',
        'menu_title'    => 'Секция "Главный экран"',
        'parent_slug'   => 'content-settings',
    ));

    acf_add_options_sub_page(array(
        'page_title'    => 'Секция "Уровень"',
        'menu_title'    => 'Секция "Уровень"',
        'parent_slug'   => 'content-settings',
    ));
}
