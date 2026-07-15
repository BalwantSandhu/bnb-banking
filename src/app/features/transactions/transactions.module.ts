import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransferFundsComponent } from './transfer-funds/transfer-funds.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { SharedModule } from '../../shared/shared.module';
import { TransactionTypePipe } from '../../shared/pipes/transaction-type.pipe';


@NgModule({
  declarations: [
    TransferFundsComponent,
    TransactionHistoryComponent,
    TransactionTypePipe
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class TransactionsModule { }
