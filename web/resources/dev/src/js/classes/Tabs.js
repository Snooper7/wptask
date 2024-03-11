export default class Tabs {
    constructor(tabs) {
        this.tabs_parent = tabs

        this.togglers = this.tabs_parent.querySelectorAll('[data-tab-target]')
        this.togglers.forEach(toggler => toggler.addEventListener('click', this.toggle.bind(this)))
    
        this.tabs = this.tabs_parent.querySelectorAll('[data-tab]')
        this.tabs.forEach(tab => tab.hidden = true)
        
        this.togglers[0].click()
    }

    toggle(e) {
        this.togglers.forEach(toggler => toggler.classList.remove('active'))
        this.tabs.forEach(tab => tab.hidden = true)

        e.target.classList.add('active')

        const tab_target = e.target.dataset.tabTarget
        
        this.tabs.forEach(tab => {
            if (tab.dataset.tab == tab_target)
                tab.hidden = false
        })
    }

    static init() {
        const tabs = document.querySelectorAll('[data-tabs-parent]')

        if (tabs.length) {
            tabs.forEach(tab => new Tabs(tab))
        }
    }
}

Tabs.init()