import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'

import { ApiPanelService } from '@services/api/api-panel.service'
import { ApiAdministratorService } from '@services/api/api-administrator.service'

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
    loginButtonFreeze = new BehaviorSubject(false)

    constructor(
        private apiPanelService: ApiPanelService,
        private apiAdministratorService: ApiAdministratorService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.router.events.subscribe((data) => {
            if (data instanceof NavigationEnd) {
                console.log('~>data', data)
            }
        })
    }

    ngOnInit(): void {}

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
