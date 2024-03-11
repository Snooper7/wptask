import Cookie from "./Cookie.js";

class CookieAccept {
    constructor(cookie) {
        this.cookie = cookie

        this.accept_button = this.cookie.querySelector('.cookie__accept')
        this.accept_button.addEventListener('click', this.accept.bind(this))

        this.check()
    }

    check() {
        if (Cookie.get('cookie_accept')) {
            this.cookie.remove()
        } else {
            this.cookie.hidden = false
            this.cookie.classList.add('show')
        }
    }

    accept() {
        Cookie.set('cookie_accept', true, {
            expires: 365
        })

        this.check()
    }

    static init() {
        const cookie = document.querySelector('.cookie')

        if (cookie) {
            new CookieAccept(cookie)
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    CookieAccept.init()
})