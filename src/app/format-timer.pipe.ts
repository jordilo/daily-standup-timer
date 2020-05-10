import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimer'
})
export class FormatTimerPipe implements PipeTransform {

  transform(seconds: number, ...args: unknown[]): string {
    if (seconds < 0) {
      seconds = 0;
    }
    const hours = Math.trunc(seconds / (3600 * 60));
    const minutes = Math.trunc(seconds / (60));
    const secondsModule = Math.trunc(seconds % 60);

    return `${this.formatNumber(hours)}:${this.formatNumber(minutes)}:${this.formatNumber(secondsModule)}`;
  }

  private formatNumber(value) {
    return String('0' + value).slice(-2);
  }

}
