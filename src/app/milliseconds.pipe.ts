import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milliseconds'
})
export class MillisecondsPipe implements PipeTransform {

  transform(value: number, decimals: number = 3): unknown {
    return (value % 1).toFixed(decimals).split('.')[1];
  }

}
