import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { environment } from '@env/environment'
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
    public qApiPath: string[] = [environment.qApiPath]
    public formMode: 'page' | 'catalog' = 'page'
    public formAction: string = ''
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
        this.formAction = this.activatedRoute.snapshot.data['action']
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
        this.qApiPath = [...this.qApiPath, ...this.apiPath]
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
        let pageReloadURL: string | undefined = undefined
        switch (formData.action) {
            case 'create': {
                // -- Create
                this.apiContentDataService
                    .contentDataCreate(formData)
                    .subscribe({
                        next: (data) => {
                            if (['success'].includes(data.status)) {
                                if (['add'].includes(this.formAction)) {
                                    pageReloadURL = this.router.url.replace(
                                        '/add',
                                        `/${data.data.id}`
                                    )
                                }
                                this.pageReload(pageReloadURL)
                            }
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
                            if (['success'].includes(data.status)) {
                                if (['add'].includes(this.formAction)) {
                                    pageReloadURL = this.router.url.replace(
                                        '/add',
                                        `/${data.data.id}`
                                    )
                                }
                                this.pageReload(pageReloadURL)
                            }
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

    private pageReload(url?: string | undefined) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigate([url ? url : this.router.url])
    }
}
