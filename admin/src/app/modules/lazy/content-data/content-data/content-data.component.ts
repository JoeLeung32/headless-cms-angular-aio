import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { CookieService } from '@services/cookie.service'
import { ApiContentDataService } from '@services/api/api-content-data.service'

@Component({
    selector: 'app-content-data',
    templateUrl: './content-data.component.html',
    styleUrls: ['./content-data.component.scss'],
})
export class ContentDataComponent implements OnInit {
    public readonly lang: string
    public apiPath: string[] = ['api', 'q']
    public formMode: 'page' | 'catalog' = 'page'
    public contentObject: string
    public contentCatalog: string
    public contentDataId: string
    public contentData = new BehaviorSubject<any>(null)

    constructor(
        private activatedRoute: ActivatedRoute,
        private apiContentDataService: ApiContentDataService,
        private cookieService: CookieService,
        private router: Router
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
        this.contentObject = this.activatedRoute.snapshot.params?.['object']
        this.contentCatalog = this.activatedRoute.snapshot.params?.['catalog']
        this.contentDataId = this.activatedRoute.snapshot.params?.['id']
        this.formMode = this.activatedRoute.snapshot.data['mode']
    }

    ngOnInit(): void {
        const params = {
            contentObject: '',
            contentCatalog: '',
            contentDataId: '',
        }
        if (this.contentObject) {
            params.contentObject = this.contentObject
            this.apiPath.push(this.contentObject)
        }
        if (this.contentCatalog) {
            params.contentCatalog = this.contentCatalog
            this.apiPath.push(this.contentCatalog)
        }
        if (this.contentDataId) {
            params.contentDataId = this.contentDataId
            this.apiPath.push(this.contentDataId)
        }
        this.apiContentDataService
            .contentDataDetail(params, this.formMode)
            .subscribe({
                next: (data) => {
                    if (['success'].includes(data.status)) {
                        if (data.data) {
                            this.contentData.next(data.data)
                        }
                    }
                },
            })
    }

    onSubmit(formData: any) {
        switch (formData.action) {
            case 'create': {
                // -- Create
                this.apiContentDataService
                    .contentDataCreate(formData)
                    .subscribe({
                        next: (data) => {
                            this.pageReload()
                        },
                    })
                break
            }
            case 'update': {
                // -- Update
                this.apiContentDataService
                    .contentDataUpdate(formData)
                    .subscribe({
                        next: (data) => {
                            this.pageReload()
                        },
                    })
                break
            }
            default: {
                console.log('~>No Handler')
                break
            }
        }
    }

    private pageReload() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigate([this.router.url])
    }
}
