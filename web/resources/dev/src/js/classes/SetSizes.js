function setSizes() {
    const sizes = {
        // header_height: document.querySelector('.header').clientHeight,
    }

    for (let size in sizes) {
        document.querySelector(':root').style.setProperty(`--${size}`, `${sizes[size]}px`)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Установка css переменных
    window.addEventListener('resize', setSizes)
    setInterval(setSizes, 2000)
    setSizes()
})