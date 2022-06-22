import { Component, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { CookieService } from '@services/cookie.service'
import { ApiContentObjectService } from '@services/api/api-content-object.service'

interface DataRow {
    id: any
    objectName: any
    objectCatalog: any
}

@Component({
    selector: 'app-content-object',
    templateUrl: './content-object.component.html',
    styleUrls: ['./content-object.component.scss'],
})
export class ContentObjectComponent implements OnInit {
    public readonly lang: string
    public contentObjectList = new BehaviorSubject<DataRow[]>([])

    constructor(
        private apiContentObjectService: ApiContentObjectService,
        private cookieService: CookieService
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
    }

    ngOnInit(): void {
        this.apiContentObjectService.contentObjectList().subscribe({
            next: (data) => {
                if (['success'].includes(data.status)) {
                    if (data.data && data.data.length) {
                        this.contentObjectList.next(data.data)
                    }
                }
            },
        })
    }
}
