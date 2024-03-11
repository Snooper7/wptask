// Куки
export default class Cookie {
    static get(name) {

        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ))
        return matches ? decodeURIComponent(matches[1]) : undefined
    }

    static set(name, value, props) {

        props = props || {}

        var exp = props.expires

        if (typeof exp == "number" && exp) {
            console.log('da')
        }

        if (typeof exp == "number" && exp) {
            let date = new Date(Date.now() + (exp * 86400e3));
            date = date.toUTCString();

            exp = props.expires = date
        }

        if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }

        value = encodeURIComponent(value)

        var updatedCookie = name + "=" + value

        for(var propName in props){

            updatedCookie += "; " + propName

            var propValue = props[propName]

            if(propValue !== true){ updatedCookie += "=" + propValue }
        }

        document.cookie = updatedCookie

    }

    static delete(name) {
        Cookie.set(name, null, { expires: -1 })
    }
}