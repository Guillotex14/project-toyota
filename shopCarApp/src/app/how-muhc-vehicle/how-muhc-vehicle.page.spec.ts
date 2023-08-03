import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowMuhcVehiclePage } from './how-muhc-vehicle.page';

describe('HowMuhcVehiclePage', () => {
  let component: HowMuhcVehiclePage;
  let fixture: ComponentFixture<HowMuhcVehiclePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HowMuhcVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
