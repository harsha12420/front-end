import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsManagementComponent } from './rights-management.component';

describe('RightsManagementComponent', () => {
  let component: RightsManagementComponent;
  let fixture: ComponentFixture<RightsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightsManagementComponent]
    });
    fixture = TestBed.createComponent(RightsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
