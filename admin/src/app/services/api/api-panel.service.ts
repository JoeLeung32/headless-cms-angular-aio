import { Injectable } from '@angular/core'
import { Observable, Observer } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'

@Injectable({
    providedIn: 'root',
})
export class ApiPanelService extends ApiService {
    private assessToken: string | null

    constructor(private cookieService: CookieService) {
        super()
        this.assessToken = this.cookieService.getItem('token')
    }

    public panelLogin(data: any): Observable<any> {
        return new Observable((subscriber) => {
            const formData = new FormData()
            formData.append('username', data.username)
            formData.append('password', data.password)
            super
                .post('panel/login', formData, {
                    ignoreInterceptorErrorHandler: true,
                })
                .subscribe({
                    next: (data: any) => {
                        if (['success'].includes(data.status)) {
                            this.cookieService.setItem(
                                'token',
                                data.data.accessToken
                            )
                        }
                        subscriber.next(data)
                        subscriber.complete()
                    },
                    error: (err) => subscriber.error(err),
                })
        })
    }

    public panelLogout(): Observable<any> {
        return new Observable((subscriber) => {
            super
                .get('panel/logout', {
                    auth: this.assessToken,
                    ignoreInterceptorErrorHandler: true,
                })
                .subscribe({
                    next: (data: any) => {
                        this.cookieService.removeItem('token')
                        subscriber.next(data)
                        subscriber.complete()
                    },
                    error: (err) => subscriber.error(err),
                })
        })
    }

    public panelGuard(observer?: Partial<Observer<any>>): Observable<any> {
        this.assessToken = this.cookieService.getItem('token')
        return super.get('panel/guard', {
            auth: this.assessToken,
            ignoreInterceptorErrorHandler: true,
        })
    }
}
