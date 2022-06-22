import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentObjectComponent } from './content-object.component';

describe('ContentObjectComponent', () => {
  let component: ContentObjectComponent;
  let fixture: ComponentFixture<ContentObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentObjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
