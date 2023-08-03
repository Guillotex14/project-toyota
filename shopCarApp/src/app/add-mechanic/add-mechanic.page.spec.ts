import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMechanicPage } from './add-mechanic.page';

describe('AddMechanicPage', () => {
  let component: AddMechanicPage;
  let fixture: ComponentFixture<AddMechanicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddMechanicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
