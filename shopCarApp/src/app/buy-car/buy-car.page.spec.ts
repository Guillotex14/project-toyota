import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyCarPage } from './buy-car.page';

describe('BuyCarPage', () => {
  let component: BuyCarPage;
  let fixture: ComponentFixture<BuyCarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuyCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
