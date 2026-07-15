import { computed, Injectable, signal, effect } from '@angular/core';
import { Account, AccountType } from '../models/account.model';
import { Transaction } from '../models/transaction.model';
import { StorageService } from './storage.service';

const ACCOUNTS_KEY = 'bnb_accounts';
const TRANSACTIONS_KEY = 'bnb_transactions';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSignal = signal<Account[]>([]);
  private transactionsSignal = signal<Transaction[]>([]);

  accounts = this.accountsSignal.asReadonly();
  transactions = this.transactionsSignal.asReadonly();

  totalBalance = computed(() =>
    this.accountsSignal().reduce((sum, acc) => sum + acc.balance, 0)
  );

  accountCount = computed(() => this.accountsSignal().length);

  constructor(private storage: StorageService) {
    this.loadFromStorage();

    effect(() => {
      this.storage.setItem(ACCOUNTS_KEY, this.accountsSignal());
    });

    effect(() => {
      this.storage.setItem(TRANSACTIONS_KEY, this.transactionsSignal());
    });
  }

  private loadFromStorage(): void {
    const storedAccounts = this.storage.getItem<Account[]>(ACCOUNTS_KEY);
    const storedTransactions = this.storage.getItem<Transaction[]>(TRANSACTIONS_KEY);

    if (storedAccounts) {
      const rehydrated = storedAccounts.map(acc => ({
        ...acc,
        createdAt: new Date(acc.createdAt)
      }));
      this.accountsSignal.set(rehydrated);
    }

    if (storedTransactions) {
      const rehydrated = storedTransactions.map(tx => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      }));
      this.transactionsSignal.set(rehydrated);
    }
  }

  createAccount(name: string, type: AccountType, initialBalance: number): Account {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name,
      type,
      balance: initialBalance,
      createdAt: new Date()
    };

    this.accountsSignal.update(accounts => [...accounts, newAccount]);

    if (initialBalance > 0) {
      this.recordTransaction(newAccount.id, 'deposit', initialBalance, initialBalance, 'Initial deposit');
    }

    return newAccount;
  }

  getAccountById(id: string): Account | undefined {
    return this.accountsSignal().find(acc => acc.id === id);
  }

  transferFunds(fromId: string, toId: string, amount: number): { success: boolean; message: string } {
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
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const updatedFrom = this.getAccountById(fromId)!;
    const updatedTo = this.getAccountById(toId)!;

    this.recordTransaction(fromId, 'transfer-out', amount, updatedFrom.balance, `Transfer to ${to.name}`);
    this.recordTransaction(toId, 'transfer-in', amount, updatedTo.balance, `Transfer from ${from.name}`);

    return { success: true, message: 'Transfer successful.' };
  }

  getTransactionsForAccount(accountId: string): Transaction[] {
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