import { TestBed } from '@angular/core/testing';

import { Create } from './create';

describe('Create', () => {
  let service: Create;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Create);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
