import { Component, signal } from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { Transaction } from '../../core/models/transaction.model';

const VISIBLE_LIMIT = 6;
const RECENT_ACTIVITY_LIMIT = 5;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  accounts;
  totalBalance;
  totalChequing;
  totalSavings;
  accountCount;
  showAll = signal(false);

  constructor(private accountService: AccountService) {
    this.accounts = this.accountService.accounts;
    this.totalBalance = this.accountService.totalBalance;
    this.totalChequing = this.accountService.totalChequing;
    this.totalSavings = this.accountService.totalSavings;
    this.accountCount = this.accountService.accountCount;
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  get visibleAccounts() {
    return this.accounts().slice(0, VISIBLE_LIMIT);
  }

  get overflowAccounts() {
    return this.accounts().slice(VISIBLE_LIMIT);
  }

  get hasOverflow(): boolean {
    return this.accounts().length > VISIBLE_LIMIT;
  }

  toggleShowAll(): void {
    this.showAll.set(!this.showAll());
  }

  // Last N transactions across every account, newest first
  get recentActivity(): Transaction[] {
    return this.accountService
      .transactions()
      .slice()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, RECENT_ACTIVITY_LIMIT);
  }

  getAccountName(id: string): string {
    return this.accountService.getAccountById(id)?.name ?? 'Unknown';
  }
}