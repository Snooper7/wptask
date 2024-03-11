import Swiper, {
    Navigation, Pagination, Thumbs, EffectFade, Autoplay, FreeMode
} from 'swiper';

Swiper.use([Navigation, Pagination, Thumbs, EffectFade, Autoplay, FreeMode]);

let sliders = []
export {sliders}

export default class Slider {
    static reInit() {
        if (sliders) {
            sliders.forEach(slider => slider.destroy())
        }

        Slider.init()
    }

    static init() {
        // Added class for splide slides
        if (document.querySelectorAll('.swiper-wrapper')) {
            document.querySelectorAll('.swiper-wrapper > *').forEach(slide => slide.classList.add('swiper-slide'))
        }

        // Главный экран
        const slider = document.querySelector('.slider')
        if (slider) {
            this.createSlider(slider, {
                slidesPerView: 3,
                spaceBetween: 12,
                allowTouchMove: false,
                loop: false,
                autoHeight: false,
                calculateHeight: false,
                speed: 1000,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: false
                }
            })
        }
        // Section Reviews
        const reviews = document.querySelector('.reviews__slider')
        if (reviews) {
            this.createSlider(reviews, {
                slidesPerView: 1,
                spaceBetween: 8,
                allowTouchMove: true,
                centeredSlides: true,
                loop: true,
                breakpoints: {
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    // autoHeight: false,
                    // calculateHeight: false,
                    speed: 1000,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: false
                    }
                }
            })
        }
    }

    static createSlider(parent, options) {
        const box = parent
        const swiper = box.querySelector('.swiper')

        if (swiper) {
            // Arrows
            const prev_arrow = box.querySelector('.slider__arrow--prev')
            const next_arrow = box.querySelector('.slider__arrow--next')

            if (prev_arrow || next_arrow) {
                options.navigation = {
                    prevEl: prev_arrow ? prev_arrow : null,
                    nextEl: next_arrow ? next_arrow : null,
                }
            }

            // Dotted
            const dotted = box.querySelector('.dotted')

            if (dotted) {
                options.pagination = {
                    el: dotted,
                    type:'bullets',
                    clickable: true
                }
            }

            // Индикаторы
            const indicator = box.querySelector('.slider-indicator')

            if (indicator) {
                options.pagination = {
                    el: indicator,
                    type:'fraction',
                }
            }

            let slider = new Swiper(swiper, options)

            // Переключатели
            const slider_toggle = swiper.closest('[data-slide-toggle]')

            if (slider_toggle) {
                const slider_togglers = slider_toggle.querySelectorAll('[data-slide-target]')

                if (slider_togglers) slider_togglers.forEach(slide => {
                    slide.addEventListener('click', (e) => {
                        slider_togglers.forEach(slide_ => slide_.classList.remove('active'))
                        slide.classList.add('active')

                        const target = parseInt(slide.dataset.slideTarget)
                        slider.slideTo(target)
                    })
                })
            }

            sliders.push(slider)

            return slider
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Slider.init()
})