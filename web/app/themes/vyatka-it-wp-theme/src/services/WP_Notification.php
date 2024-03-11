<?php

namespace App\Services;

use App\Services\WP_Mail;
use App\Services\Telegram;
use LeadSaver;
use WP_REST_Request;
use ZipArchive;

class WP_Notification
{
    private $errors = [];

    public function notify_lead(WP_REST_Request $request): array
    {
        $file_object = new WP_File($request);

        if ($this->simple_validate($request) && $file_object->validate($this->errors)) {
            $file = $file_object->get();
            $subject = $this->get_subject($request);
            $message = $this->get_message_to_string($request, $file);

            LeadSaver::add($request->get_params());

            $mail = new WP_Mail();
            $mail->send($message, $subject);

            $telegram = new Telegram();
            $telegram->send($message);

            return  [
                'success' => true
            ];
        } else {
            return [
                'errors' => $this->errors
            ];
        }
    }

    private function get_message_to_string(WP_REST_Request $request, $file = null): string
    {
        $message = "";
        if ($request->get_param('title')) {
            $message .= "Заголовок формы: {$request->get_param('title')} \r\n";
        }

        if ($request->get_param('name')) {
            $message .= "Имя: {$request->get_param('name')} \r\n";
        }

        $message .= "Телефон: {$request->get_param('phone')} \r\n";

        if ($request->get_param('email')) {
            $message .= "E-Mail: {$request->get_param('email')} \r\n";
        }

        if ($request->get_param('subject')) {
            $message .= "Дополнительно: {$request->get_param('subject')} \r\n";
        }

        if (!empty($file)) {
            $message .= "Файлы: {$file['url']} \r\n";
        }

        if ($request->get_param('link')) {
            $message .= "Страница отправки: {$request->get_param('link')} \r\n";
        }

        return $message;
    }

    private function get_subject(WP_REST_Request $request): string|null
    {
        $subject = null;

        if ($request->get_param('type')) {
            switch ($request->get_param('type')) {
                case 'callback': {
                    $subject = 'Заказать звонок';
                } break;
            }
        }

        return $subject;
    }

    private function simple_validate(WP_REST_Request $request): bool
    {
        if (empty($request->get_param('phone'))) {
            $this->errors[ 'phone' ] = 'Укажите телефон';
        }

        return empty($this->errors);
    }
}
