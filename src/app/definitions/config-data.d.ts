export interface Configuration {
  stepDuration: number;
  totalIterations: number;
  restDuration: number;
  warningTimer: number;
  volume: number;
  allowPause: boolean;
}

export const enum TimerStatus {
  STOPPED,
  PAUSED,
  RUNNING,
  FINISHED
}

export interface Block {
  type: 'duration' | 'rest';
  value: number;
  start?: number;
  end?: number;
}


export interface Execution {
  currentIndex: number;
  currentDuration: number;
  currentBlock: Block;
  currentStatus: TimerStatus;
  progress: number;
  startTime: moment.Moment;
  finishTime: moment.Moment;
}

export interface ExecutionData extends Execution {
  configuration: Configuration;
}
