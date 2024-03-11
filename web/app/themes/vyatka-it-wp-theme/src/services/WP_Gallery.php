<?php

namespace App\Services;

use App\System\WebpExpressExtended;
use Timber;
use WP_REST_Request;

class WP_Gallery
{
    private int $limit = 8;

    public function load(WP_REST_Request $request)
    {
        $response = [];
        $images = $this->get($request->get_param('page'));

        foreach ($images as $key => $image) {
            $response['elements'][] = Timber::compile('parts/portfolio-item.twig', [
                'image' => $image,
                'index' => $key
            ]);
        }

        if (count($images) < $this->limit) {
            $response['end'] = true;
        }

        return $response;
    }

    public function get($page): array
    {
        $gallery = [];
        $images = get_field('gallery', 'options');

        for (
            $i = $page * $this->limit;
            $i < $page * $this->limit + $this->limit;
            $i++
        ) {
            if (isset($images[$i])) {
                $gallery[$i] = webp($images[$i]);
            }
        }

        return $gallery;
    }


}