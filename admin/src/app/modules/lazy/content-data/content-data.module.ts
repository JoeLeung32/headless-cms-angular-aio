import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { I18nModule } from '@base/loader/i18n.loader'
import { SharedModule } from '@sharedModules/shared.module'

// START -- Components
import { ContentDataRoutingModule } from '@lazyModules/content-data/content-data-routing.module'
import { ContentDataComponent } from '@lazyModules/content-data/content-data/content-data.component'
import { ContentDataFormComponent } from '@lazyModules/content-data/shared/content-data-form/content-data-form.component'
import { ContentDataCatalogListComponent } from '@lazyModules/content-data/content-data-catalog-list/content-data-catalog-list.component'

// End -- Components
@NgModule({
    declarations: [
        ContentDataComponent,
        ContentDataFormComponent,
        ContentDataFormComponent,
        ContentDataCatalogListComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        I18nModule,
        SharedModule,
        ContentDataRoutingModule,
    ],
})
export class ContentDataModule {}
