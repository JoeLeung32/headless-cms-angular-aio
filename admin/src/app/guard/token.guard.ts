import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'
import { I18nService } from '@services/i18n.service'

@Injectable({
    providedIn: 'root',
})
export class TokenGuard implements CanActivate {
    private readonly lang: string

    constructor(
        private apiService: ApiService,
        private cookieService: CookieService,
        private i18nService: I18nService,
        private router: Router
    ) {
        this.lang =
            this.cookieService.getItem('lang') ||
            this.i18nService.translate.currentLang
    }

    canActivate(
        activatedRouteSnapshot: ActivatedRouteSnapshot,
        routerStateSnapshot: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const accessToken = this.cookieService.getItem('token')
        const hasToken = !!(accessToken && accessToken.trim().length >= 1)

        if (!hasToken) {
            this.router.navigate([`${this.lang}/login`], { replaceUrl: true })
        }
        if (accessToken) {
            this.apiService.adminAccessTokenCheck().subscribe({
                next: (data) => {
                    if (!['success'].includes(data.status)) {
                        this.router.navigate([`${this.lang}/login`], {
                            replaceUrl: true,
                        })
                    }
                },
                error: (err) => {
                    this.router.navigate([`${this.lang}/login`], {
                        replaceUrl: true,
                    })
                },
            })
        }
        return hasToken
    }
}