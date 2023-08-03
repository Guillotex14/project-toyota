import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUserAdminPage } from './list-user-admin.page';

describe('ListUserAdminPage', () => {
  let component: ListUserAdminPage;
  let fixture: ComponentFixture<ListUserAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListUserAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
