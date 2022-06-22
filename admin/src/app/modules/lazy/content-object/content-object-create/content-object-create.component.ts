import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { CookieService } from '@services/cookie.service'
import { ApiContentObjectService } from '@services/api/api-content-object.service'

@Component({
    selector: 'app-content-object-create',
    templateUrl: './content-object-create.component.html',
    styleUrls: ['./content-object-create.component.scss'],
})
export class ContentObjectCreateComponent implements OnInit {
    contentObjectForm = this.formBuilder.group({
        objectName: '',
        objectCatalog: '',
    })
    formButtonFreeze = new BehaviorSubject(false)
    private readonly lang: string

    constructor(
        private apiContentObjectService: ApiContentObjectService,
        private cookieService: CookieService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
    }

    ngOnInit(): void {}

    onSubmit(): void {
        this.formButtonFreeze.next(true)
        this.apiContentObjectService
            .contentObjectCreate(this.contentObjectForm.value)
            .subscribe({
                next: (data) => {
                    if (['success'].includes(data.status)) {
                        setTimeout(() => {
                            this.router.navigate(
                                [`${this.lang}/content-data/${data.data.name}`],
                                {
                                    replaceUrl: true,
                                }
                            )
                        }, 500)
                    }
                    this.formButtonFreeze.next(false)
                    this.contentObjectForm.reset()
                },
                error: (err) => {
                    this.formButtonFreeze.next(false)
                    this.contentObjectForm.reset()
                },
            })
    }
}
