let options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.5
}

let callback = function (entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active')
        }
    })
}

let observer = new IntersectionObserver(callback, options);

let effects = document.querySelectorAll('.effect')

effects.forEach(effect => {
    observer.observe(effect);
})
