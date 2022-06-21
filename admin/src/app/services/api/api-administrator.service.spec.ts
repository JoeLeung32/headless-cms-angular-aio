import { TestBed } from '@angular/core/testing';

import { ApiAdministratorService } from './api-administrator.service';

describe('ApiAdministratorService', () => {
  let service: ApiAdministratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAdministratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
