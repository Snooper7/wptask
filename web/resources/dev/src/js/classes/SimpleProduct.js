/*
    Наследуем основной класс Product.
    Все методы прописаны в нем.
    В этом классе только выбираем с какими данными работать.
    В частности с товарами на страницах сайта, поэтому карточки товара и кнопку добавления в корзину
    выделяем дата атрибутами
*/

import Product from "./Product.js";

let simple_products = []

export default class SimpleProduct extends Product {
    constructor(product)
    {
        // Конструкция super передает данные в конструктор родителя
        super(product);

        this.add_button = this.product.querySelector('[data-product-add]')

        if (this.add_button) {
            this.add_button.addEventListener('click', this.add_handler)
        }
    }

    static reInit()
    {
        simple_products.forEach(product => {
            if (product.add_button) {
                product.add_button.removeEventListener('click', product.add_handler)
            }
        })

        simple_products = []

        SimpleProduct.init()
    }


    static init()
    {
        const products = document.querySelectorAll('[data-product-simple]')

        if (products.length) {
            products.forEach(product => simple_products.push(new SimpleProduct(product)))
        }
    }
}

SimpleProduct.init()

window.addEventListener('product_open', () => {
    SimpleProduct.reInit()
})

