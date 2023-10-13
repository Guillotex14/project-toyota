import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { GraphicsAdminPage } from './graphics-admin.page';

describe('GraphicsAdminPage', () => {
  let component: GraphicsAdminPage;
  let fixture: ComponentFixture<GraphicsAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GraphicsAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
