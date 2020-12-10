import { FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TimerStatus } from '../definitions/config-data';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {

  @Input() public status: TimerStatus;
  @Input() public volume: number;
  @Output() public doPlay = new EventEmitter<any>();
  @Output() public doPause = new EventEmitter<any>();
  @Output() public doStop = new EventEmitter<any>();
  @Output() public doPrev = new EventEmitter<any>();
  @Output() public doNext = new EventEmitter<any>();
  @Output() public changeVolume = new EventEmitter<number>();
  @Input() public allowPause: boolean;
  public volumentControl: FormControl;
  public isVisibleVolume = false;
  private volumentSubscription: Subscription;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.volumentControl = this.fb.control(this.volume);
    this.volumentSubscription = this.volumentControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.isVisibleVolume = false;
        }))
      .subscribe((value) => this.changeVolume.emit(value));
  }

  public ngOnDestroy() {
    this.volumentSubscription.unsubscribe();
  }

  public play() {
    this.doPlay.emit();
  }
  public pause() {
    this.doPause.emit();
  }
  public stop() {
    if (confirm('Accepting this confirmation all data will be miss')) {
      this.doStop.emit();
    }
  }
  public prev() {
    this.doPrev.emit();
  }
  public next() {
    this.doNext.emit();
  }

  public toggleVolume() {
    this.isVisibleVolume = !this.isVisibleVolume;
  }

}
