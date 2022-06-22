import { TestBed } from '@angular/core/testing';

import { ApiContentDataService } from './api-content-data.service';

describe('ApiContentDataService', () => {
  let service: ApiContentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiContentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
