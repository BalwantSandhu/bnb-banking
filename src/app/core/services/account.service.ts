import { computed, Injectable, signal } from '@angular/core';
import { Account, AccountType } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }
  // Private writable signals, state only lives here nowhere else
  private accountsSignal = signal<Account[]>([]);
  private transactionsSignal = signal<Transaction[]>([]);

  // Public read-only views — components can read but never mutate directly
  accounts = this.accountsSignal.asReadonly();
  transactions = this.transactionsSignal.asReadonly();

  //Derived state - recalculates automatically whenever accountSignal changes
  totalBalance = computed(() => 
    this.accountsSignal().reduce((sum,acc) => sum + acc.balance, 0)
  );

  accountCount = computed(() => this.accountsSignal().length);

  createAccount(name: string, type: AccountType, initialBalance: number): Account{
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name,
      type,
      balance: initialBalance,
      createdAt: new Date()
    };

    this.accountsSignal.update(accounts => [...accounts, newAccount]);
    
    if(initialBalance > 0){
      this.recordTransaction(newAccount.id, 'deposit', initialBalance, initialBalance, 'Initial Deposit');
    }

    return newAccount;
  }

  getAccountById(id: string): Account | undefined{
    return this.accountsSignal().find(acc => acc.id === id);
  }

  transferFunds(fromId: string, toId: string, amount: number): {success: boolean; message: string} {
    const from = this.getAccountById(fromId);
    const to = this.getAccountById(toId);

    if (!from || !to) {
      return { success: false, message: 'Account not found.' };
    }
    if (fromId === toId) {
      return { success: false, message: 'Cannot transfer to the same account.' };
    }
    if (amount <= 0) {
      return { success: false, message: 'Transfer amount must be greater than zero.' };
    }
    if (amount > from.balance) {
      return { success: false, message: 'Insufficient funds.' };
    }

    this.accountsSignal.update(accounts => 
      accounts.map(acc => {
        if(acc.id === fromId) return {...acc, balance: acc.balance - amount};
        if(acc.id === toId) return {... acc, balance: acc.balance + amount};
        return acc;
      })
    );

    const updatedFrom = this.getAccountById(fromId)!;
    const updatedTo = this.getAccountById(toId)!;

    this.recordTransaction(fromId, 'transfer-out', amount, updatedFrom.balance, `Transfer to ${to.name}`);
    this.recordTransaction(toId, 'transfer-in', amount, updatedTo.balance, `Transfer from ${from.name}`);

    return { success: true, message: 'Transfer successful.'};
  }

  getTransactionForAccount(accountId: string): Transaction[] {
    return this.transactionsSignal().filter(t => t.accountId === accountId);
  }

  private recordTransaction(
    accountId: string,
    type: Transaction['type'],
    amount: number,
    balanceAfter: number,
    description: string
  ): void {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      accountId,
      type,
      amount,
      balanceAfter,
      description,
      timestamp: new Date()
    };
    this.transactionsSignal.update(txs => [...txs, tx]);
  }
}
