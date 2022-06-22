import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { I18nModule } from '@base/loader/i18n.loader'
import { SharedModule } from '@sharedModules/shared.module'

// START -- Components
import { ContentObjectRoutingModule } from '@lazyModules/content-object/content-object-routing.module'
import { ContentObjectComponent } from '@lazyModules/content-object/content-object/content-object.component'
import { ContentObjectCreateComponent } from '@lazyModules/content-object/content-object-create/content-object-create.component'

// END -- Components
@NgModule({
    declarations: [ContentObjectComponent, ContentObjectCreateComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        I18nModule,
        SharedModule,
        ContentObjectRoutingModule,
    ],
})
export class ContentObjectModule {}
