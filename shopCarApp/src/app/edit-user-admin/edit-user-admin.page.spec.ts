import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserAdminPage } from './edit-user-admin.page';

describe('EditUserAdminPage', () => {
  let component: EditUserAdminPage;
  let fixture: ComponentFixture<EditUserAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditUserAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
