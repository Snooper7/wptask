// Функции
export default class Functions {
    static htmlToElement(html) {
        const template = document.createElement('template');

        html = html.trim();

        template.innerHTML = html;

        return template.content.firstChild;
    }

    // Создание кода рекапчи
    static recaptha() {
        return new Promise(function (resolve, reject) {
            grecaptcha.ready(function () {
                grecaptcha.execute('6LcBZekUAAAAABN1SVylHf7xmgHtfY7Z0KZHD0em', {action: 'contact'}).then(function (token) {
                    document.querySelectorAll('[name="recaptcha_response"]').forEach(rres => rres.value = token)
                    resolve()
                });
            });
        })
    }

    static getScrollPercent() {
        let mainContentHeight = document.querySelector('body').offsetHeight - innerHeight
        let windowScrollProcent = window.pageYOffset / mainContentHeight * 100

        return windowScrollProcent
    }

}