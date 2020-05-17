import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { ControlsComponent } from './controls/controls.component';
import { TimerComponent } from './timer/timer.component';
import { SummaryGraphComponent } from './summary-graph/summary-graph.component';
import { FormatTimerPipe } from './format-timer.pipe';
import { MillisecondsPipe } from './milliseconds.pipe';
import { QuickSettingsComponent } from './quick-settings/quick-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    ControlsComponent,
    TimerComponent,
    SummaryGraphComponent,
    FormatTimerPipe,
    MillisecondsPipe,
    QuickSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
