import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivetreeComponent } from './drivetree.component';

describe('DrivetreeComponent', () => {
  let component: DrivetreeComponent;
  let fixture: ComponentFixture<DrivetreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivetreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivetreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
