import { TestBed } from '@angular/core/testing';

import { HeidiparkService } from './heidipark.service';

describe('HeidiparkService', () => {
  let service: HeidiparkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeidiparkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
