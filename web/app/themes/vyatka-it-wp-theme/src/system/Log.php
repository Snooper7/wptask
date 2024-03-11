<?php

namespace App\System;

class Log {
    private $root_dir = '/app/logs';

    public function __construct() {
        $this->checkRootDir();
    }

    private function getRootDir() {
        return $_SERVER['DOCUMENT_ROOT'] . $this->root_dir;
    }

    private function checkRootDir() {
        $root_dir = $this->getRootDir();

        if (!is_dir($root_dir)) {
            mkdir($root_dir);
        }
    }

    private function checkDir($dir) {
        $root_dir = $this->getRootDir();
        $target_dir = $root_dir . '/' . $dir;

        if (!is_dir($target_dir)) {
            mkdir($target_dir);
        }
    }

    public function write_($data, $log_context = 'main') {
        $root_dir = $this->getRootDir();

        $this->checkDir($log_context);

        # Создание папки с датой в имени
        $date = date('d_m_Y');
        $date_dir = $log_context . '/' . $date;

        $this->checkDir($date_dir);

        # Создание файла с временем в имени
        $time = date('H_i_s');
        $time_file_name = $time . '_' . time() . '.log';

        $data = [
          'date' => date('d-m-Y H:i:s'),
          'content' => $data
        ];

        file_put_contents($root_dir . '/' . $date_dir . '/' . $time_file_name, print_r($data, true));
    }

    static function write($data, $log_context = 'log') {
        $log = new Log();
        $log->write_($data, $log_context);
    }
}