import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../../core/models/transaction.model';

/**
 * Transforms raw transaction type codes into human-readable labels
 * with a directional sign, e.g. 'transfer-out' -> '− Transfer Out'
 */
@Pipe({
  name: 'transactionType',
  standalone: false
})
export class TransactionTypePipe implements PipeTransform {
  transform(type: TransactionType): string {
    switch (type) {
      case 'deposit':
        return '+ Deposit';
      case 'transfer-in':
        return '+ Transfer In';
      case 'transfer-out':
        return '− Transfer Out';
      default:
        return type;
    }
  }
}