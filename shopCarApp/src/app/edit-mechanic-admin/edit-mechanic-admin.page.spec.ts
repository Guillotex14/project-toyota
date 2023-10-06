import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMechanicAdminPage } from './edit-mechanic-admin.page';

describe('EditMechanicAdminPage', () => {
  let component: EditMechanicAdminPage;
  let fixture: ComponentFixture<EditMechanicAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditMechanicAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
