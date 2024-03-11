<?php

use App\Services\WP_Cart;
use App\Services\WP_Checkout;
use App\Services\WP_Mail;
use App\Services\WP_Product;
use App\Services\WP_Review;

define('API_NAMESPACE', 'site/v1');

add_action('rest_api_init', 'register_routes');

add_filter('woocommerce_is_rest_api_request', function ($is_rest_api_request) {
    if (empty($_SERVER['REQUEST_URI'])) {
        return $is_rest_api_request;
    }

    // Bail early if this is not our request.
    if (false === strpos($_SERVER['REQUEST_URI'], API_NAMESPACE)) {
        return $is_rest_api_request;
    }

    return false;
});

function register_routes()
{
    register_rest_route(API_NAMESPACE, '/review/add', [
        'methods'  => 'POST',
        'callback' => [ new WP_Review(), 'add' ],
    ]);

    // Product
    register_rest_route(API_NAMESPACE, '/product/detail', [
        'methods'  => 'POST',
        'callback' => [ new WP_Product(), 'detail' ],
    ]);

    // Cart Routes
    register_rest_route(API_NAMESPACE, '/cart/add', [
        'methods'  => 'POST',
        'callback' => [ new WP_Cart(), 'add' ],
    ]);

    register_rest_route(API_NAMESPACE, '/cart/update', [
        'methods'  => 'POST',
        'callback' => [ new WP_Cart(), 'update' ],
    ]);

    register_rest_route(API_NAMESPACE, '/cart/remove', [
        'methods'  => 'POST',
        'callback' => [ new WP_Cart(), 'remove' ],
    ]);

    register_rest_route(API_NAMESPACE, '/cart/detail', [
        'methods'  => 'GET',
        'callback' => [ new WP_Cart(), 'detail' ],
    ]);

    // Checkout Routes
    register_rest_route(API_NAMESPACE, '/order/create', [
        'methods'  => 'POST',
        'callback' => [ new WP_Checkout(), 'create' ],
    ]);
}
