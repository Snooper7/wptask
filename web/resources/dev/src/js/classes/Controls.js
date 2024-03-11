export default class Controls {
    constructor(elem) {
        window.addEventListener('keyup', e => {
            switch (e.key) {
                case 'Escape':
                    this.close()
                    break
                case 'ArrowLeft':
                    this.prev()
                    break
                case 'ArrowRight':
                    this.next()
                    break
            }
        })
    }
    
    close() {
   
    }

    prev() {
   
    }

    next() {
   
    }
}