import { disablePageScroll, enablePageScroll } from 'scroll-lock';

class FixedMenu {
    constructor(fixed_menu)
    {
        this.fixed_menu = fixed_menu
        this.is_open = false

        this.links = document.querySelectorAll('.fixed-menu__link')
        this.toggle_handle = this.toggle.bind(this)
        this.toggler_button = document.querySelector("[data-fixed-menu-toggler]")
        if (this.links.length) {
            this.links.forEach(link => link.addEventListener('click', this.toggle_handle))
            if (this.toggler_button) {
                this.toggler_button.addEventListener("click", this.toggle_handle)
            }
        }
    }

    toggle()
    {
        if (this.is_open) {
            this.close()
        } else {
            this.open()
        }
    }

    open()
    {
        this.is_open = true
        this.fixed_menu.hidden = false
        this.toggler_button.classList.add('active')
        disablePageScroll(this.fixed_menu)
    }

    close()
    {
        this.is_open = false
        this.fixed_menu.hidden = true
        this.toggler_button.classList.remove('active')
        enablePageScroll(this.fixed_menu)
    }

    static init()
    {
        const fixed_menu = document.querySelector(".fixed-menu")

        if (fixed_menu) {
            new FixedMenu(fixed_menu)
        }
    }
}

FixedMenu.init()