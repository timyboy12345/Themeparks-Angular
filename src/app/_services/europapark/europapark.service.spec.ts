import { TestBed } from '@angular/core/testing';

import { EuropaparkService } from './europapark.service';

describe('EuropaparkService', () => {
  let service: EuropaparkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuropaparkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
