import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  standalone: false,
  templateUrl: './loading-modal.component.html',
  styleUrl: './loading-modal.component.scss'
})
export class LoadingModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Success!';
  @Input() message: string = '';
  @Input() countdown: number = 3;
  @Input() showCountdown: boolean = true;
  @Input() showGoNowButton: boolean = true;
  @Input() icon: 'spinner' | 'success' | 'none' = 'success';

  @Output() goNowClick = new EventEmitter<void>();

  onGoNowClick(): void {
    this.goNowClick.emit();
  }
}