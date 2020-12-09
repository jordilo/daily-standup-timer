import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { StatisticsComponent } from "./statistics/statistics.component";


const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'statistics',
    component: StatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
