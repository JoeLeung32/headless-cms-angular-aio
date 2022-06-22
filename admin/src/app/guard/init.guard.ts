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
import { environment } from '@env/environment'

@Injectable({
    providedIn: 'root',
})
export class InitGuard implements CanActivate, CanActivateChild {
    constructor(private cookieService: CookieService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.logic(route, state)
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.logic(route, state)
    }

    private logic(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const lang = route.params?.['lang']
        if (environment.availableLang.includes(lang)) {
            this.cookieService.setItem('lang', lang)
            return true
        } else {
            this.cookieService.setItem('lang', 'en')
            this.router.navigate(['en'], { replaceUrl: true })
            return false
        }
    }
}
