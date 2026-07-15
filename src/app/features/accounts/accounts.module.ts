import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AccountsRoutingModule } from './accounts-routing.module';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CreateAccountComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AccountsModule { }
