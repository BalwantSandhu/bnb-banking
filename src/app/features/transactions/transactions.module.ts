import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransferFundsComponent } from './transfer-funds/transfer-funds.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TransferFundsComponent,
    TransactionHistoryComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TransactionsModule { }
