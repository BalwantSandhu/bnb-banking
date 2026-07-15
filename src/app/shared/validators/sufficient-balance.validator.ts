import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account } from '../../core/models/account.model';

export function sufficientBalanceValidator(getAccounts: () => Account[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromAccountId = group.get('fromAccountId')?.value;
    const amount = group.get('amount')?.value;

    if (!fromAccountId || amount === null || amount === undefined || amount <= 0) {
      return null; // this case will be handled by required or min validator seperately
    }

    const account = getAccounts().find(acc => acc.id === fromAccountId);
    if (!account) {
      return null;
    }

    if (amount > account.balance) {
      return { insufficientBalance: { available: account.balance, requested: amount } };
    }

    return null;
  };
}