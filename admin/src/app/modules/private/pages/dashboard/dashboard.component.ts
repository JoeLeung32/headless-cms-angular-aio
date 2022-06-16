import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { ApiService } from '@services/api.service'
import { CookieService } from '@services/cookie.service'

@Component({
    selector: 'app-private',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    loginButtonFreeze = new BehaviorSubject(false)

    constructor(
        private apiService: ApiService,
        private cookieService: CookieService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {}

    onLogout(): void {
        this.loginButtonFreeze.next(true)
        this.apiService.adminLogout().subscribe((data) => {
            if (['success'].includes(data.status)) {
                const lang = this.activatedRoute.snapshot.params?.['lang']
                this.cookieService.removeItem('token')
                this.router.navigate([`${lang}/login`], { replaceUrl: true })
            }
        })
    }
}
