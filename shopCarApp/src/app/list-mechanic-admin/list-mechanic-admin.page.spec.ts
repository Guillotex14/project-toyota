import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMechanicAdminPage } from './list-mechanic-admin.page';

describe('ListMechanicAdminPage', () => {
  let component: ListMechanicAdminPage;
  let fixture: ComponentFixture<ListMechanicAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListMechanicAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
