import { Helper } from './helper';
import { Configuration, ExecutionData, Execution } from './definitions/config-data.d';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public get configuration$(): Observable<Configuration> {
    return this.configurationSubject;
  }
  public get runningSettings$(): Observable<any> {
    return this.runningSettingsSubject;
  }
  private readonly SAVED_DATA_KEY = 'saved-configuration';
  private readonly EXECUTIONS_DATA_KEY = 'saved-executions';
  private configurationSubject: BehaviorSubject<Configuration>;
  private savedExecutions: ExecutionData[] = [];
  private runningSettingsSubject: BehaviorSubject<any>;

  private runningSettings = {
    totalDuration: null,
    blocks: []
  };
  private configuration: Configuration = {
    restDuration: 5,
    stepDuration: 60,
    totalIterations: 5,
    warningTimer: 10,
    volume: 1
  };
  constructor() {
    const savedDataStr = localStorage.getItem(this.SAVED_DATA_KEY);
    if (savedDataStr) {
      Object.assign(this.configuration, JSON.parse(savedDataStr));
    }
    this.configurationSubject = new BehaviorSubject<Configuration>(this.configuration);
    this.runningSettingsSubject = new BehaviorSubject<any>(this.runningSettings);

    this.configurationSubject.subscribe((configuration) => {
      this.configuration = configuration;
      const totalDuration = [...Array(configuration.totalIterations).keys()].reduce((acc) => {
        return acc + configuration.restDuration + configuration.stepDuration;
      }, 0) - configuration.restDuration;
      const blocks = Helper.calculateBlocks(
        configuration.totalIterations,
        configuration.stepDuration,
        configuration.restDuration);
      this.runningSettingsSubject.next({
        blocks,
        totalDuration,
      });
    });

    // EXECUTIONS
    const savedExecutionsStr = localStorage.getItem(this.EXECUTIONS_DATA_KEY);
    if (savedExecutionsStr) {
      this.savedExecutions = JSON.parse(savedExecutionsStr);
    }
  }

  public save(configuration: Configuration) {
    localStorage.setItem(this.SAVED_DATA_KEY, JSON.stringify(configuration));
    this.configurationSubject.next(configuration);
  }
  public pushExecution(execution: Execution) {
    timer(0).subscribe(() => {
      this.savedExecutions.push({ ...execution, configuration: this.configuration });
      localStorage.setItem(this.EXECUTIONS_DATA_KEY, JSON.stringify(this.savedExecutions));
    });
  }

  public patch(configuration: Configuration) {
    const config = { ...this.configurationSubject.value, ...configuration };
    this.save(config);
  }


}
