import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarDetailMechanicPage } from './car-detail-mechanic.page';

describe('CarDetailMechanicPage', () => {
  let component: CarDetailMechanicPage;
  let fixture: ComponentFixture<CarDetailMechanicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarDetailMechanicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
