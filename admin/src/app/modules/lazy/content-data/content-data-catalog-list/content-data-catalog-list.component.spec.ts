import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDataCatalogListComponent } from './content-data-catalog-list.component';

describe('ContentDataCatalogListComponent', () => {
  let component: ContentDataCatalogListComponent;
  let fixture: ComponentFixture<ContentDataCatalogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentDataCatalogListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentDataCatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
