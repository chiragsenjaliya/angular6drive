import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLoaderDialogComponent } from './process-loader-dialog.component';

describe('ProcessLoaderDialogComponent', () => {
  let component: ProcessLoaderDialogComponent;
  let fixture: ComponentFixture<ProcessLoaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessLoaderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLoaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
