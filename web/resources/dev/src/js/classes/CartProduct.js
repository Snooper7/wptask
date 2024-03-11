/*
    Наследуем основной класс Product.
    В этом классе только выбираем с какими данными работать.
    В частности с продуктами в корзине.
    Блок корзины и кнопки плюс, минус и удалить а также блок с количеством выделяем дата атрибутами
*/
import Product from "./Product.js";
import SimpleProduct from "./SimpleProduct.js";

let cart_products = []

export default class CartProduct extends Product {
    constructor(product)
    {
        super(product);

        this.minus_button = this.product.querySelector('[data-product-minus]')

        if (this.minus_button) {
            this.minus_button.addEventListener('click', this.minus_handler)
        }

        this.plus_button = this.product.querySelector('[data-product-plus]')
        if (this.plus_button) {
            this.plus_button.addEventListener('click', this.plus_handler)
        }

        this.remove_buttons = this.product.querySelectorAll('[data-product-remove]')
        if (this.remove_buttons) {
            this.remove_buttons.forEach(remove_button => {
                remove_button.addEventListener('click', this.remove_handler)
            })
        }

        this.quantity_label = this.product.querySelector('[data-product-quantity-label]')
    }

    static reInit()
    {
        cart_products.forEach(product => {
            if (product.minus_button) {
                product.minus_button.removeEventListener('click', product.minus_handler)
            }

            if (product.plus_button) {
                product.plus_button.removeEventListener('click', product.plus_handler)
            }

            if (product.remove_buttons) {
                product.remove_buttons.forEach(remove_button => {
                    remove_button.removeEventListener('click', product.remove_handler)
                })
            }

        })

        cart_products = []

        CartProduct.init()
    }

    static init()
    {
        const products = document.querySelectorAll('[data-product-cart]')
        /*
            Все найденные продукты собираем в массив cart_products,
            чтобы можно было по нему потом выполнять разные действия
         */
        if (products.length) {
            products.forEach(product => cart_products.push(new CartProduct(product)))
        }
    }
}

window.addEventListener('product_update', () => {
    CartProduct.reInit()
})