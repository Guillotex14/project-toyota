import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAdminConcesionaryPage } from './list-admin-concesionary.page';

describe('ListAdminConcesionaryPage', () => {
  let component: ListAdminConcesionaryPage;
  let fixture: ComponentFixture<ListAdminConcesionaryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListAdminConcesionaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
