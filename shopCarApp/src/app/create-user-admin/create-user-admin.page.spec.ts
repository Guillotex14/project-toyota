import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserAdminPage } from './create-user-admin.page';

describe('CreateUserAdminPage', () => {
  let component: CreateUserAdminPage;
  let fixture: ComponentFixture<CreateUserAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateUserAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
