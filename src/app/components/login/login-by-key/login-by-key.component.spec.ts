import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByKeyComponent } from './login-by-key.component';

describe('LoginByKeyComponent', () => {
  let component: LoginByKeyComponent;
  let fixture: ComponentFixture<LoginByKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginByKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginByKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
