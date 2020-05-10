export interface Configuration {
  stepDuration: number;
  totalIterations: number;
  restDuration: number;
  warningTimer: number;
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
