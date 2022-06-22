import { NgModule } from '@angular/core'
import { ExtraOptions, RouterModule, Routes } from '@angular/router'

// START -- Components
import { AdminPanelComponent } from '@modules/private/wrapper/admin-panel/admin-panel.component'
import { ErrorNotFoundComponent } from '@privateModules/error-not-found/error-not-found.component'
import { DashboardComponent } from '@modules/private/pages/dashboard/dashboard.component'
import { LoginComponent } from '@modules/public/pages/login/login.component'
import { InitGuard } from '@guard/init.guard'
import { TokenGuard } from '@guard/token.guard'
// END -- Components

const lazyLoadedComponents = {
    contentObject: () =>
        import('@lazyModules/content-object/content-object.module').then(
            (m) => m.ContentObjectModule
        ),
    contentData: () =>
        import('@lazyModules/content-data/content-data.module').then(
            (m) => m.ContentDataModule
        ),
}

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
                component: AdminPanelComponent,
                canActivate: [InitGuard, TokenGuard],
                canActivateChild: [InitGuard, TokenGuard],
                children: [
                    {
                        path: '',
                        component: DashboardComponent,
                    },
                    {
                        path: 'content-object',
                        loadChildren: lazyLoadedComponents.contentObject,
                    },
                    {
                        path: 'content-data',
                        loadChildren: lazyLoadedComponents.contentData,
                    },
                ],
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [InitGuard],
            },
            {
                path: '**',
                component: ErrorNotFoundComponent,
            },
        ],
    },
]

export const routingConfiguration: ExtraOptions = {
    paramsInheritanceStrategy: 'always',
}

@NgModule({
    imports: [RouterModule.forRoot(routes, routingConfiguration)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
