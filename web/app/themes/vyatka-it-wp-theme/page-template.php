<?php
// Template Name: Шаблон страницы

use Timber\Helper;

$context = \Timber\Timber::context();

$context['breadcrumbs'] = generate_crumbs();

$context['post'] = \Timber\Timber::get_post(get_queried_object_id());

Timber::render('page-template.twig', $context);
