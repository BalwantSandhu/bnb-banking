import { Component, computed, signal, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { sufficientBalanceValidator } from '../../../shared/validators/sufficient-balance.validator';
import { sameAccountValidator } from '../../../shared/validators/same-account.validator';

interface TransferSummary {
  fromName: string;
  toName: string;
  amount: number;
  note: string;
  timestamp: Date;
}

@Component({
  selector: 'app-transfer-funds',
  standalone: false,
  templateUrl: './transfer-funds.component.html',
  styleUrl: './transfer-funds.component.scss'
})
export class TransferFundsComponent implements OnDestroy {
  transferForm: FormGroup;
  submitted = false;
  resultMessage = signal<string | null>(null);
  resultSuccess = signal<boolean>(false);
  lastTransfer = signal<TransferSummary | null>(null);
  accounts;

  showModal = false;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accounts = this.accountService.accounts;

    this.transferForm = this.fb.group(
      {
        fromAccountId: ['', Validators.required],
        toAccountId: ['', Validators.required],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        note: ['', Validators.maxLength(100)]
      },
      {
        validators: [
          sameAccountValidator(),
          sufficientBalanceValidator(() => this.accountService.accounts())
        ]
      }
    );
  }

  get fromAccountId() { return this.transferForm.get('fromAccountId'); }
  get toAccountId() { return this.transferForm.get('toAccountId'); }
  get amount() { return this.transferForm.get('amount'); }
  get note() { return this.transferForm.get('note'); }

  selectedFromBalance() : number | null {
    const id = this.transferForm?.get('fromAccountId')?.value;
    return this.accountService.getAccountById(id)?.balance ?? null;
  };

  availableToAccounts() {
    const fromId = this.transferForm.get('fromAccountId')?.value;
    return this.accounts().filter(acc => acc.id !== fromId);
  }

  onFromAccountChange(): void {
    const fromId = this.transferForm.get('fromAccountId')?.value;
    const toId = this.transferForm.get('toAccountId')?.value;
    if (fromId && toId && fromId === toId) {
      this.transferForm.get('toAccountId')?.setValue('');
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.resultMessage.set(null);

    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const { fromAccountId, toAccountId, amount, note } = this.transferForm.value;
    const fromAccount = this.accountService.getAccountById(fromAccountId);
    const toAccount = this.accountService.getAccountById(toAccountId);

    const result = this.accountService.transferFunds(fromAccountId, toAccountId, amount, note);

    this.resultSuccess.set(result.success);
    this.resultMessage.set(result.message);

    if (result.success) {
      this.lastTransfer.set({
        fromName: fromAccount?.name ?? '',
        toName: toAccount?.name ?? '',
        amount,
        note: note?.trim() || '',
        timestamp: new Date()
      });

      this.transferForm.reset({ fromAccountId: '', toAccountId: '', amount: null, note: '' });
      this.submitted = false;
      this.showModal = true;
    }
  }

  get hasEnoughAccounts(): boolean {
    return this.accounts().length >= 2;
  }

  closeModal(): void {
    this.showModal = false;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}