import { TestBed } from '@angular/core/testing';

import { ApiPanelService } from './api-panel.service';

describe('ApiPanelService', () => {
  let service: ApiPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
