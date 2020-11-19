import { TestBed } from '@angular/core/testing';

import { ThemeparksService } from './themeparks.service';

describe('ThemeparksService', () => {
  let service: ThemeparksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeparksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
