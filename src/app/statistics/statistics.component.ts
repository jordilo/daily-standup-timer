import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from "chart.js";
import * as moment from 'moment';
import { Label } from "ng2-charts";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public lineChartData: ChartDataSets[];

  public lineChartLabels: Label[];
  public data: any[];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  constructor() { }

  ngOnInit(): void {
    const dataset = JSON.parse(localStorage.getItem('saved-executions')) as any[];
    this.data = dataset.map((date) => {
      const diff = moment(date.finishTime).diff(date.startTime)
      return { diff, date: moment(date.startTime).format('YYYY-MM-DD'), diffStr: moment(diff).format('mm:ss') };
    })
    this.lineChartData = [{
      data: this.data.map(d => d.diff),
      label: 'Daily time'
    }];
    this.lineChartLabels = dataset.map((date) => moment(date.startTime).format("MM-DD"))

  }

}
