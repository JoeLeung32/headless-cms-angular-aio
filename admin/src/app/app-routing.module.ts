import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

// START -- Components
import { DashboardComponent } from '@modules/private/pages/dashboard/dashboard.component'
import { LoginComponent } from '@modules/public/pages/login/login.component'
import { InitGuard } from '@guard/init.guard'
import { TokenGuard } from '@guard/token.guard'
// END -- Components

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/en',
    },
    {
        path: ':lang',
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [InitGuard, TokenGuard],
                canActivateChild: [InitGuard, TokenGuard],
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [InitGuard],
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
