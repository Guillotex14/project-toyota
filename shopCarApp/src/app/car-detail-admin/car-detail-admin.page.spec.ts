import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarDetailAdminPage } from './car-detail-admin.page';

describe('CarDetailAdminPage', () => {
  let component: CarDetailAdminPage;
  let fixture: ComponentFixture<CarDetailAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CarDetailAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
