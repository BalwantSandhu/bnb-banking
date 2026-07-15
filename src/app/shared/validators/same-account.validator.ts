import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom cross-field validator.
 * Ensures fromAccountId and toAccountId aren't the same account.
 * Applied at the FormGroup level since it needs both fields together.
 */
export function sameAccountValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromAccountId = group.get('fromAccountId')?.value;
    const toAccountId = group.get('toAccountId')?.value;

    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      return { sameAccount: true };
    }

    return null;
  };
}