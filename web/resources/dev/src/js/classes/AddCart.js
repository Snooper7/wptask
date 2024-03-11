import { app } from './App.js'

export let addcart = []

export default class AddCartEvent {
    constructor(card) {
        this.card = card
        this.button = this.card.querySelector('[data-button]')
        this.buttonDelete = this.card.querySelector('[data-button-delete]')
        this.product_id = this.card?.dataset.product ?? null
        this.product_key = this.card?.dataset.cartId ?? null
        this.handlerClickAdd = this.addCart.bind(this)
        if (this.button) this.button.addEventListener('click', this.handlerClickAdd )
        this.handlerClickDelete = this.deleteCart.bind(this)
        if (this.buttonDelete) this.buttonDelete.addEventListener('click', this.handlerClickDelete )

        if (this.card.querySelector('[name="in_wishlist"]')) {
            this.in_wishlist = parseInt(this.card.querySelector('[name="in_wishlist"]').value)
            this.wishlist_button = this.card.querySelector('.product-favorite')

            if (this.wishlist_button) {
                this.wishlist_toggle_handler = this.wishlistToggle.bind(this)
                this.wishlistHandler()
            }
        }

        this.oneclick_btn = this.card.querySelector('.btn-oneclick-js')
        this.handlerOneclick = this.oneclick.bind(this)
        if (this.oneclick_btn) this.oneclick_btn.addEventListener('click', this.handlerOneclick )

        this.priceclick_btn = this.card.querySelector('.btn-price-js')
        this.handlerPriceClick = this.priceclick.bind(this)
        if (this.priceclick_btn) this.priceclick_btn.addEventListener('click', this.handlerPriceClick )

        this.quantity = this.card.querySelector('[name=quantity]')

        // Плюс
        this.plus_handler = this.plus.bind(this)
        this.plus_button = this.card.querySelector('.cart__quantity-btn--plus')
        if (this.plus_button) this.plus_button.addEventListener('click', this.plus_handler)

        // Минус
        this.minus_handler = this.minus.bind(this)
        this.minus_button = this.card.querySelector('.cart__quantity-btn--minus')
        if (this.minus_button) this.minus_button.addEventListener('click', this.minus_handler)

    }

    async plus() {
        this.quantity.value = parseInt(this.quantity.value) + 1
        this.update()
    }

    async minus() {
        if (parseInt(this.quantity.value) - 1 > 0) {
            this.quantity.value = parseInt(this.quantity.value) - 1

            this.update()
        } else {
            this.deleteCart()
        }
    }

    priceclick(){
        this.priceclick_id = this.priceclick_btn.dataset.productId

        this.modal_priceclick = document.querySelector('.modal[data-modal-type="price"]')
        this.input_value = this.modal_priceclick.querySelector('input[name="product_id"]')


        this.input_value.value = this.priceclick_id
    }

    oneclick(){
        this.oneclick_id = this.oneclick_btn.dataset.productId

        this.modal_oneclick = document.querySelector('.modal[data-modal-type="oneclick"]')
        this.input_value = this.modal_oneclick.querySelector('input[name="product_id"]')


        this.input_value.value = this.oneclick_id
    }

    async addCart() {

        const data = new FormData()
        data.append('action', 'add_to_cart')
        data.append('product_id', this.product_id)
        ym(76182769,'reachGoal','add-cart-click')

        let response = await fetch(window.ajax, {
            method: 'POST',
            body: data
        })

        response = await response.json()

        if (response.fragments) {
            await app.updateFragments(response.fragments)
        }

    }

    async update() {
        const data = new FormData()
        data.append('action', 'update_cart')
        data.append('cart_id', this.product_key)
        data.append('quantity', parseInt(this.quantity.value))

        let response = await fetch(window.ajax, {
            method: 'POST',
            body: data
        })

        response = await response.json()

        if (response.fragments) {
            await app.updateFragments(response.fragments)
        }

        AddCartEvent.reInit()
    }


    async deleteCart() {

        const data = new FormData()
        data.append('action', 'remove_cart')
        data.append('product_key', this.product_key)

        let response = await fetch(window.ajax, {
            method: 'POST',
            body: data
        })

        response = await response.json()

        if (response.fragments) {
            await app.updateFragments(response.fragments)
        }

        AddCartEvent.reInit()

    }

    static reInit() {
        const self = this;
        addcart.map(item=>{
            if (item.button){
                item.button.removeEventListener('click', item.handlerClick)
            }
            if (item.buttonDelete){
                item.buttonDelete.removeEventListener('click', item.handlerClickDelete)
            }
            if (item.plus_button) {
                item.plus_button.removeEventListener('click', item.plus_handler)
            }
            if (item.minus_button) {
                item.minus_button.removeEventListener('click', item.minus_handler)
            }
        })

        addcart = []
        AddCartEvent.init()
    }

    wishlistHandler() {
        if (this.in_wishlist === 1) {
            this.wishlist_button.classList.add('active')
        } else {
            this.wishlist_button.classList.remove('active')
        }
        this.wishlist_button.addEventListener('click', this.wishlist_toggle_handler)
    }

    async wishlistToggle() {
        const data = new FormData()
        data.append('product_id', this.product_id)
        let response = null
        switch (this.in_wishlist) {
            case 0:
                data.append('action', 'add_wishlist')
                response = await fetch(window.ajax, {
                    method: 'POST',
                    body: data
                })
                response = await response.json()
                console.log(response)
                if (response.total) {
                    this.wishlist_button.classList.add('active')
                    this.in_wishlist = 1
                    console.log(this.in_wishlist)
                } else if (response.error) {
                    console.log(response.error)
                }
                break;
            case 1:
                data.append('action', 'remove_wishlist')
                this.wishlist_button.classList.remove('active')
                response = await fetch(window.ajax, {
                    method: 'POST',
                    body: data
                })
                response = await response.json()
                this.in_wishlist = 0
                break;
        }

        if (response) {
            if (response.total >= 1) {
                document.querySelectorAll('.wishlist-counter').forEach(label => label.hidden = false)
            } else {
                document.querySelectorAll('.wishlist-counter').forEach(label => label.hidden = true)
            }
            document.querySelectorAll('.wishlist-counter').forEach(label => label.innerHTML = response.total)
        }
    }

    static init() {
        const _cards = document.querySelectorAll('[data-product]')
        if (_cards.length) {
            _cards.forEach(card => addcart.push(new AddCartEvent(card)))
        }
    }
}

AddCartEvent.init();
