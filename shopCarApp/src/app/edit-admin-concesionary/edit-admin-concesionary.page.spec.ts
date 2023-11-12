import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAdminConcesionaryPage } from './edit-admin-concesionary.page';

describe('EditAdminConcesionaryPage', () => {
  let component: EditAdminConcesionaryPage;
  let fixture: ComponentFixture<EditAdminConcesionaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditAdminConcesionaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
