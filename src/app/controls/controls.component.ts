import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TimerStatus } from '../definitions/config-data';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  @Input() public status: TimerStatus;
  @Output() public doPlay = new EventEmitter<any>();
  @Output() public doPause = new EventEmitter<any>();
  @Output() public doStop = new EventEmitter<any>();
  @Output() public doPrev = new EventEmitter<any>();
  @Output() public doNext = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  public play() {
    this.doPlay.emit();
  }
  public pause() {
    this.doPause.emit();
  }
  public stop() {
    this.doStop.emit();
  }
  public prev() {
    this.doPrev.emit();
  }
  public next() {
    this.doNext.emit();
  }

}
