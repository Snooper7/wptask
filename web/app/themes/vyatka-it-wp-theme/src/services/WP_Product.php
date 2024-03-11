<?php

namespace App\Services;

use Timber\Timber;
use WP_REST_Request;

class WP_Product
{
    public function detail()
    {
        if (isset($_POST['product_id'])) {
            $price = wc_get_product($_POST['product_id']);
            $product = Timber::get_post($_POST['product_id']);

            if ($product) {
                $context = Timber::context();
                $context['product'] = $product;
                $context['price'] = $price;

                return [
                    'fragments' => [
                        'details__container--content' =>
                            Timber::compile('modals/detail_content.twig', $context)
                    ]
                ];
            }
        }
    }
}
