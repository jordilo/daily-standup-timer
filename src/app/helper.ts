import { Block } from './definitions/config-data.d';

export class Helper {

  public static calculateBlocks(iterations: number, duration: number, restDuration: number): Block[] {

    return [...Array(iterations).keys()].reduce((acc: Block[], curr, index) => {
      const lastBlock = acc[acc.length - 1];
      let current: Block;
      let currentRest: Block;
      const result: Block[] = [];
      if (!lastBlock) {
        current = { type: 'duration', value: duration, start: 0, end: duration - 0.000 };
      } else {
        current = { type: 'duration', value: duration, start: lastBlock.end + 0.000, end: lastBlock.end + duration - 0.000 };
      }
      result.push(current);
      if (index + 1 < iterations) {
        currentRest = { type: 'rest', value: restDuration, start: current.end + 0.000, end: current.end + restDuration - 0.000 }
        result.push(currentRest);
      }
      return [...acc, ...result];
    }, []);
  }
}
