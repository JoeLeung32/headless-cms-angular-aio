import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { ApiPanelService } from '@services/api/api-panel.service'
import { ApiAdministratorService } from '@services/api/api-administrator.service'

@Component({
    selector: 'app-private',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    loginButtonFreeze = new BehaviorSubject(false)

    constructor(
        private apiPanelService: ApiPanelService,
        private apiAdministratorService: ApiAdministratorService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {}

    onTest(): void {
        this.apiAdministratorService.administratorList().subscribe((data) => {
            console.log('~>data', data)
        })
    }

    onLogout(): void {
        this.loginButtonFreeze.next(true)
        this.apiPanelService.panelLogout().subscribe((data) => {
            if (['success'].includes(data.status)) {
                const lang = this.activatedRoute.snapshot.params?.['lang']
                this.router.navigate([`${lang}/login`], { replaceUrl: true })
            }
        })
    }
}
