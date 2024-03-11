<?php

namespace App\Services;

use Customer;
use Helper\Helper;
use System\Log;
use WC_AJAX;
use WC_Order_Item_Shipping;

class WP_Checkout
{
    private array $errors = [];

    public function create(): array
    {
        global $woocommerce;

        #Получаем данные из формы после валидации
        if ($this->validate()) {
            $name = $_POST['name'];
            $phone = $_POST['phone'];
            $email = $_POST['email'];
            $address = $_POST['address'];
            $apart = $_POST['apart'];
            $entrance = $_POST['entrance'];
            $floor = $_POST['floor'];
            $intercom = $_POST['intercom'];
            $comment = $_POST['comment'];
//            $delivery = $_POST['delivery'];


            # Создаем заказ
            $order = wc_create_order();

            # Получаем и добавляем товары
            $cart_items = WC()->cart->get_cart_contents();

            if ($cart_items) {
                foreach ($cart_items as $cart_item) {
                    $product_id = $cart_item[ 'product_id' ];
                    $quantity = $cart_item[ 'quantity' ];
                    $order->add_product(wc_get_product($product_id), $quantity);
                }
            }

            # Устанавливаем способ доставки
            $shipping = new WC_Order_Item_Shipping();
            $shipping->set_method_title("Free shipping");
            $shipping->set_method_id('free_shipping:1'); // set an existing Shipping method ID
            $shipping->set_total(0); // optional
            $order->add_item($shipping);


            # Устанавливаем адрес
            $address = array(
                'first_name' => $name,
                'last_name'  => '',
                'company'    => '',
                'email'      => $email,
                'phone'      => $phone,
                'address_1'  => $address,
                'address_2'  => "Квартира: $apart, Подъезд: $entrance, Этаж: $floor, Домофон: $intercom",
                'city'       => '',
                'state'      => '',
                'postcode'   => '',
                'country'    => 'RU'
            );

            $order->set_address($address, 'billing');
            $order->set_address($address, 'shipping');

            # Устанавливаем способ оплаты
            $order->set_payment_method('cod');
            $order->set_payment_method_title('Оплата при доставке');

            # Выставляем статус заказа
            $order->set_status('wc-processing', 'Новый заказ');

            # Пересчитываем итоги
            $order->calculate_totals();

            # Сохраняем заказ в базу
            $order->save();

            # Устанавливаем транспортную компанию
//            if ($delivery) {
//                $order->add_order_note("
//                Транспортная компания: $delivery,
//            ", true, true);
//            }
            # Устанавливаем комментарий к заказу
            if ($comment) {
                $order->add_order_note("
                Комментарий к заказу:
                $comment
            ", true, true);
            }



            return [
                'success' => true
            ];
        } else {
            return [
                'errors' => $this->errors
            ];
        }
    }

    private function validate(): bool
    {
        if (empty($_POST['name'])) {
            $this->errors['name'] = 'Укажите имя и фамилию';
        }
        if (empty($_POST['phone'])) {
            $this->errors['phone'] = 'Укажите телефон';
        }
        if (empty($_POST['term'])) {
            $this->errors['term'] = 'Вы не дали согласие на обработку данных';
        }

        return empty($this->errors);
    }
}
