import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMechanicFilePage } from './add-mechanic-file.page';

describe('AddMechanicFilePage', () => {
  let component: AddMechanicFilePage;
  let fixture: ComponentFixture<AddMechanicFilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddMechanicFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
