import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { CookieService } from '@services/cookie.service'
import { ApiPanelService } from '@services/api/api-panel.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm = this.formBuilder.group({
        username: '',
        password: '',
    })
    loginButtonFreeze = new BehaviorSubject(false)
    private readonly lang: string

    constructor(
        private apiPanelService: ApiPanelService,
        private cookieService: CookieService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.lang = this.cookieService.getItem('lang') || 'en'
        this.cookieService.removeItem('token')
    }

    ngOnInit(): void {}

    onSubmit(): void {
        this.loginButtonFreeze.next(true)
        this.apiPanelService.panelLogin(this.loginForm.value).subscribe({
            next: (data) => {
                if (['success'].includes(data.status)) {
                    setTimeout(() => {
                        this.router.navigate([`${this.lang}`], {
                            replaceUrl: true,
                        })
                    }, 500)
                }
                this.loginForm.reset()
            },
            error: (err) => {
                this.loginButtonFreeze.next(false)
                this.loginForm.reset()
            },
        })
    }
}
