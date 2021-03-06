import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { I18nModule } from '@base/loader/i18n.loader'
import { SharedModule } from '@sharedModules/shared.module'

// START -- Components
import { AdminPanelComponent } from './wrapper/admin-panel/admin-panel.component'
import { ErrorNotFoundComponent } from './pages/error-not-found/error-not-found.component'
import { DashboardComponent } from '@privateModules/dashboard/dashboard.component'

// END -- Components

@NgModule({
    declarations: [
        AdminPanelComponent,
        ErrorNotFoundComponent,
        DashboardComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        I18nModule,
        SharedModule,
    ],
})
export class PrivateModule {}
