import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { I18nModule } from '@base/loader/i18n.loader'
import { SharedModule } from '@sharedModules/shared.module'
// START -- Components
import { DashboardComponent } from './pages/dashboard/dashboard.component'

// END -- Components

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, I18nModule, SharedModule],
})
export class PrivateModule {}
