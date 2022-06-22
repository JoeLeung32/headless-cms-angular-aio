import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentObjectCreateComponent } from './content-object-create.component';

describe('ContentObjectCreateComponent', () => {
  let component: ContentObjectCreateComponent;
  let fixture: ComponentFixture<ContentObjectCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentObjectCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentObjectCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
