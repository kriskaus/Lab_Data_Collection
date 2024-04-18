import { TestBed } from '@angular/core/testing';

import { DiaolgService } from './diaolg.service';

describe('DiaolgServiceService', () => {
  let service: DiaolgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaolgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
