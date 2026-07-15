import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { sufficientBalanceValidator } from '../../../shared/validators/sufficient-balance.validator';

@Component({
  selector: 'app-transfer-funds',
  standalone: false,
  templateUrl: './transfer-funds.component.html',
  styleUrl: './transfer-funds.component.scss'
})
export class TransferFundsComponent {
  transferForm: FormGroup;
  submitted = false;
  resultMessage = signal<string | null>(null);
  resultSuccess = signal<boolean>(false);
  accounts;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ){

    this.accounts = this.accountService.accounts; //signal, whcih reads directly in template

    this.transferForm = this.fb.group(
      {
        fromAccountId: ['', Validators.required],
        toAccountId: ['', Validators.required],
        amount: [null, [Validators.required, Validators.min(0.01)]]
      },
      {
        validators: sufficientBalanceValidator(() => this.accountService.accounts())
      }
    );
  }

  get fromAccountId() { return this.transferForm.get('fromAccountId'); }
  get toAccountId() { return this.transferForm.get('toAccountId'); }
  get amount() { return this.transferForm.get('amount'); }

   // Computed signal: available balance of whichever account is currently selected as "from"
   selectedFromBalance = computed(() => {
    const id = this.transferForm?.get('fromAccountId')?.value;
    return this.accountService.getAccountById(id)?.balance ?? null;
  });

  onSubmit(): void{
    this.submitted = true;
    this.resultMessage.set(null);

    if(this.transferForm.invalid){
      this.transferForm.markAllAsTouched();
      return;
    }

    const { fromAccountId, toAccountId, amount } = this.transferForm.value;
    const result = this.accountService.transferFunds(fromAccountId, toAccountId, amount);

    this.resultSuccess.set(result.success);
    this.resultMessage.set(result.message);

    if(result.success){
      this.transferForm.reset({ fromAccountId: '', toAccountId: '', amount: null });
      this.submitted = false;
    }
  }
}
