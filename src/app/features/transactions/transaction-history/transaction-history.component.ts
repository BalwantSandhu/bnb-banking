import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Transaction } from '../../../core/models/transaction.model';

type FilterOption = 'all' | 'in' | 'out';
const PAGE_SIZE = 10;

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {
  accounts;
  selectedAccountId = signal<string>('');
  searchTerm = '';
  activeFilter = signal<FilterOption>('all');
  visibleCount = signal<number>(PAGE_SIZE);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');


  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.accounts = this.accountService.accounts;

    const routeId = this.route.snapshot.paramMap.get('accountId');
    if (routeId) {
      this.selectedAccountId.set(routeId);
    }
  }

  onAccountChange(id: string): void {
    this.selectedAccountId.set(id);
    this.visibleCount.set(PAGE_SIZE); // reset pagination whenever the filter context changes
  }

  setFilter(filter: FilterOption): void {
    this.activeFilter.set(filter);
    this.visibleCount.set(PAGE_SIZE);
  }

  onSearchChange(): void {
    this.visibleCount.set(PAGE_SIZE);
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.visibleCount.set(PAGE_SIZE);
  }
  
  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.visibleCount.set(PAGE_SIZE);
  }
  
  clearDateFilter(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.visibleCount.set(PAGE_SIZE);
  }

  loadMore(): void {
    this.visibleCount.set(this.visibleCount() + PAGE_SIZE);
  }

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

  get allFilteredTransactions(): Transaction[] {
    const term = this.searchTerm.trim().toLowerCase();
    let list = this.typeFiltered();
  
    const from = this.dateFrom();
    const to = this.dateTo();
    if (from) {
      const fromDate = new Date(from);
      list = list.filter(tx => tx.timestamp >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      list = list.filter(tx => tx.timestamp <= toDate);
    }
  
    if (!term) return list;
  
    return list.filter(tx => {
      const descMatch = tx.description.toLowerCase().includes(term);
      const amountMatch = tx.amount.toFixed(2).includes(term) || tx.amount.toString().includes(term);
      const accountMatch = this.getAccountName(tx.accountId).toLowerCase().includes(term);
      return descMatch || amountMatch || accountMatch;
    });
  }

  get filteredTransactions(): Transaction[] {
    return this.allFilteredTransactions.slice(0, this.visibleCount());
  }

  get hasMore(): boolean {
    return this.allFilteredTransactions.length > this.visibleCount();
  }

  get totalCount(): number {
    return this.baseTransactions().length;
  }

  getAccountName(id: string): string {
    return this.accountService.getAccountById(id)?.name ?? 'Unknown';
  }
}