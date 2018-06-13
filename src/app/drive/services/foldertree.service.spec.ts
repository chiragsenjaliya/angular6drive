import { TestBed, inject } from '@angular/core/testing';

import { FoldertreeService } from './foldertree.service';

describe('FoldertreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoldertreeService]
    });
  });

  it('should be created', inject([FoldertreeService], (service: FoldertreeService) => {
    expect(service).toBeTruthy();
  }));
});
