import { Block, Execution } from './definitions/config-data.d';
import { StoreService } from './store.service';
import { Observable, interval, EMPTY, NEVER, timer, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap, map, takeUntil, tap, takeWhile, repeatWhen, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { TimerStatus } from './definitions/config-data';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  public timer$: Observable<any>;
  public timerStart$: Observable<moment.Moment[]>;
  public status$: Observable<TimerStatus>;

  private totalDuration: number;
  private startTime: moment.Moment;
  private timerSubject: BehaviorSubject<boolean>;
  private statusSubject: BehaviorSubject<TimerStatus>;
  private durationTimeSubject: BehaviorSubject<moment.Moment[]>;
  private lastDurationCounter = 0;
  private lastDuration = 0;
  private blocks: Block[];
  private forceLastDuration: boolean;
  private readonly INTERVAL = 100;
  private readonly INTERVAL_RATIO = 1000 / this.INTERVAL;
  private currentExecution: Execution;
  constructor(private storeService: StoreService) {

    this.storeService.runningSettings$
      .pipe(
        map(({ totalDuration, blocks }) => ({ totalDuration, blocks })),
        distinctUntilChanged()
      )
      .subscribe(({ totalDuration, blocks }) => {
        this.totalDuration = totalDuration;
        this.blocks = blocks;
      });


    this.status$ = this.statusSubject = new BehaviorSubject<TimerStatus>(TimerStatus.STOPPED);
    this.timerSubject = new BehaviorSubject<boolean>(false);
    this.durationTimeSubject = new BehaviorSubject<moment.Moment[]>([]);
    this.timerStart$ = this.durationTimeSubject;
    this.setTimer();
  }
  public play(blocks: Block[]) {
    this.blocks = blocks;
    if (this.statusSubject.value === TimerStatus.STOPPED) {
      this.startTime = moment();
      this.lastDuration = 0;
      this.durationTimeSubject.next([this.startTime, undefined]);
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
    this.statusSubject.next(TimerStatus.STOPPED);
    const finishTime = moment();
    this.durationTimeSubject.next([this.startTime, finishTime]);
    this.storeService.pushExecution({ ...this.currentExecution, finishTime });
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
      map((progress) => {
        let currentDuration = 0;
        let currentBlock = null;
        const currentIndex = this.blocks.findIndex((acc) => acc.start <= progress && acc.end > progress, 0);
        if (currentIndex >= 0) {
          currentDuration = this.blocks[currentIndex].end - progress;
          currentBlock = this.statusSubject.value !== TimerStatus.STOPPED ? this.blocks[currentIndex] : null;
        }
        const startTime = this.startTime;
        const currentStatus = this.statusSubject.value;
        return {
          currentIndex,
          currentDuration,
          currentBlock,
          currentStatus,
          progress,
          startTime,
          finishTime: null
        } as Execution;
      }),
      tap((execution) => this.currentExecution = execution),
      tap(({ progress }) => {
        if (progress >= this.totalDuration) {
          this.stop();
        } else {
          this.statusSubject.next(TimerStatus.RUNNING);
        }
      }),
      takeWhile(({ progress }) => progress <= this.totalDuration, true)
    );
  }
}
