import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotManagementComponent } from './iot-management.component';

describe('IotManagementComponent', () => {
  let component: IotManagementComponent;
  let fixture: ComponentFixture<IotManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IotManagementComponent]
    });
    fixture = TestBed.createComponent(IotManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
