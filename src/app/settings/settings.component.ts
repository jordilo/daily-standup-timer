import { StoreService } from './../store.service';
import { Configuration } from './../definitions/config-data.d';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, RouterState, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public configuration: Configuration;

  public form: FormGroup;
  constructor(private fb: FormBuilder, private store: StoreService, private route: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      restDuration: [1, Validators.min(1)],
      stepDuration: [1, Validators.min(1)],
      volume: [1, [Validators.min(0), Validators.max(1)]],
      totalIterations: [1, [Validators.min(1), Validators.max(18)]],
      warningTimer: [1, [Validators.min(5)]],
      allowPause: [true, [Validators.required]]
    });
    this.store.configuration$
      .subscribe((configuration) => this.form.setValue(configuration));
  }

  public save() {
    this.store.save(this.form.value);
    this.route.navigate(['']);
  }

}
