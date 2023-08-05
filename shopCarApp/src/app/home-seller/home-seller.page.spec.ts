import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSellerPage } from './home-seller.page';

describe('HomeSellerPage', () => {
  let component: HomeSellerPage;
  let fixture: ComponentFixture<HomeSellerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
