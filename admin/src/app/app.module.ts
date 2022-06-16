import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

// START -- Common / System
import { HttpClientModule } from '@angular/common/http'

// END -- Common / System
// START -- Customs
import { HttpProviders } from '@base/interceptor/response.intercept'
import { I18nModule } from '@base/loader/i18n.loader' // @ngx-translate
// END -- Customs
// START -- Modules / Components
import { SharedModule } from '@sharedModules/shared.module'
import { PrivateModule } from '@modules/private/private.module'
import { PublicModule } from '@modules/public/public.module'

// END -- Modules / Components

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        I18nModule,
        AppRoutingModule,
        SharedModule,
        PrivateModule,
        PublicModule,
    ],
    providers: [HttpProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
