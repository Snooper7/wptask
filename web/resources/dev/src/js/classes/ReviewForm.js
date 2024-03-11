import Alert from "./Alert.js";
import Modal from "./Modal.js";

class ReviewForm {
    constructor(review_form)
    {
        this.review_form = review_form

        this.review_form.addEventListener('submit', this.add.bind(this))
    }

    async add(e)
    {
        e.preventDefault()

        const body = new FormData(this.review_form)

        let response = await fetch('/wp-json/site/v1/review/add', {
            method: "POST",
            body: body
        })

        response = await response.json()
        if (response.success) {
            Modal.openTarget('thanks-review')
        } else if (response.errors) {
            for (let error in response.errors) {
                Alert.add(response.errors[error], 'error')
            }
        }
    }

    static init()
    {
        const review_form = document.querySelector('.review-form')

        if (review_form) {
            new ReviewForm(review_form)
        }
    }
}

ReviewForm.init()