import { Block } from './../definitions/config-data.d';
import { Helper } from './../helper';
import { Component, Input, OnChanges, ElementRef, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';



@Component({
  selector: 'app-summary-graph',
  templateUrl: './summary-graph.component.html',
  styleUrls: ['./summary-graph.component.scss']
})
export class SummaryGraphComponent implements OnChanges {

  @Input() public transition: boolean;
  @Input() public iterations: number;
  @Input() public duration: number;
  @Input() public totalDuration: number;
  @Input() public restDuration: number;
  @Input() public progress: number;
  @Output() public selectGraph = new EventEmitter<Block>();

  @ViewChild('progressBar', { static: true }) public progressBar: ElementRef<HTMLElement>;

  public blocks: Block[];
  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.iterations || changes.duration || changes.restDuration) {
      this.blocks = Helper.calculateBlocks(this.iterations, this.duration, this.restDuration);
    }
    if (changes.progress || changes.totalDuration) {
      this.progress = this.progress * 100 / this.totalDuration;
    }

    if (changes.transition) {
      if (changes.transition.currentValue === true) {
        timer(100).subscribe(() => this.progressBar.nativeElement.classList.add('transition'));
      } else {
        this.progressBar.nativeElement.classList.remove('transition');
      }
    }
  }

  public blockClicked(block: Block) {
    this.selectGraph.emit(block);
  }
  public trackbyFn(index: number): number {
    return index;
  }

}
