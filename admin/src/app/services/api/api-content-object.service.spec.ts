import { TestBed } from '@angular/core/testing';

import { ApiContentObjectService } from './api-content-object.service';

describe('ApiContentObjectService', () => {
  let service: ApiContentObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiContentObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
