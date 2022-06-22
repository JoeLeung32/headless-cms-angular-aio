import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'

@Injectable({
    providedIn: 'root',
})
export class ApiAdministratorService extends ApiService {
    private readonly assessToken: string | null

    constructor(private cookieService: CookieService) {
        super()
        this.assessToken = this.cookieService.getItem('token')
    }

    public administratorList(): Observable<any> {
        return super.get('administrator/list', {
            // auth: this.assessToken,
        })
    }
}
