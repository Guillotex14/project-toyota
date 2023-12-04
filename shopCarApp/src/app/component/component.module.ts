import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton/skeleton.component';



@NgModule({
  declarations: [SkeletonComponent],
  exports: [SkeletonComponent],
  imports: [
    CommonModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComponentModule { }
