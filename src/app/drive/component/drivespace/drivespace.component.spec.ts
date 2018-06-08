import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivespaceComponent } from './drivespace.component';

describe('DrivespaceComponent', () => {
  let component: DrivespaceComponent;
  let fixture: ComponentFixture<DrivespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivespaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
