import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'

import { CookieService } from '@services/cookie.service'
import { I18nService } from '@services/i18n.service'
import { ApiPanelService } from '@services/api/api-panel.service'

@Injectable({
    providedIn: 'root',
})
export class TokenGuard implements CanActivate, CanActivateChild {
    private readonly lang: string

    constructor(
        private apiPanelService: ApiPanelService,
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
        return this.logic(activatedRouteSnapshot, routerStateSnapshot)
    }

    canActivateChild(
        activatedRouteSnapshot: ActivatedRouteSnapshot,
        routerStateSnapshot: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.logic(activatedRouteSnapshot, routerStateSnapshot)
    }

    private logic(
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
            this.apiPanelService.panelGuard().subscribe({
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
