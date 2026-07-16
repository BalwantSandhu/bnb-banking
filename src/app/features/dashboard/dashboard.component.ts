import { Component, signal } from '@angular/core';
import { AccountService } from '../../core/services/account.service';

const VISIBLE_LIMIT = 6;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  accounts;
  totalBalance;
  accountCount;
  showAll = signal(false);

  constructor(private accountService: AccountService){
    this.accounts = this.accountService.accounts;
    this.totalBalance = this.accountService.totalBalance;
    this.accountCount = this.accountService.accountCount;
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if(hour < 18) return 'Good afternoon';
    return 'Good evening;'
  }

  // First N accounts, shown as cards
  get visibleAccounts() {
    return this.accounts().slice(0, VISIBLE_LIMIT);
  }

  // Anything beyond N, shown in the compact list once expanded
  get overflowAccounts() {
    return this.accounts().slice(VISIBLE_LIMIT);
  }

  get hasOverflow(): boolean {
    return this.accounts().length > VISIBLE_LIMIT;
  }

  toggleShowAll(): void {
    this.showAll.set(!this.showAll());
  }
}
