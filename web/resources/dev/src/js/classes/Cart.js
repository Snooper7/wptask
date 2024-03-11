import Modal from "./Modal.js";
import CartProduct from "./CartProduct.js";
import { app } from './App.js'

class Cart {
    constructor(cart)
    {
        this.cart = cart

        this.open_handler = this.open.bind(this)
        this.open_buttons = document.querySelectorAll('[data-cart-open]')
        this.open_buttons.forEach(button => button.addEventListener('click', this.open_handler))
    }

    async open()
    {
        let response = await fetch('/wp-json/site/v1/cart/detail')

        response = await response.json()

        if (response.fragments) {
            app.updateFragments(response.fragments)

            Modal.openTarget('cart')

            CartProduct.init()
        }
    }

    static init()
    {
        const cart = document.querySelector('[data-cart]')

        if (cart) {
            new Cart(cart)
        }
    }
}

Cart.init()