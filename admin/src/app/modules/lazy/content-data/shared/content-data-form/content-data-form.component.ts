import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { CookieService } from '@services/cookie.service'
import { ApiContentDataService } from '@services/api/api-content-data.service'

@Component({
    selector: 'app-content-data-form',
    templateUrl: './content-data-form.component.html',
    styleUrls: ['./content-data-form.component.scss'],
})
export class ContentDataFormComponent implements OnInit, OnChanges {
    @Input() mode: 'page' | 'catalog' = 'page'
    @Input() contentData: any
    @Output() onSubmitEvent = new EventEmitter<any>()

    private readonly lang: string
    private readonly defaultFormValue = {
        id: 0,
        title: '',
        content: '',
        contentObject: '',
        action: '',
    }
    public contentObject: string
    public contentCatalog: string
    contentDataForm = this.formBuilder.group(this.defaultFormValue)

    constructor(
        private activatedRoute: ActivatedRoute,
        private apiContentDataService: ApiContentDataService,
        private cookieService: CookieService,
        private formBuilder: FormBuilder
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
        this.contentObject = this.activatedRoute.snapshot.params?.['object']
        this.contentCatalog = this.activatedRoute.snapshot.params?.['catalog']
    }

    ngOnInit(): void {
        this.contentDataForm.reset()
        this.contentDataForm.patchValue({
            action: 'create',
        })
    }

    ngOnChanges(): void {
        const patchValue = this.defaultFormValue
        if (this.contentData && this.contentData.objectName) {
            patchValue.contentObject = this.contentData.objectName
            if (this.mode === 'catalog') {
                patchValue.contentObject = this.contentData.objectCatalog
            }

            if (
                !this.contentData.content ||
                !this.contentData.content.id ||
                !this.contentData.content.title
            ) {
                patchValue.action = 'create'
            } else {
                patchValue.id = this.contentData.content.id
                patchValue.title = this.contentData.content.title
                patchValue.content = this.contentData.content.content
                patchValue.action = 'update'
            }
        } else {
            patchValue.contentObject = this.contentObject
            if (this.mode === 'catalog') {
                patchValue.contentObject = this.contentCatalog
            }
            patchValue.action = 'create'
        }
        this.contentDataForm.patchValue(patchValue)
    }

    onSubmit() {
        this.onSubmitEvent.emit(this.contentDataForm.value)
    }
}
