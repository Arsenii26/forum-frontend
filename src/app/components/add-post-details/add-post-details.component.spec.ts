import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostDetailsComponent } from './add-post-details.component';

describe('AddPostDetailsComponent', () => {
  let component: AddPostDetailsComponent;
  let fixture: ComponentFixture<AddPostDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
