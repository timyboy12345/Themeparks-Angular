import { TestBed } from '@angular/core/testing';

import { ParcasterixService } from './parcasterix.service';

describe('ParcasterixService', () => {
  let service: ParcasterixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcasterixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
