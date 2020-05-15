import { StoreService } from './../store.service';
import { Configuration, TimerStatus, Block } from './../definitions/config-data.d';
import { Component, OnInit } from '@angular/core';
import { Observable, timer, interval, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TimerService } from '../timer.service';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public configuration$: Observable<Configuration>;
  public runningSettings$: Observable<Configuration>;
  public timerStatus$: Observable<TimerStatus>;
  public startTimeStatus$: Observable<moment.Moment[]>;

  public progress$: Observable<any>;
  public totalDuration: number;
  public duration: number;
  constructor(private store: StoreService, private timerService: TimerService) { }

  public ngOnInit(): void {
    this.configuration$ = this.store.configuration$;
    this.runningSettings$ = this.store.runningSettings$;

    this.progress$ = this.timerService.timer$;
    this.timerStatus$ = this.timerService.status$;
    this.startTimeStatus$ = this.timerService.timerStart$;
  }

  public play(blocks: Block[]) {
    this.timerService.play(blocks);
  }

  public pause() {
    this.timerService.pause();
  }

  public stop() {
    this.timerService.stop();
  }

  public selectGraph(block: Block) {
    this.timerService.moveTo(block.start);
  }
  public moveTo(blocks: Block[], position: number) {

  }

  public updateVolupe(volume: number, settings: Configuration) {
    this.store.save({ ...settings, volume } as Configuration);
  }
}




