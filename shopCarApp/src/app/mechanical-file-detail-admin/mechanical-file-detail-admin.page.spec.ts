import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicalFileDetailAdminPage } from './mechanical-file-detail-admin.page';

describe('MechanicalFileDetailAdminPage', () => {
  let component: MechanicalFileDetailAdminPage;
  let fixture: ComponentFixture<MechanicalFileDetailAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MechanicalFileDetailAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
