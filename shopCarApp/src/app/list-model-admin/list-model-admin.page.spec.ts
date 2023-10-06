import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListModelAdminPage } from './list-model-admin.page';

describe('ListModelAdminPage', () => {
  let component: ListModelAdminPage;
  let fixture: ComponentFixture<ListModelAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListModelAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
