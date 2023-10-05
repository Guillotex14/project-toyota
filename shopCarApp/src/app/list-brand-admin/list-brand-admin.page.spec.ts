import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBrandAdminPage } from './list-brand-admin.page';

describe('ListBrandAdminPage', () => {
  let component: ListBrandAdminPage;
  let fixture: ComponentFixture<ListBrandAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListBrandAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
