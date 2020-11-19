import { TestBed } from '@angular/core/testing';

import { EftelingService } from './efteling.service';

describe('EftelingService', () => {
  let service: EftelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EftelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
