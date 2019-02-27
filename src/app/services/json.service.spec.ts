import { TestBed } from '@angular/core/testing';

import { JsonService } from './json.service';

describe('JsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsonService = TestBed.get(JsonService);
    expect(service).toBeTruthy();
  });
});
