import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from '@env/environment'

import { CookieService } from '@services/cookie.service'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private accessToken: string | null = null
    private readonly apiToken: string
    private readonly apiPath: string
    private apisIgnoreInterceptorErrorHandler = new BehaviorSubject<string[]>(
        []
    )

    constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService
    ) {
        this.apiPath = environment.apiPath
        this.apiToken = environment.apiToken
        this.accessToken = this.cookieService.getItem('token')
    }

    public adminAccessTokenCheck(): Observable<any> {
        this.accessToken = this.cookieService.getItem('token')
        return this.get('panel/guard', {
            auth: true,
            ignoreInterceptorErrorHandler: true,
        })
    }

    public adminLogin(data: any): Observable<any> {
        const formData = new FormData()
        formData.append('username', data.username)
        formData.append('password', data.password)
        return this.post('panel/login', formData, {
            auth: true,
            ignoreInterceptorErrorHandler: true,
        })
    }

    public adminLogout(): Observable<any> {
        return this.get('panel/logout', {
            auth: true,
            ignoreInterceptorErrorHandler: true,
        })
    }

    private httpHeaders(options?: any): HttpHeaders {
        let headers = new HttpHeaders()
        headers = headers.append('Accept', 'application/json')
        headers = headers.append('Access-Control-Allow-Origin', '*')
        headers = headers.append('x-api-token', this.apiToken)
        if (options) {
            if (options.auth) {
                headers = headers.append(
                    'Authorization',
                    `Bearer ${this.accessToken}`
                )
            }
        }
        return headers
    }

    private get(path: string, options?: any) {
        let headers: HttpHeaders = this.httpHeaders(options)
        const url = `${this.apiPath}${path}`
        this.ignoreInterceptorErrorHandler(url, options)
        return this.httpClient.get(url, {
            headers,
            withCredentials: true,
        })
    }

    private post(path: string, data?: any, options?: any): Observable<any> {
        let headers: HttpHeaders = this.httpHeaders(options)
        const url = `${this.apiPath}${path}`
        this.ignoreInterceptorErrorHandler(url, options)
        return this.httpClient.post(url, data || null, {
            headers,
            withCredentials: true,
        })
    }

    private ignoreInterceptorErrorHandler(path: string, options?: any) {
        let listOfIgnoreInterceptorErrorHandler =
            this.apisIgnoreInterceptorErrorHandler.getValue()
        if (options) {
            if (options.ignoreInterceptorErrorHandler) {
                if (!listOfIgnoreInterceptorErrorHandler.includes(path)) {
                    this.apisIgnoreInterceptorErrorHandler.next([
                        ...this.apisIgnoreInterceptorErrorHandler.getValue(),
                        path,
                    ])
                }
            }
        }
    }

    public ignoreInterceptorErrorHandlerSetter(arr: string[]) {
        return this.apisIgnoreInterceptorErrorHandler.next(arr)
    }

    public ignoreInterceptorErrorHandlerGetter() {
        return this.apisIgnoreInterceptorErrorHandler.getValue()
    }
}
