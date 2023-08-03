import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicalFilePage } from './mechanical-file.page';

describe('MechanicalFilePage', () => {
  let component: MechanicalFilePage;
  let fixture: ComponentFixture<MechanicalFilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MechanicalFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
