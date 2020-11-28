import { TestBed } from '@angular/core/testing';

import { PortaVenturaService } from './portaventura.service';

describe('PortaventuraService', () => {
  let service: PortaVenturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortaVenturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
