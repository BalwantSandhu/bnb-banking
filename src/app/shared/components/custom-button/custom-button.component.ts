import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountType } from '../../../core/models/account.model';

@Component({
  selector: 'app-custom-button',
  standalone: false,
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  @Input() label: string = 'Submit';
  @Input() accountType: AccountType | null = null;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Output() clicked = new EventEmitter<void>();

  onClick(): void{
    if (!this.disabled){
      this.clicked.emit();
    }
  }
}
