import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ContentDataComponent } from '@lazyModules/content-data/content-data/content-data.component'
import { ContentDataCatalogListComponent } from '@lazyModules/content-data/content-data-catalog-list/content-data-catalog-list.component'

const routes: Routes = [
    {
        path: ':object',
        component: ContentDataComponent,
        data: { mode: 'page' },
    },
    {
        path: 'catalog/:catalog',
        component: ContentDataCatalogListComponent,
        data: { mode: 'catalog' },
    },
    {
        path: 'catalog/:catalog/add',
        component: ContentDataComponent,
        data: { mode: 'catalog', action: 'add' },
    },
    {
        path: 'catalog/:catalog/:id',
        component: ContentDataComponent,
        data: { mode: 'catalog' },
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContentDataRoutingModule {}
