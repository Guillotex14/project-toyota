import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdminConcesionaryPage } from './add-admin-concesionary.page';

describe('AddAdminConcesionaryPage', () => {
  let component: AddAdminConcesionaryPage;
  let fixture: ComponentFixture<AddAdminConcesionaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAdminConcesionaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
