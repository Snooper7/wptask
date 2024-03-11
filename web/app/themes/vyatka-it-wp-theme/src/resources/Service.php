<?php

namespace App\Resources;

use Timber\Post;
use Timber\Timber;

class Service extends Post
{
    public function test()
    {
        return 'test';
    }

    public function get_list() {
        $services = Timber::get_posts([
            'post_type' => 'service'
        ]);

        return $services;
    }
}
