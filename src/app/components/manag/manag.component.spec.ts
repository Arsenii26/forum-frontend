import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagComponent } from './manag.component';

describe('ManagComponent', () => {
  let component: ManagComponent;
  let fixture: ComponentFixture<ManagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
