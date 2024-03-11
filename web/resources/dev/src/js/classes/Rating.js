class Rating {
    constructor(rating)
    {
        this.rating = rating
        this.input = this.rating.querySelector('[name=rating]')

        this.buttons = this.rating.querySelectorAll('.input-rating-star')
        this.buttons.forEach(button => button.addEventListener('click', this.set.bind(this)))
    }

    set(e)
    {
        let grade = e.target.closest('.input-rating-star').dataset.grade
        this.input.value = grade

        this.buttons.forEach(button => button.classList.remove('active'))
        this.buttons.forEach((button, index) => index < grade ? button.classList.add('active') : '')
    }

    static init()
    {
        const ratings = document.querySelectorAll('.input-rating')

        if (ratings.length) {
            ratings.forEach(rating => new Rating(rating))
        }
    }
}

Rating.init()