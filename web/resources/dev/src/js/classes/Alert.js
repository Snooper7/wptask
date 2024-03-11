let alerts = []
let alert = null

export default class Alert {
    static #lifeTime = 3;

    static close(alert_item) {
        alert_item.classList.add('close')

        clearTimeout(this.close_timeout)

        setTimeout(() => {
            alert_item.remove()
            alerts = alerts.filter(elem => elem != alert_item)
        }, 200)
    }

    static add(text, type = 'success') {
        if (alerts.length >= 3) {
            Alert.close(alerts[0])
        }

        const alert_item = document.createElement('p')

        alert_item.innerText = text

        alert_item.classList.add('alert__box')
        alert_item.classList.add(type) 
        alert_item.style.setProperty('--lifetime', this.#lifeTime + 's')

        alert_item.close_timeout = setTimeout(() => {
            Alert.close(alert_item)
            
            clearInterval(alert_item.close_timeout)
        }, this.#lifeTime * 1000)

        alert.append(alert_item)
        alerts.push(alert_item)
    }

    static create() {
        alert = document.createElement('div')
        alert.className = 'alert'

        document.body.append(alert)
    }
}

Alert.create()
