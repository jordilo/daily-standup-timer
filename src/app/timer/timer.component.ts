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

  @Input() public startTime: moment.Moment[];
  @Input() public remainingBlockTime: number;
  @Input() public warningTimer: number;
  @Input() public block: Block;
  @Input() public volume: number;

  @ViewChild('audio', { static: true }) public audio: ElementRef<HTMLAudioElement>;

  private play$ = new Subject();

  @HostBinding('attr.class')
  get backgroundClasses() {
    const isWarning = this.remainingBlockTime < this.warningTimer && (this.block?.type === 'duration');
    return [
      this.block?.type,
      isWarning ? 'warning' : ''
    ].filter(Boolean).join(' ');
  }

  public timer$: Observable<number>;
  constructor(private cdr: ChangeDetectorRef) { }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.remainingBlockTime && changes.remainingBlockTime.currentValue !== undefined && this.block) {
      if (this.block.type === 'duration') {

        if (this.remainingBlockTime === this.block.value / 2) {
          this.audio.nativeElement.volume = this.volume / 2;
          this.playAudio();
        } else if (this.remainingBlockTime === this.warningTimer || this.remainingBlockTime < 0.15) {
          this.audio.nativeElement.volume = this.volume;
          this.playAudio();
        }
      }
    }

    if (changes.startTime && changes.startTime.currentValue) {
      this.timer$ = interval(500).
        pipe(
          map(() => (this.startTime[1] || moment()).diff(moment(this.startTime[0]), 'seconds')),
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
