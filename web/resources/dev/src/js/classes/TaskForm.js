import Alert from "./Alert.js";
import Modal from "./Modal.js";

class TaskForm {
    constructor(task_form)
    {
        this.task_form = task_form

        this.task_form.addEventListener('submit', this.add.bind(this))
    }

    async add(e)
    {
        e.preventDefault()

        const body = new FormData(this.task_form)

        let response = await fetch('/wp-json/site/v1/task/add', {
            method: "POST",
            body: body
        })

        response = await response.json()
        if (response.success) {
            Modal.openTarget('thanks')
        } else if (response.errors) {
            for (let error in response.errors) {
                Alert.add(response.errors[error], 'error')
            }
        }
    }

    static init()
    {
        const task_form = document.querySelector('.task_form')

        if (task_form) {
            new TaskForm(task_form)
        }
    }
}

TaskForm.init()