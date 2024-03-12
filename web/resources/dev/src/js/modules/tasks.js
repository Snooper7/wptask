import Modal from "../classes/Modal.js";

export default () => ({
    tasks: {},

    init() {
        this.tasks = this.getTasks()
    },

    async add() {
        const body = new FormData()
        const inputs = this.$el.querySelectorAll('input, textarea')
        console.log(this.$el)
        inputs.forEach((item) => {
            if (item.value) {
                // body.append(item.name, item.value)
                // console.log(item.name)
            }
        })
        body.append('time', 12312)
        let response = await fetch('/wp-json/site/v1/task/add', {
            method: "POST",
            body: body
        })
        response = response ? await response.json() : null;
        if (response.success && response.tasks) {
            // Modal.closeAll()
            // Modal.reInit()
            this.tasks = response.tasks
        }
    },

    async remove(id) {
        const body = new FormData()
        body.append('id', id)

        let response = await fetch('/wp-json/site/v1/task/remove', {
            method: "POST",
            body: body
        })

        response = await response.json()

    if (response.success && response.tasks) {
        this.tasks = response.tasks
    }
    },

    update() {

    },

    async doneToggle(id, done) {
        const body = new FormData()
        body.append('id', id)
        body.append('done', done)

        let response = await fetch('/wp-json/site/v1/task/done', {
            method: "POST",
            body: body
        })

        response = await response.json()

    if (response.success && response.tasks) {
        this.tasks = response.tasks
    }
    },

    async getTasks() {
        let response = await fetch('/wp-json/site/v1/task/all')

        response = await response.json()

        if (response.tasks) {
            return response.tasks
        }
    }
})