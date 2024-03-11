import Helper from './Helper.js'

class ToTop {
    constructor() {
        this.button = document.querySelector('.to-top')

        if (this.button) {
            this.button.addEventListener('click', this.toTop)

            window.addEventListener('scroll', this.check.bind(this))
            this.check()
        }
    }

    check(e) {
        const percent = Helper.getScrollPercent()

        if (percent >= 40) {
            this.button.classList.add('active')
        } else {
            this.button.classList.remove('active')
        }
    }

    toTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

}

new ToTop()