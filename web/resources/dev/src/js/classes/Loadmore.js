import Helper from './Helper.js'
import { lock, unlock } from "./locker.js";

class Loadmore {
    constructor(loadmore) {
        this.loadmore = loadmore

        this.container = this.loadmore.querySelector('[data-loadmore-container]')

        this.action_button = this.loadmore.querySelector('[data-loadmore-button]')

        if (this.action_button) {
            this.page = parseInt(this.action_button.dataset.loadmorePage)
            this.action = this.action_button.dataset.loadmoreAction

            this.load_handler = this.load.bind(this)
            this.action_button.addEventListener('click', this.load_handler)
        }
    }

    async load() {
        lock()

        this.page += 1

        const body = new FormData()
        body.append('page', this.page)

        let response = await fetch('/wp-json/site/v1' + this.action, {
            method: "POST",
            body: body
        })

        response = await response.json()

        if (response.elements) {
            for (let key in response.elements) {
                const element = Helper.htmlToElement(response.elements[key])

                this.container.append(element)
            }
        }

        if (response.end) {
            this.action_button.remove()
        }

        unlock()
    }

    static init() {
        const loadmores = document.querySelectorAll('[data-loadmore]')

        if (loadmores.length) {
            loadmores.forEach(loadmore => new Loadmore(loadmore))
        }
    }
}

Loadmore.init()

