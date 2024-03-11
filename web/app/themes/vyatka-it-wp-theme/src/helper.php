<?php

use App\System\Webp;

if (!function_exists('generate_crumbs')) {
    function generate_crumbs($data = null): array
    {
        $breadcrumbs = [];

        $object = get_queried_object();

        $breadcrumbs[] = [
            'name' => 'Главная',
            'href' => 'glavnaya-stranicza/'
        ];

        if (isset($data['parent'])) {
            $parent = $data['parent'];

            $name = $parent->post_title ?? $parent->term_id;

            $href =
                isset($parent->ID)
                    ? get_permalink($parent->ID)
                    : (
                isset($parent->term_id)
                    ? get_term_link($parent)
                    : ''
                );

            $breadcrumbs[] = [
                'name' => $name,
                'href' => $href
            ];
        }

        if (isset($object->ID)) {
            //$terms = [];
            //$taxonomies = get_taxonomies();
            //
            //foreach ($taxonomies as $taxonomy) {
            //    $taxonomy_terms = wp_get_post_terms($object->ID, $taxonomy);
            //
            //    if (!empty($taxonomy_terms)) {
            //    var_dump($taxonomy_terms);
            //        //    $terms = get_term_path()
            //    }
            //}

            $breadcrumbs[] = [
                'last' => true,
                'name' => $object->post_title,
                'href' => ''
            ];
        } else if (isset($object->term_id)) {
            $breadcrumbs[] = [
                'last' => true,
                'name' => $object->name,
                'href' => ''
            ];
        }

        return $breadcrumbs;
    }
}

if (!function_exists('get_term_path')) {
    function get_term_path($term)
    {

    }
}

if (!function_exists('only_num')) {
    function only_num($string)
    {
        return preg_replace("/[^0-9]/", '', $string);
    }
}


if (!function_exists('webp')) {
    function webp($post_id, $size = 'full')
    {
        return Webp::image($post_id, $size);
    }
}