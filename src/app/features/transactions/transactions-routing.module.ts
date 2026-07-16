import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferFundsComponent } from './transfer-funds/transfer-funds.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

const routes: Routes = [
  { 
    path: 'transfer', component: TransferFundsComponent
  },
  {
    path: 'history', component: TransactionHistoryComponent
  },
  {
    path: 'history/:accountId', component: TransactionHistoryComponent
  },
  {
    path: '', redirectTo: 'transfer', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
