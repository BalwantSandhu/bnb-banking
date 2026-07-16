import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';



@NgModule({
  declarations: [
    CustomButtonComponent,
    LoadingModalComponent,
    TransactionTypePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomButtonComponent,
    LoadingModalComponent,
    TransactionTypePipe
  ]
})
export class SharedModule { }
