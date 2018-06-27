import { TestBed, inject } from '@angular/core/testing';

import { TokenStorage } from './token-storage.service';

describe('TokenStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenStorage]
    });
  });

  it('should be created', inject([TokenStorage], (service: TokenStorage) => {
    expect(service).toBeTruthy();
  }));
});
