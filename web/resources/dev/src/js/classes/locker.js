export const lock = () => {
    document.body.dispatchEvent(new CustomEvent('load', {
        detail: true
    }))
}

export const unlock = () => {
    document.body.dispatchEvent(new CustomEvent('load', {
        detail: false
    }))
}