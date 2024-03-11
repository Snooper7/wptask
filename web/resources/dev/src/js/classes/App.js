import Helper from './Helper.js'

let app = null

class App {

    async updateFragments(fragments)
    {
        return new Promise(async resolve => {
            if (fragments) {
                await this.updateFragmentsPromise(fragments)
            }

            resolve()
        })
    }

    updateFragmentsPromise(fragments)
    {
        return new Promise(resolve => {
            for (let fragment in fragments) {
                const find = document.querySelectorAll('.' + fragment)

                if (find.length) {
                    find.forEach(async element => {
                        const new_element = Helper.htmlToElement(fragments[fragment])

                        element.parentNode.replaceChild(new_element, element);
                    })
                }
            }
            resolve()
        })
    }
}

app = new App()

export { app }

