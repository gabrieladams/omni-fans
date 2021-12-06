import { TestBed } from '@angular/core/testing';

import { OmniFansService } from './omnifan.service';

describe('OmniFansService', () => {
  let service: OmniFansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmniFansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
