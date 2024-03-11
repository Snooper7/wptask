<?php

namespace App\Services;

use App\System\Log;

class Telegram
{
    private $token = '6744119441:AAH1rDLY193VTJ_Mp3CGr2QOWaungQG2ppg'; // Токен
    private $chat_id = '-4180366127'; // ID канала

    public function send($message)
    {
        $data = [
            'chat_id' => $this->chat_id,
            'text' => $message,
        ];

        $telegram = new Telegram();
        $telegram->request($data, 'sendMessage');
    }

    private function request($params, $method)
    {
        $url = 'https://api.telegram.org/bot' . $this->token . '/' . $method . '?' . http_build_query($params);
        $ch = curl_init();

        curl_setopt_array($ch, array(
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.0.4) Gecko/2008102920 AdCentriaIM/1.7 Firefox/3.0.4',
            CURLOPT_AUTOREFERER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POST => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_CONNECTTIMEOUT => 30,
            CURLOPT_URL => $url
        ));

        $result = json_decode(curl_exec($ch), true);

        curl_close($ch);

        Log::write([
            'request' => $url,
            'response' => $result
        ], 'telegram');

        return $result;
    }
}
