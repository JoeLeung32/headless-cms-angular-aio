import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'

@Injectable({
    providedIn: 'root',
})
export class ApiContentObjectService extends ApiService {
    private readonly assessToken: string | null

    constructor(private cookieService: CookieService) {
        super()
        this.assessToken = this.cookieService.getItem('token')
    }

    public contentObjectList(): Observable<any> {
        return super.get('content-object/list', {
            auth: this.assessToken,
        })
    }

    public contentObjectCreate(data: any): Observable<any> {
        const formData = new FormData()
        formData.append('objectName', data.objectName)
        formData.append('objectCatalog', data.objectCatalog)
        return super.post('content-object/create', formData, {
            auth: this.assessToken,
        })
    }
}
