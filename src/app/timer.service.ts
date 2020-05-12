import { Block } from './definitions/config-data.d';
import { StoreService } from './store.service';
import { Observable, interval, EMPTY, NEVER, timer, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap, map, takeUntil, tap, takeWhile, repeatWhen } from 'rxjs/operators';
import * as moment from 'moment';
import { TimerStatus } from './definitions/config-data';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  public timer$: Observable<any>;
  public timerStart$: Observable<moment.Moment>;
  public status$: Observable<TimerStatus>;

  private totalDuration: number;
  private startTime: moment.Moment;
  private timerSubject: BehaviorSubject<boolean>;
  private statusSubject: BehaviorSubject<TimerStatus>;
  private startTimeSubject: BehaviorSubject<moment.Moment>;
  private lastDurationCounter = 0;
  private lastDuration = 0;
  private blocks: Block[];
  private forceLastDuration: boolean;
  private readonly INTERVAL = 100;
  private readonly INTERVAL_RATIO = 1000 / this.INTERVAL;
  constructor(private storeService: StoreService) {

    this.storeService.runningSettings$.subscribe(({ totalDuration }) => {
      this.totalDuration = totalDuration;
    });


    this.status$ = this.statusSubject = new BehaviorSubject<TimerStatus>(TimerStatus.STOPPED);
    this.timerSubject = new BehaviorSubject<boolean>(false);
    this.startTimeSubject = new BehaviorSubject<moment.Moment>(null);
    this.timerStart$ = this.startTimeSubject;
    this.setTimer();
  }
  public play(blocks: Block[]) {
    this.blocks = blocks;
    if (!this.startTime) {
      this.startTime = moment();
      this.lastDuration = 0;
      this.startTimeSubject.next(this.startTime);
    }
    this.timerSubject.next(true);
    this.setTimer();
  }
  public pause() {
    this.lastDurationCounter = this.lastDuration;
    this.timerSubject.next(false);
    this.statusSubject.next(TimerStatus.PAUSED);
  }

  public stop() {
    this.lastDurationCounter = this.lastDuration = 0;
    this.timerSubject.next(false);
    this.startTime = null;
    this.statusSubject.next(TimerStatus.STOPPED);
    this.startTimeSubject.next(null);
  }

  public moveTo(position: number) {
    if (this.statusSubject.value !== TimerStatus.STOPPED) {
      this.lastDurationCounter = position;
      this.forceLastDuration = true;
    }
  }

  private setTimer() {
    if (this.timerSubject.closed) {
      this.timerSubject = new BehaviorSubject(true);
    }
    this.timer$ = this.timerSubject.pipe(
      switchMap((value) => value && this.startTime ? timer(0, this.INTERVAL) : NEVER),
      tap((d) => {
        if (this.forceLastDuration) {
          this.lastDurationCounter -= d / this.INTERVAL_RATIO;
          this.forceLastDuration = false;
        }
      }),
      map((d) => this.lastDurationCounter + (d / this.INTERVAL_RATIO)),
      tap((lastDuration) => this.lastDuration = lastDuration),
      tap((duration) => {
        if (duration > this.totalDuration) {
          this.timerSubject.next(false);
          this.statusSubject.next(TimerStatus.STOPPED);
        } else {
          this.statusSubject.next(TimerStatus.RUNNING);
        }
      }),
      map((progress) => {
        const currentIndex = this.blocks.findIndex((acc) => acc.start <= progress && acc.end > progress, 0);
        const currentDuration = this.blocks.reduce((acc, current, index) => {
          return index < currentIndex ? (acc += current.value) : acc;
        }, 0);
        const currentBlock = this.blocks[currentIndex];
        const startTime = this.startTime;
        const currentStatus = this.statusSubject.value;
        return {
          currentIndex,
          currentDuration,
          currentBlock,
          currentStatus,
          progress,
          startTime
        };
      })
    );
  }
}
