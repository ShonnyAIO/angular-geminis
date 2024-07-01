import { TestBed } from '@angular/core/testing';

import { GeminisService } from './geminis.service';

describe('GeminisService', () => {
  let service: GeminisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
