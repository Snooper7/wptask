import Controls from "./Controls.js"

let modals = []

export default class Modal extends Controls {
    constructor(modal) {
        super(modal)

        this.modal = modal
        this.modal_type = this.modal.dataset.modalType

        // Открывашки
        this.open_handler = this.open.bind(this)

        this.open_buttons = document.querySelectorAll(`[data-modal="${this.modal_type}"]`)
        this.open_buttons.forEach(button => button.addEventListener('click', this.open_handler))

        // Закрытие
        this.close_handler = this.closeClick.bind(this)
        this.modal.addEventListener('click', this.close_handler)

        // this.close_buttons = this.modal.querySelectorAll('.modal__close')
        // this.close_buttons.forEach(button => button.addEventListener('click', this.close_handler))

        // Анимация
        this.animation_time = parseFloat(getComputedStyle(document.body).getPropertyValue('--modal-animation-time'))
    }

    async open() {
        await Modal.closeAll() 

        this.modal.hidden = false
        this.modal.classList.add('open')
    }

    closeClick(e) {
        if (e.target.classList.contains('modal__close') ||
            e.target.classList.contains('modal__content') ||
            e.target.classList.contains('modal')) {
                this.close()
        }
        
    }
    close() {
        return new Promise(resolve => {
            if (!this.modal.hidden) {
                this.modal.classList.remove('open')

                setTimeout(() => {
                    this.modal.hidden = true
                    resolve()
                }, this.animation_time * 1000)
            } else {
                resolve()
            }
        })
    }

    // Открытие модалки программно
    static async openTarget(modal_type) {
        await Modal.closeAll() 

        for (let modal in modals) {
            const current = modals[modal]

            if (current.modal_type == modal_type) {
                current.open()

                return null
            }
        }
    }

    // Закрытие всех модальных окон
    static closeAll() {
        return new Promise(async resolve => {
            for (let modal in modals) {
                const current = modals[modal]
    
                await current.close()
            }

            resolve()
        })
    }
    
    // Реинициализация всех модалок
    static reInit() {
        for (let modal in modals) {
            const current = modals[modal]

            current.close()

            current.open_buttons.forEach(button => button.removeEventListener('click', current.open_handler))
            current.close_buttons.forEach(button => button.removeEventListener('click', current.close_handler))
        }
        
        modals = []

        Modal.init()
    }

    static init() {
        const _modals = document.querySelectorAll('[data-modal-type]')

        if (_modals.length) {
            _modals.forEach(modal => modals.push(new Modal(modal)))
        }
    }
}

Modal.init()