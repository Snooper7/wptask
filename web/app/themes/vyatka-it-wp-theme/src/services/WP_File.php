<?php

namespace App\Services;

use WP_REST_Request;
use ZipArchive;

class WP_File
{
    private $request = null;
    private $valid_formats = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf'
    ];
    private $valid_size = 1024 * 1024 * 50; // 50MB

    public function __construct(WP_REST_Request $request)
    {
        $this->request = $request;

        $this->normalize();
    }

    private function exsists(): bool
    {
        foreach ($this->request->get_file_params() as $file) {
            if (!empty($file['tmp_name'])) {
                return true;
            }
        }

        return false;
    }

    public function get(): array
    {
        if ($this->exsists()) {
            $files = $this->request->get_file_params();

            $zip_name = 'files_' . date('d_m_Y_H_i_s') . '_' . hash('md5', json_encode($files));
            $upload_dir = wp_upload_dir();

            $zip = new ZipArchive();
            $zip->open($upload_dir['path'] . '/' . $zip_name . '.zip', ZipArchive::CREATE);

            foreach ($files as $file) {
                $zip->addFile($file['tmp_name'], $file['name']);
            }

            $zip->close();

            return [
                'path' => $upload_dir['path'] . '/' . $zip_name . '.zip',
                'url' => $upload_dir['url'] . '/' . $zip_name . '.zip'
            ];
        } else {
            return [];
        }
    }

    public function validate(&$errors): bool
    {
        if ($this->exsists()) {
            $total_size = 0;

            foreach ($this->request->get_file_params() as $file) {
                if (!in_array($file['type'], $this->valid_formats)) {
                    $errors['files'] = 'Не подходящий формат файла';
                }


                $total_size += $file['size'];
            }

            if ($total_size > $this->valid_size) {
                $errors['files'] = 'Максимальный размер загружаемых файлов ' . ($this->valid_size / 1024 / 1024) . "МБ";
            }
        }

        return empty($errors);
    }

    public function normalize()
    {
        $files = $this->request->get_file_params();
        $temp_files = [];
        if ($files) {
            foreach ($files['file'] as $key => $value) {
                foreach ($value as $value_key => $item) {
                    $temp_files[$value_key][$key] = $item;
                }
            }
            $this->request->set_file_params($temp_files);
        }

    }
}
