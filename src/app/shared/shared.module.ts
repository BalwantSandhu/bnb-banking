import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';



@NgModule({
  declarations: [
    CustomButtonComponent,
    LoadingModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomButtonComponent,
    LoadingModalComponent
  ]
})
export class SharedModule { }
