import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'

import { environment } from '@env/environment'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private httpClient
    private readonly apiToken: string
    private readonly apiPath: string
    private apisIgnoreInterceptorErrorHandler = new BehaviorSubject<string[]>(
        []
    )

    constructor() {
        this.httpClient = inject(HttpClient)
        this.apiPath = environment.apiPath
        this.apiToken = environment.apiToken
    }

    protected get(path: string, options?: any) {
        let headers: HttpHeaders = this.httpHeaders(options)
        const url = `${this.apiPath}${path}`
        this.ignoreInterceptorErrorHandler(url, options)
        return this.httpClient.get(url, {
            headers,
            withCredentials: true,
        })
    }

    protected post(path: string, data?: any, options?: any): Observable<any> {
        let headers: HttpHeaders = this.httpHeaders(options)
        const url = `${this.apiPath}${path}`
        this.ignoreInterceptorErrorHandler(url, options)
        return this.httpClient.post(url, data || null, {
            headers,
            withCredentials: true,
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
                    `Bearer ${options.auth}`
                )
            }
        }
        return headers
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
