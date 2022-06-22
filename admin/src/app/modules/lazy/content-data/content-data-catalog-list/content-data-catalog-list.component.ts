import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { CookieService } from '@services/cookie.service'
import { ApiContentDataService } from '@services/api/api-content-data.service'

@Component({
    selector: 'app-content-data-catalog-list',
    templateUrl: './content-data-catalog-list.component.html',
    styleUrls: ['./content-data-catalog-list.component.scss'],
})
export class ContentDataCatalogListComponent implements OnInit {
    public readonly lang: string
    public apiPath: string[] = ['api', 'q']
    public formMode: 'page' | 'catalog' = 'catalog'
    public contentCatalog: string
    public contentData = new BehaviorSubject<any>(null)

    constructor(
        private activatedRoute: ActivatedRoute,
        private apiContentDataService: ApiContentDataService,
        private cookieService: CookieService,
        private router: Router
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
        this.contentCatalog = this.activatedRoute.snapshot.params?.['catalog']
        this.formMode = this.activatedRoute.snapshot.data['mode']
    }

    ngOnInit(): void {
        const params = {
            contentObject: '',
            contentCatalog: '',
            contentDataId: '',
        }
        if (this.contentCatalog) {
            params.contentCatalog = this.contentCatalog
            this.apiPath.push(this.contentCatalog)
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

    onSubmit(formData: any) {}

    private pageReload() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.onSameUrlNavigation = 'reload'
        this.router.navigate([this.router.url])
    }
}
