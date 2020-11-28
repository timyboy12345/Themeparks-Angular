import { TestBed } from '@angular/core/testing';

import { BellewaerdeService } from './bellewaerde.service';

describe('BellewaerdeService', () => {
  let service: BellewaerdeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BellewaerdeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
