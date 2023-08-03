import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddModelVehiclePage } from './add-model-vehicle.page';

describe('AddModelVehiclePage', () => {
  let component: AddModelVehiclePage;
  let fixture: ComponentFixture<AddModelVehiclePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddModelVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
