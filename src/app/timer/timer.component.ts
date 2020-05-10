import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Block } from '../definitions/config-data';
import { Observable } from 'rxjs/internal/Observable';
import { interval, Subject } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnChanges {

  @Input() public startTime: moment.Moment;
  @Input() public progress: number;
  @Input() public warningTimer: number;
  @Input() public block: Block;
  @Input() public volume: number;

  @ViewChild('audio', { static: true }) public audio: ElementRef<HTMLAudioElement>;

  private play$ = new Subject();

  @HostBinding('attr.class')
  get backgroundClasses() {
    const isWarning = this.currentProgress < this.warningTimer && (this.block?.type === 'duration');
    return [
      this.block?.type,
      isWarning ? 'warning' : ''
    ].filter(Boolean).join(' ');
  }

  public currentProgress = 0;
  public timer$: Observable<number>;
  constructor(private cdr: ChangeDetectorRef) { }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.progress && changes.progress.currentValue !== undefined && this.block) {
      this.currentProgress = this.block.value - this.progress;
      if (
        this.block.type === 'duration' &&
        (this.currentProgress === this.block.value / 2 || // mid duration
          this.currentProgress === this.warningTimer || // start ending time
          this.currentProgress === 3 || // start ending time
          this.currentProgress < 0.1 || // starting
          this.currentProgress === this.block.value) // starting
      ) {
        this.playAudio();
      }
    }

    if (changes.startTime && changes.startTime.currentValue) {
      this.timer$ = interval(500).
        pipe(
          map(() => moment().diff(moment(this.startTime), 'seconds')),
          tap(() => this.cdr.markForCheck())
        );
    }
  }
  public ngOnInit(): void {
    this.audio.nativeElement.volume = this.volume;

    this.play$
      .pipe(
        debounceTime(200),
        tap(() => this.audio.nativeElement.play())
      )
      .subscribe();
  }

  public getDiffTime(time: moment.Moment) {
    this.cdr.markForCheck();
    return moment().diff(moment(time), 'seconds');
  }

  private playAudio() {
    this.play$.next();
  }

}
