import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOffertsPage } from './my-offerts.page';

describe('MyOffertsPage', () => {
  let component: MyOffertsPage;
  let fixture: ComponentFixture<MyOffertsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyOffertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
