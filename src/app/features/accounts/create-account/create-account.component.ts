import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-create-account',
  standalone: false,
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  accountForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router : Router
  ){
    this.accountForm = this.fb.group({
      name: ['', 
        [
          Validators.required,
          Validators.minLength(2), Validators.maxLength(30)
        ]
      ],
      type: ['chequing' as AccountType, Validators.required],
      initialBalance: [0, 
        [
          Validators.required,
          Validators.min(0)
        ]
      ]
    });
  }

  get name() { return this.accountForm.get('name'); }
  get type() { return this.accountForm.get('type'); }
  get initialBalance() { return this.accountForm.get('initialBalance'); }

  get selectedType(): AccountType{
    return this.accountForm.get('type')?.value;
  }

  onSubmit(): void {

    this.submitted = true;

    if(this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const { name, type, initialBalance } = this.accountForm.value;
    const newAccount = this.accountService.createAccount(name, type, initialBalance);

    this.router.navigate(['/dashboard']);
  }
}
