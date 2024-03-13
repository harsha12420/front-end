import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxTrimDirectiveModule
  ],
  exports: [
    NgxTrimDirectiveModule
  ]
})
export class SharedModule { }
