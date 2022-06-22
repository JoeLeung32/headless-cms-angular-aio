import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDataFormComponent } from './content-data-form.component';

describe('ContentDataFormComponent', () => {
  let component: ContentDataFormComponent;
  let fixture: ComponentFixture<ContentDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentDataFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
