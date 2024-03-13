<?php

namespace App\Services;

use Exception;
use Timber\Timber;
use WP_REST_Request;

class WP_Task
{
    public function all() : array
    {
        $tasks = Timber::get_posts([
            'post_type' => 'task',
            'numberposts' => -1,
            'orderby' => 'date',
            'order' => 'DESC'
        ]);

        foreach ($tasks as $key => $task) {
            $tasks[$key]->done = get_field('done', $task->id);
            $tasks[$key]->target = get_field('target_date', $task->id);
        }

        return [
            'tasks' => $tasks
        ];
    }

    public function done(WP_REST_Request $request) : array
    {
        $id = $request->get_param('id');
        $done = $request->get_param('done') === 'true';

        update_field('done', !$done, $id);

        $tasks = $this->all();

        return [
            'success' => true,
            'tasks' => $tasks['tasks']
        ];
    }

    /**
     * @throws Exception
     */
    public function add(): array
    {
        $task_id = wp_insert_post([
            'post_title'    => sanitize_text_field($_POST['title']),
            'post_content'  => !empty($_POST['text']) ? sanitize_text_field($_POST['text']) : '',
            'post_status'   => 'publish',
            'post_author' => 1,
            'post_type' => 'task',
        ]);
        $task_object = get_post($task_id);

        update_field('target_date', $_POST['target_date'], $task_object);
        update_field('done', false, $task_object);

        if ($task_object) {
            $tasks = $this->all();
            return [
                'success' => true,
                'tasks' => $tasks['tasks']
            ];
        } else {
            return [
                'success' => false
            ];
        }
    }

    public function update(WP_REST_Request $request)
    {
        $post_args = [
            'ID' => $request->get_param('id')
        ];

        if ($request->get_param('title')) {
            $post_args['post_title'] = $request->get_param('title');
            $post_args['post_content'] = $request->get_param('text');
        }
        if ($request->get_param('title')) {
            $post_args['post_content'] = $request->get_param('text');
        }

        wp_update_post($post_args);

        $task_object = get_post($post_args['ID']);

        if ($request->get_param('target_date')) {
            update_field('target_date', $request->get_param('target_date'), $task_object);
        }


        $tasks = $this->all();

        return [
            'success' => true,
            'tasks' => $tasks['tasks']
        ];
    }

    public function remove(WP_REST_Request $request) : array
    {
        $task_id = $request->get_param('id');

        if ($task_id) {
            if (wp_delete_post($task_id, $force_delete = false)) {
                $tasks = $this->all();

                return [
                    'success' => true,
                    'tasks' => $tasks['tasks']
                ];
            } else {
                return [
                    'success' => false
                ];
            }
        }
    }

    public function detail()
    {
        $context['products'] = $this->getProducts();
        $context['totals'] = $this->getTotals();

        return [
            'fragments' => [
                'cart__products' => Timber::compile('modals/cart/cart_products.twig', $context),
                'cart__totals' => Timber::compile('modals/cart/cart_totals.twig', $context)
            ]
        ];
    }

    public function getProducts(): array
    {
        $products =  WC()->cart->get_cart();
        $data = [];

        foreach ($products as $product) {
            $productWC = wc_get_product($product['product_id']);
            $productTimber = Timber::get_post($product['product_id']);
            $data[] = [
                'id' => $product['product_id'],
//                'product' => $product,
//                'productWC' => $productWC,
//                'productTimber' => $productTimber,
                'cart_id' => $product['key'],
                'color' => $productTimber->color,
//                'thumbnail' => $productInfo->get_image(),
                'thumbnail' => $productTimber->thumbnail,
                'title' => $productTimber->post_title,
                'sale' => $productWC->get_sale_price(),
                'price' => $productWC->get_regular_price(),
                'quantity' => $product['quantity'],
            ];
        }

        return $data;
    }

//    private function getCartId($product_id)
//    {
//        $products = $this->getProducts();
//
//        foreach ($products as $product) {
//            if ($product['id'] == $product_id) {
//                return $product['cart_id'];
//            }
//        }
//
//        return false;
//    }

    public function fragments($args = []): array
    {
        $context = Timber::context();

        $fragments['minicart'] = Timber::compile('parts/minicart.twig');

        if (isset($args['cart'])) {
            $context['totals'] = $this->getTotals();
            $fragments['cart__totals'] = Timber::compile('modals/cart/cart_totals.twig', $context);
        }

        return $fragments;
    }
}
