export default () => ({
    tasks: {},

    async init() {
        this.tasks = await this.getTasks()

        setTimeout(function () {
            window.dispatchEvent(new Event('tasks_loaded'))
        }, 100)
    },

    async add() {
        const body = new FormData()
            const inputs = this.$el.querySelectorAll('input, textarea')

        inputs.forEach((item) => {
            if (item.value) {
                body.append(item.name, item.value)
            }
        })

        let response = await fetch('/wp-json/site/v1/task/add', {
            method: "POST",
            body: body
        })

        response = response ? await response.json() : null;
    if (response.success && response.tasks) {
        this.tasks = response.tasks

        window.dispatchEvent(new Event('tasks_loaded'))
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

        window.dispatchEvent(new Event('tasks_loaded'))
    }
    },

    setDataForUpdate(id, title, target, post_content) {
        this.$refs.edit_id.value = id
        this.$refs.edit_title.value = title
        this.$refs.edit_target.value = target
        this.$refs.edit_text.value = post_content
    },

    async update(id) {
        const body = new FormData()
        const inputs = this.$el.querySelectorAll('input, textarea')

        inputs.forEach((item) => {
            if (item.value) {
                body.append(item.name, item.value)
            }
        })

        let response = await fetch('/wp-json/site/v1/task/update', {
            method: "POST",
            body: body
        })

        response = response ? await response.json() : null;
    if (response.success && response.tasks) {
        this.tasks = response.tasks

        window.dispatchEvent(new Event('tasks_loaded'))
    }
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

        window.dispatchEvent(new Event('tasks_loaded'))
    }
    },

    getTasks() {
        return new Promise(async resolve => {
            let response = await fetch('/wp-json/site/v1/task/all')

            response = await response.json()

            if (response.tasks) {
                resolve(response.tasks)
            }
        })
    }
})