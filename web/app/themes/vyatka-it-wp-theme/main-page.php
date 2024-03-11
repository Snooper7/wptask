<?php
// Template Name: Главная
use App\Services\WP_Review;
use Timber\Timber;

$context = Timber::context();
$context['main_screen'] = get_field('main-screen', 'options');
$context['comments'] = WP_Review::get();
$context['products'] = Timber::get_posts([
    'post_type' => 'product',
]);

Timber::render('main-page.twig', $context);
