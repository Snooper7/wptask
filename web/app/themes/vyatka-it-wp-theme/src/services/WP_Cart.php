<?php

namespace App\Services;

use Exception;
use Timber\Timber;
use WC_Order_Item;

class WP_Cart
{
    /**
     * @throws Exception
     */
    public function add(): array
    {
        $product_id = apply_filters('woocommerce_add_to_cart_product_id', absint($_POST[ 'product_id' ]));
        $quantity = empty($_POST[ 'quantity' ]) ? 1 : wc_stock_amount($_POST[ 'quantity' ]);
        $passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
        $product_status = get_post_status($product_id);

        if ($passed_validation &&
            WC()->cart->add_to_cart($product_id) &&
            'publish' === $product_status
        ) {
            return [
                'success' => true,
                'fragments' => $this->fragments()
            ];
        } else {
            return [
                'success' => false
            ];
        }
    }

    public function update()
    {
        $cart_id = $this->getCartId($_POST[ 'product_id' ]);
        $quantity = empty($_POST[ 'quantity' ]) ? 1 : wc_stock_amount($_POST[ 'quantity' ]);

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
        $cart_id = $this->getCartId($_POST[ 'product_id' ]);

        if ($cart_id) {
            if (WC()->cart->remove_cart_item($cart_id)) {
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

    private function getCartId($product_id)
    {
        $products = $this->getProducts();

        foreach ($products as $product) {
            if ($product['id'] == $product_id) {
                return $product['cart_id'];
            }
        }

        return false;
    }


    public function getTotals(): array
    {
        $data['subtotal'] = floor(WC()->cart->get_subtotal());
        $data['total'] = floor(WC()->cart->get_total(false));
        $data['discount'] = floor(self::getCartDiscount());
        $data['counter'] = self::count();

        return $data;
    }

    public function getCartDiscount()
    {
        $total_discount = 0;
        $items = WC()->cart->get_cart();
        foreach ($items as $item) {
            $product_info = wc_get_product($item['product_id']);
            $price =  (int)$product_info->get_regular_price();
            $sale = (int)$product_info->get_sale_price();
            $discount = $price - $sale;
            $quantity = $item['quantity'];
            $total_discount = $total_discount + ($discount * $quantity);
        }
        return $total_discount;
    }

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

    static function count()
    {
        return WC()->cart->get_cart_contents_count();
    }
}
