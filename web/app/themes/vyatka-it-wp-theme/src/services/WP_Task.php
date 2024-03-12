<?php

namespace App\Services;

use Exception;
use Timber\Timber;

class WP_Task
{
    /**
     * @throws Exception
     */
    public function add(): array
    {
        $task_id = wp_insert_post([
            'post_title'    => sanitize_text_field($_POST['title']),
            'post_content'  => $_POST['text'],
            'post_status'   => 'publish',
            'post_author' => 1,
            'post_type' => 'task',
        ]);
        $task_object = get_post($task_id);

        update_field('target_date', $_POST['target_date'], $task_object);
        update_field('done', false, $task_object);

        if ($task_object) {
            return [
                'success' => true,
//                'fragments' => $this->fragments()
            ];
        } else {
            return [
                'success' => false
            ];
        }
    }

    public function update()
    {
        if ($cart_id) {
            if (WC()->cart->set_quantity($cart_id, $quantity)) {
                return [
                    'success' => true,
                    'fragments' => $this->fragments([
                        'cart' => true
                    ])
                ];
            } else {
                return [
                    'success' => false
                ];
            }
        }
    }

    public function remove()
    {
        $task_id = $_POST[ 'task_id' ];

        if ($task_id) {
            if (wp_delete_post($task_id, $force_delete = false)) {
                return [
                    'success' => true,
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
