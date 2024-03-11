export default class Inputer {
    constructor(item) {
        this.element = item
        this.words = this.element.dataset.words.split(', ')
        this.word_num = 0

        this.start()
    }

    start() {
        this.char_position = 0

        this.input()
    }

    input() {
        let chars = this.words[this.word_num].split('')

        let input_timer = setInterval(() => {
            this.element.innerText += chars[this.char_position]
            this.char_position++

            if (this.char_position >= chars.length) {
                clearInterval(input_timer)

                setTimeout(() => {
                    this.deleted(chars)
                }, 1000)
            }
        }, 100)
    }

    deleted(chars) {
        let deleted_timer = setInterval(() => {
            this.element.innerText = chars.join('')
            this.char_position--
            
            chars.pop()

            if (this.char_position < 0) {
                clearInterval(deleted_timer)

                this.word_num++

                if (this.word_num > this.words.length - 1) {
                    this.word_num = 0
                }

                this.start()
            }
        }, 100)
    }

    static init() {
        const inputers = document.querySelectorAll('[data-words]')

        if (inputers) {
            inputers.forEach(item => new Inputer(item))
        }
    }

}

Inputer.init()