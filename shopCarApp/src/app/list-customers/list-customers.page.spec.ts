import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCustomersPage } from './list-customers.page';

describe('ListCustomersPage', () => {
  let component: ListCustomersPage;
  let fixture: ComponentFixture<ListCustomersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListCustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
