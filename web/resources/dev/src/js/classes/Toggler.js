class Toggler {
    constructor(toggler)
    {
        this.toggler = toggler

        this.toggler_button = this.toggler.querySelector('[data-toggler]')
        if (this.toggler_button) {
            this.toggler_button.addEventListener('click', this.toggle.bind(this))
        }
    }

    toggle()
    {
        if (this.toggler_button.dataset.textAlt) {
            const text_alt = this.toggler_button.dataset.textAlt
            const text_current = this.toggler_button.innerText

            this.toggler_button.querySelector('span').innerHTML = text_alt
            this.toggler_button.dataset.textAlt = text_current
        }

        this.toggler.classList.toggle('active')
        this.toggler_button.classList.toggle('active')
    }

    static init()
    {
        const togglers = document.querySelectorAll('[data-toggler-parent]')

        if (togglers.length) {
            togglers.forEach(toggler => new Toggler(toggler))
        }
    }
}

Toggler.init()