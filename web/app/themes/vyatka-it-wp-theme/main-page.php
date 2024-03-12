<?php
// Template Name: Главная
use App\Services\WP_Review;
use Timber\Timber;

$context = Timber::context();
$context['main_screen'] = get_field('main-screen', 'options');
$context['comments'] = WP_Review::get();
$context['tasks'] = Timber::get_posts([
    'post_type' => 'task',
//    'meta_key' => 'done',
//    'meta_value' => true,
    'orderby' => 'date',
    'order' => 'ASC'
]);

Timber::render('main-page.twig', $context);
