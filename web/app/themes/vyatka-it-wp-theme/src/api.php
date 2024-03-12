<?php

use App\Services\WP_Cart;
use App\Services\WP_Checkout;
use App\Services\WP_Mail;
use App\Services\WP_Product;
use App\Services\WP_Review;
use App\Services\WP_Task;

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

function register_routes(): void
{

    // Cart Routes
    register_rest_route(API_NAMESPACE, '/task/all', [
        'methods'  => 'GET',
        'callback' => [ new WP_Task(), 'all' ],
    ]);

    register_rest_route(API_NAMESPACE, '/task/add', [
        'methods'  => 'POST',
        'callback' => [ new WP_Task(), 'add' ],
    ]);

    register_rest_route(API_NAMESPACE, '/task/update', [
        'methods'  => 'POST',
        'callback' => [ new WP_Task(), 'update' ],
    ]);

    register_rest_route(API_NAMESPACE, '/task/remove', [
        'methods'  => 'POST',
        'callback' => [ new WP_Task(), 'remove' ],
    ]);

    register_rest_route(API_NAMESPACE, '/task/done', [
        'methods'  => 'POST',
        'callback' => [ new WP_Task(), 'done' ],
    ]);

    register_rest_route(API_NAMESPACE, '/task/detail', [
        'methods'  => 'GET',
        'callback' => [ new WP_Task(), 'detail' ],
    ]);
}
