import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Block, TimerStatus } from '../definitions/config-data';
import { Observable } from 'rxjs/internal/Observable';
import { interval, BehaviorSubject, timer, NEVER } from 'rxjs';
import { takeWhile, switchMap, tap, map } from 'rxjs/operators';

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


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.progress && changes.progress.currentValue !== undefined && this.block) {
      this.currentProgress = this.block.value - this.progress;
    }

    if (changes.startTime && changes.startTime.currentValue) {
      this.timer$ = interval(500).
        pipe(
          map(() => moment().diff(moment(this.startTime), 'seconds')),
          tap(() => this.cdr.markForCheck())
        );
    }
  }
  ngOnInit(): void {
  }

  public getDiffTime(time: moment.Moment) {
    this.cdr.markForCheck();
    return moment().diff(moment(time), 'seconds');
  }

}
