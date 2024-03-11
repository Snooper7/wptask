import Alert from './Alert.js'
import Helper from './Helper.js'
import Modal from "./Modal.js";

let forms = []

export default class Form {
    constructor(form)
    {
        this.form = form

        this.submit_handler = this.submit.bind(this)
        this.form.addEventListener('submit', this.submit_handler)

        this.submit_button = this.form.querySelector('[type=submit]')
    }

    async submit(e)
    {
        e.preventDefault()

        // if (Form.valid(this.form)) {
        //     this.submit_button.disabled = true

            // await Helper.recaptha()

            const body = new FormData(this.form)

            let response = await fetch('/wp-json/site/v1/send_lead', {
                method: 'POST',
                body: body
            })

            response = await response.json()

        if (response.success) {
            this.form.reset()
            Modal.openTarget('thanks')
        } else if (response.errors) {
            for (let error in response.errors) {
                Alert.add(response.errors[error], 'error')
            }
        } else {
            Alert.add('При отправке сообщения произошла ошибка', 'error')
        }

        this.submit_button.disabled = false
    }

    static reInit()
    {
        if (forms.length) {
            forms.forEach(form => {
                form.form.removeEventListener('submit', form.submit_handler)
            })

            forms = []

            Form.init()
        }
    }

    static init()
    {
        const _forms = document.querySelectorAll('.form')

        if (_forms.length) {
            _forms.forEach(form => forms.push(new Form(form)))
        }
    }
}

Form.init()