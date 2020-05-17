import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Configuration } from './../definitions/config-data.d';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-quick-settings',
  templateUrl: './quick-settings.component.html',
  styleUrls: ['./quick-settings.component.scss']
})
export class QuickSettingsComponent implements OnInit, OnChanges {

  @Input() public configuration: Configuration;
  @Output() public configurationChange = new EventEmitter<Configuration>();
  public form: FormGroup;
  constructor(private fb: FormBuilder) { }

  public ngOnInit() {
    this.form = this.fb.group({
      totalIterations: [this.configuration.totalIterations, [Validators.min(1), Validators.max(20)]]
    });
    this.form.valueChanges.pipe(debounceTime(500))
      .subscribe((config) => this.configurationChange.emit(config));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.form) {
      this.form.setValue(changes.configuration.currentValue, { emitEvent: false });
    }
  }

}
