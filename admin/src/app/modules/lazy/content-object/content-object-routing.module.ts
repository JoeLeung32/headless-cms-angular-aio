import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ContentObjectComponent } from '@lazyModules/content-object/content-object/content-object.component'
import { ContentObjectCreateComponent } from '@lazyModules/content-object/content-object-create/content-object-create.component'

const routes: Routes = [
    {
        path: '',
        component: ContentObjectComponent,
    },
    {
        path: 'create',
        component: ContentObjectCreateComponent,
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContentObjectRoutingModule {}
