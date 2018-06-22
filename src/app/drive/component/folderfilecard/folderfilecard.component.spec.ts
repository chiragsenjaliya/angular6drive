import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderfilecardComponent } from './folderfilecard.component';

describe('FolderfilecardComponent', () => {
  let component: FolderfilecardComponent;
  let fixture: ComponentFixture<FolderfilecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderfilecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderfilecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
