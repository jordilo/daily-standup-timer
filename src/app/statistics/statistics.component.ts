import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ChartDataSets, ChartOptions } from "chart.js";
import * as moment from 'moment';
import { Label } from "ng2-charts";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public resultsControl: FormControl;

  public options = [
    { label: 'last week', value: 'week' },
    { label: 'last month', value: 'month' },
    { label: 'all', value: 'all' },
  ]
  public lineChartData: ChartDataSets[];

  public lineChartLabels: Label[];
  public total: number;
  public averageTime: string;
  public data: any[];
  public rawdata: any[];
  public csvUri: SafeUrl;
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: { beginAtZero: true }
        },
        {
          id: 'y-axis-1',
          position: 'right',
          ticks: { beginAtZero: true }
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
  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resultsControl = this.fb.control('month');

    this.resultsControl.valueChanges.subscribe((value) => {
      this.generateData(value);
    })
    this.rawdata = (JSON.parse(localStorage.getItem('saved-executions')) as any[]);
    this.generateData('month');
  }

  private generateData(filter: string) {
    let dataset;
    switch (filter) {
      case 'week':
      case 'month':
        const endDate = moment().add(-1, this.resultsControl.value);
        dataset = this.rawdata.filter((d) => moment(d.startTime) > endDate);
        break;
      case 'all':
      default:
        dataset = this.rawdata;
        break;
    }

    this.total = dataset.length;
    const data = dataset.map((date) => {
      const diff = moment(date.finishTime).diff(date.startTime);
      let lastPeopleIndex;
      // If timer has finished without click stop button, current index is -1
      if (date.currentIndex < 1) {
        lastPeopleIndex = date.configuration.totalIterations;
      } else {
        // Divided by 2 due to index has take care of time between participants
        lastPeopleIndex = Math.trunc(date.currentIndex / 2) + 1;
      }
      return {
        diff: diff / 1000,
        date: moment(date.startTime).format('YYYY-MM-DD'),
        diffStr: moment(diff).format('mm:ss'),
        lastPeopleIndex
      };
    });
    this.lineChartData = [
      {
        data: data.map(d => d.diff),
        label: 'Daily time (in seconds)'
      },
      {
        data: data.map(d => d.lastPeopleIndex),
        label: 'People',
        yAxisID: 'y-axis-1'
      }
    ];
    this.lineChartLabels = dataset.map((date) => moment(date.startTime).format("MM-DD"));
    const averageTime = data.reduce((acc, current) => acc += current.diff, 0) / dataset.length;
    this.averageTime = moment(averageTime * 1000).format('mm:ss');
    this.csvUri = this.export(data);
    this.data = data;
  }

  private export(data: any[]) {
    const csv = [['Date', 'Duration', 'Participans']];
    data.forEach((d) => {
      csv.push([d.date, d.diffStr, d.lastPeopleIndex]);
    });
    let final = ``
    csv.forEach(d => {
      final += `${d.join(',')}
`
    })
    return this.sanitizer.bypassSecurityTrustUrl("data:text/plain;charset=UTF-8," + encodeURIComponent(final));
  }

}
