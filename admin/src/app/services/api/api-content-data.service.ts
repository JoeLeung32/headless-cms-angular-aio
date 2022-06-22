import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'

@Injectable({
    providedIn: 'root',
})
export class ApiContentDataService extends ApiService {
    private readonly assessToken: string | null

    constructor(private cookieService: CookieService) {
        super()
        this.assessToken = this.cookieService.getItem('token')
    }

    public contentDataCreate(data: any): Observable<any> {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('content', data.content)
        formData.append('contentObject', data.contentObject)
        return super.post('content-data/create', formData, {
            auth: this.assessToken,
        })
    }

    public contentDataUpdate(data: any): Observable<any> {
        const formData = new FormData()
        formData.append('id', data.id)
        formData.append('title', data.title)
        formData.append('content', data.content)
        return super.post('content-data/update', formData, {
            auth: this.assessToken,
        })
    }

    public contentDataDetail(
        data: any,
        type: 'page' | 'catalog'
    ): Observable<any> {
        const formData = new FormData()
        formData.append('contentType', type)
        switch (type) {
            case 'page': {
                formData.append('contentObject', data.contentObject)
                break
            }
            case 'catalog': {
                formData.append('contentCatalog', data.contentCatalog)
                if (data.contentDataId) {
                    formData.append('contentDataId', data.contentDataId)
                }
                break
            }
        }
        return super.post('content-data/detail', formData, {
            auth: this.assessToken,
        })
    }
}
