import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnDestroy {
  accountForm: FormGroup;
  submitted = false;

  showModal = false;
  modalCountdown = 3;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      type: ['chequing' as AccountType, Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get name() { return this.accountForm.get('name'); }
  get type() { return this.accountForm.get('type'); }
  get initialBalance() { return this.accountForm.get('initialBalance'); }

  get selectedType(): AccountType {
    return this.accountForm.get('type')?.value;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const { name, type, initialBalance } = this.accountForm.value;
    this.accountService.createAccount(name, type, initialBalance);

    this.startRedirectCountdown();
  }

  private startRedirectCountdown(): void {
    this.showModal = true;
    this.modalCountdown = 3;

    this.countdownInterval = setInterval(() => {
      this.modalCountdown--;
      if (this.modalCountdown <= 0) {
        this.goToDashboard();
      }
    }, 1000);
  }

  goToDashboard(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.showModal = false;
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}