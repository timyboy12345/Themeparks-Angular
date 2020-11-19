import { TestBed } from '@angular/core/testing';

import { PhantasialandService } from './phantasialand.service';

describe('PhantasialandService', () => {
  let service: PhantasialandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhantasialandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
