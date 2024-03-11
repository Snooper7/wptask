import { app } from './App.js'
import Modal from "./Modal.js";

export default class Details {
    constructor(card)
    {
        this.card = card
        this.product_id = this.card?.dataset.product ?? null
        this.details_buttons = this.card.querySelectorAll('.details-js')
        this.handlerDetails = this.details.bind(this)

        this.details_buttons.forEach(button => button.addEventListener('click', this.handlerDetails))
    }

    async details()
    {
        let body = new FormData()
        body.append('product_id', this.product_id)

        let response = await fetch('/wp-json/site/v1/product/detail', {
            method: "POST",
            body: body
        })

        response = await response.json()

        if (response.fragments) {
            app.updateFragments(response.fragments)

            Modal.openTarget('details')

            window.dispatchEvent(new Event('product_open'))
        }

    }


    static init()
    {
        const _cards = document.querySelectorAll('[data-product]')
        if (_cards.length) {
            _cards.forEach(card => new Details(card))
        }
    }
}

Details.init();
