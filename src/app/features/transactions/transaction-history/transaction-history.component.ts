import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Transaction } from '../../../core/models/transaction.model';

type FilterOption = 'all' | 'in' | 'out';

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {
  accounts;
  selectedAccountId = signal<string>(''); // '' means "All Accounts"
  searchTerm = '';
  activeFilter = signal<FilterOption>('all');

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.accounts = this.accountService.accounts;

    // If navigated here with a route param, pre-select that account —
    // otherwise default stays '' (All Accounts)
    const routeId = this.route.snapshot.paramMap.get('accountId');
    if (routeId) {
      this.selectedAccountId.set(routeId);
    }
  }

  onAccountChange(id: string): void {
    this.selectedAccountId.set(id);
  }

  setFilter(filter: FilterOption): void {
    this.activeFilter.set(filter);
  }

  // Base list: either one account's transactions, or every transaction
  // across all accounts, newest first either way.
  private baseTransactions = computed<Transaction[]>(() => {
    const id = this.selectedAccountId();
    const all = this.accountService.transactions();

    const list = id ? all.filter(t => t.accountId === id) : all;

    return list.slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  private typeFiltered(): Transaction[] {
    const list = this.baseTransactions();
    const filter = this.activeFilter();
    if (filter === 'all') return list;
    if (filter === 'in') return list.filter(tx => tx.type === 'deposit' || tx.type === 'transfer-in');
    return list.filter(tx => tx.type === 'transfer-out');
  }

  get filteredTransactions(): Transaction[] {
    const term = this.searchTerm.trim().toLowerCase();
    const list = this.typeFiltered();
    if (!term) return list;

    return list.filter(tx => {
      const descMatch = tx.description.toLowerCase().includes(term);
      const amountMatch = tx.amount.toFixed(2).includes(term) || tx.amount.toString().includes(term);
      const accountMatch = this.getAccountName(tx.accountId).toLowerCase().includes(term);
      return descMatch || amountMatch || accountMatch;
    });
  }

  get totalCount(): number {
    return this.baseTransactions().length;
  }

  getAccountName(id: string): string {
    return this.accountService.getAccountById(id)?.name ?? 'Unknown';
  }
}