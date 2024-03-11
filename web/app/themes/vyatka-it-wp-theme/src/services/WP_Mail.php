<?php

namespace App\Services;

use App\System\Log;
use PHPMailer\PHPMailer\PHPMailer;

class WP_Mail
{
    private $to         = 's.perminov@vyatka-it.ru';
    private $from       = 'info@xn----7sbzkmth6f.xn--p1ai';
    private $from_title = 'Сталь-инжиниринг';
    private $subject    = 'Новая заявка с сайта';
    private $message    = '';

    public function send($message, $subject = ''): bool
    {
        $this->message = $message;

        if (!empty($subject)) {
            $this->subject = $subject;
        }

        if ($response = $this->mail()) {
            Log::write([
                'response' => $response
            ], 'mail');

            return true;
        } else {
            return false;
        }
    }

    private function mail() : bool
    {
        $mailer = new PHPMailer();
        $mailer->CharSet = 'UTF-8';
        $mailer->Subject = $this->subject;
        $mailer->Body = $this->message;
        $mailer->isHTML(false);
        $mailer->setFrom($this->from, $this->from_title);
        $mailer->addAddress($this->to);

        if ($mailer->send()) {
            return true;
        }

        return false;
    }
}
