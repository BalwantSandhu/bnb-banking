import { Component } from '@angular/core';
import { AccountService } from '../../core/services/account.service';

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
}
