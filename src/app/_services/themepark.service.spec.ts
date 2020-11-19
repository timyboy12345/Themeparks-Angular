import { TestBed } from '@angular/core/testing';

import { ThemeparkService } from './themepark.service';

describe('ThemeparkService', () => {
  let service: ThemeparkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeparkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
