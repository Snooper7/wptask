<?php

namespace App\System;

use \WebPExpress\AlterHtmlHelper;

class Webp
{
    public static function image($img_id, $img_size = 'full')
    {
        $img = wp_get_attachment_image_src($img_id, $img_size)[0];

        if (!$img_id || !$img) {
            return false;
        }

        return AlterHtmlHelper::getWebPUrl($img, null);
    }
}