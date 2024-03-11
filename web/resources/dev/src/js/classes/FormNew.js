import Modal from "./Modal.js";
import Alert from "./Alert.js";

export default () => ({
    errors: [],
    success: [],
    init() {
        this.$el.setAttribute('novalidate', true);
    },
    submit() {
        if (this.check()) {
            return false;
        }

        this.$dispatch('load', true);
        this.request().then((e) => {
            if (e.success) {
                this.$dispatch('load', false);
                this.clearForm(this.$el);
                Modal.openTarget('thanks');
            } else {
                Alert.add('Можно прикрепить только: png, jpeg, jpg, pdf файлы', 'error')
                this.$dispatch('load', false);
            }
        });
    },
    change() {
        this.check();

        if (this.$event.target.type === "file") {
            this.uploadFile(this.$event.target);
        }
        const label = this.$el.querySelector(`[for =${this.$event.target.id}]`);
        const error = label.querySelector('.form__error');
        if (error) {
            error.remove();
        }
    },

    deleteError(el) {
        this.errors.forEach((e, index)=> {
            if (e.el === el) {
                this.errors.splice(index, 1)
            }
        })
    },
    deleteSuccess(el) {
        this.success.forEach((e, index)=> {
            if (e.el === el) {
                this.success.splice(index, 1)
            }
        })
    },

    // валидация перед отправкой
    check() {
        this.unsetErrors();

        const inputs = this.$el.querySelectorAll('input, textarea');
        for (let i = 0; i < inputs.length; i++) {
            // проверка на телефон
            if (inputs[i].type === 'tel') {
                if (inputs[i].value.length < 16) {
                    this.deleteSuccess(inputs[i])
                    this.errors.push({ el: inputs[i], text: 'Некорректный телефон' });
                    continue;
                } else {
                    this.deleteError(inputs[i])
                    this.success.push(inputs[i]);
                    continue;
                }
            }



            // проверка на количество символов
            if (inputs[i].type === 'text') {
                if (inputs[i].required &&
                    inputs[i].value.length < 3) {
                    this.deleteSuccess(inputs[i])
                    this.errors.push({el: inputs[i], text: 'Минимум 3 символа'});
                    continue;
                } else {
                    this.deleteError(inputs[i])
                    this.success.push(inputs[i]);
                    continue;
                }
            }

            // проверка всех полей на пустоту
            if (!inputs[i].value &&
                    inputs[i].required ||
                    !inputs[i].checked &&
                    inputs[i].required) {
                this.errors.push({ el: inputs[i], text: 'Заполните поле!' });
            } else {
                this.deleteError(inputs[i])
                this.success.push(inputs[i]);
            }
        }

        this.valid(this.success);

        if (this.errors.length) {
            return this.error(this.errors);
        }


    },

    valid(success) {
        this.success.forEach((e) => {
            if (e.closest('label')) {
                e.closest('label').classList.add('form__input-success')
                e.closest('label').classList.remove('form__label-error')
            }
        })
    },


    error(errors) {
        this.errors.forEach((e) => {
            let span = document.createElement('span');
            span.classList.add('form__error');

            if (e.el.type === 'checkbox') {
                const label = this.$el.querySelector(`[for =${e.el.id}]`);
                label.classList.remove('form__input-success');
                label.classList.add('form__checkbox-error');
            } else {
                const label = this.$el.querySelector(`[for =${e.el.id}]`);
                label.classList.remove('form__input-success');
                label.classList.add('form__label-error');
                span.innerHTML = e.text;
                e.el.before(span);
            }
        })
        return this.errors;
    },
    unsetErrors() {
        // remove all success inputs
        this.$el.querySelectorAll('.form__input-success').forEach(e => e.classList.remove('form__input-success'));

        // remove all errors elements
        this.$el.querySelectorAll('.form__error').forEach(e => e.remove());

        if (this.$el.classList.contains('form__checkbox-error')) {
            this.$el.classList.remove('form__checkbox-error');
        }
        if (this.$el.classList.contains('form__label-error')) {
            this.$el.classList.remove('form__label-error');
        }
    },
    clearForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        const files = this.$el.querySelector('.form__uploads-files');
        if (files) {
            files.remove();
        }

        this.unsetErrors();

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === 'checkbox') {
                inputs[i].checked = false;
                // const label = this.$el.querySelector(`[for=${inputs[i].id}]`);
                // label.style.color = 'unset';
                continue;
            }

            inputs[i].value = '';
        }
    },

    uploadFile(input) {

        const maxSize = 10485760; // макс. размер файла (байт) (поставить: 5242880)
        const maxCount = 5; // макс. кол-во файлов

        const oldFilesHTML = this.$el.querySelector('.form__uploads-files');
        if (oldFilesHTML) {
            oldFilesHTML.remove();
        }
        const label = this.$el.querySelector(`[for ="${input.id}"]`);
        const files = [...input.files];
        // this.changeBtnFile(files);



        // проверяем каждый файл на максимально допустимый размер
        const overSizeFiles = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i]['size'] > maxSize) {
                overSizeFiles.push(files[i]);
            }
        }
        if (overSizeFiles.length > 0) {
            const errorHTML = `<div class="form__error form__error-file">Макс. размер файла: ${formatBytes(maxSize)}</div>`;
            label.insertAdjacentHTML('afterend', errorHTML);
            setTimeout(() => {
                const el = this.$el.querySelector('.form__error-file');
                if (el) {
                    el.remove();
                }
            }, 2000)

            overSizeFiles.forEach((e) => {
                const removeElIndex = files.findIndex(item => item.name === e.name);
                files.splice(removeElIndex, removeElIndex === 0 ? 1 : removeElIndex);
            })
        }



        // Проверяем на макс. кол-во загруженных файлов
        if (files.length > maxCount) {
            files.splice(maxCount, files.length);
            const errorHTML = `<div class="form__error form__error-file">Макс. кол-во файлов: ${maxCount} шт.</div>`;
            label.insertAdjacentHTML('afterend', errorHTML);
            setTimeout(() => {
                const el = this.$el.querySelector('.form__error-file');
                if (el) {
                    el.remove();
                }
            }, 2000)
        }

        // вывести на экран загруженные файлы
        const filesHTML = (files) => {
            let filesHTML = '';
            for (let i = 0; i < files.length; i++) {
                filesHTML +=
                    `<div>
                        <b title="${formatBytes(files[i]['size'])}">${files[i]['name']}<span>${formatBytes(files[i]['size'])}</span> </b>
                        <span>
                            <i title="Удалить файл" @click="$dispatch('remove', '${files[i]['name']}')"></i>
                        </span>
                    </div>`;
            }
            return `<div class="form__uploads-files">${filesHTML}</div>`
        }
        label.insertAdjacentHTML('afterend', filesHTML(files));



        // удалить файл по клику на крестик
        this.$el.addEventListener('remove', (e) => {
            const removeElIndex = files.findIndex(item => item.name === e.detail);
            files.splice(removeElIndex, removeElIndex === 0 ? 1 : removeElIndex);

            e.target.closest('div').remove();

            const dataTransfer = new DataTransfer()
            files.forEach(e => dataTransfer.items.add(e));
            input.files = dataTransfer.files;
            // this.changeBtnFile(files);
        })


    },
    async request() {
        const form = new FormData(this.$el);
        form.append('link', location.href)
        let response = await fetch('/wp-json/site/v1/send_lead', {
            method: 'POST',
            body: form
        });
        response = await response.json();
        return response;
    },
});