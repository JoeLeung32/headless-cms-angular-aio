import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { I18nModule } from '@base/loader/i18n.loader'
import { SharedModule } from '@sharedModules/shared.module'
// START -- Components
import { LoginComponent } from './pages/login/login.component'

// END -- Components

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        I18nModule,
        SharedModule,
    ],
})
export class PublicModule {}
