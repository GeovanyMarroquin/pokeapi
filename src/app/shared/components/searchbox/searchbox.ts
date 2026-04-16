import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-searchbox',
  imports: [],
  templateUrl: './searchbox.html',
  styleUrls: ['./searchbox.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Searchbox implements OnInit, OnDestroy {
  placeholder = input('Buscar...');
  initialValue = input('');
  debounceTime = input(500);
  onValue = output<string>();
  onDebounce = output<string>();

  private debouncer = new Subject<string>();
  private debouncerSubscription?: Subscription;

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
      .pipe(debounceTime(this.debounceTime()))
      .subscribe((value) => {
        this.onDebounce.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe();
  }

  emitValue(term: string): void {
    this.onValue.emit(term);
  }

  onKeyPress(term: string): void {
    this.debouncer.next(term);
  }
}
