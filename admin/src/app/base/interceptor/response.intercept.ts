import { Injectable } from '@angular/core'
import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ApiService } from '@services/api.service'

@Injectable()
class ResponseInterceptor implements HttpInterceptor {
    constructor(private apiService: ApiService) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                next: (response) => {
                    this.next(response)
                },
                error: (err) => {
                    this.err(err)
                },
            })
        )
    }

    private next(response: any) {
        const list = this.apiService.ignoreInterceptorErrorHandlerGetter()
        if (response instanceof HttpResponse) {
            const url = <string>response.url
            if (list && list.length && list.includes(url)) {
                this.updateListOfIgnoreInterceptorErrorHandler(url)
            }
        }
    }

    private err(err: any) {
        const list = this.apiService.ignoreInterceptorErrorHandlerGetter()
        if (err instanceof HttpErrorResponse && ![200].includes(err.status)) {
            const url = <string>err.url
            if (list && list.length && list.includes(url)) {
                this.updateListOfIgnoreInterceptorErrorHandler(url)
            } else {
                if (typeof window !== 'undefined') {
                    window.alert(`${err.status}: ${err.statusText}`)
                }
            }
        }
    }

    private updateListOfIgnoreInterceptorErrorHandler(path: string) {
        const list = this.apiService.ignoreInterceptorErrorHandlerGetter()
        this.apiService.ignoreInterceptorErrorHandlerSetter(
            list.filter((url) => url !== path)
        )
    }
}

export const HttpProviders = {
    provide: HTTP_INTERCEPTORS,
    useClass: ResponseInterceptor,
    multi: true,
}
