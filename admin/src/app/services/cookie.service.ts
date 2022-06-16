import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CookieService {
    constructor() {}

    getItem(key: string) {
        const content = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')
        const regExp = new RegExp(
            `(?:(?:^|.*;)\\s*${content}\\s*\\=\\s*([^;]*).*$)|^.*$`
        )
        const decoded = decodeURIComponent(
            document.cookie.replace(regExp, '$1')
        )
        return decoded || null
    }

    setItem(key: string, value: string) {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
            return false
        }
        const date = new Date()
        const newDate = date.setUTCFullYear(date.getUTCFullYear() + 2)
        const sExpires = `expires=${newDate}`
        const cookie = [
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
            sExpires,
            'path=/',
            'secure',
        ]
        document.cookie = cookie.join('; ')
        return true
    }

    removeItem(key: string) {
        if (!key || !this.hasItem(key)) {
            return false
        }
        const cookie = [
            `${encodeURIComponent(key)}=`,
            'expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'path=/',
            'secure',
        ]
        document.cookie = cookie.join('; ')
        return true
    }

    hasItem(key: string) {
        const content = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&')
        const regExp = new RegExp(`(?:^|;\\s*)${content}\\s*\\=`)
        return regExp.test(document.cookie)
    }

    keys() {
        var keys = document.cookie
            .replace(
                /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
                ''
            )
            .split(/\s*(?:\=[^;]*)?;\s*/)
        for (var nIdx = 0; nIdx < keys.length; nIdx++) {
            keys[nIdx] = decodeURIComponent(keys[nIdx])
        }
        return keys
    }
}
