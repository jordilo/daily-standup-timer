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
    { label: 'last week', value: 5 },
    { label: 'last month', value: 25 },
    { label: 'all', value: -1 },
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
    this.resultsControl = this.fb.control(25);

    this.resultsControl.valueChanges.subscribe((value) => {
      if (value !== -1) {
        const initialPosition = Math.max(this.rawdata.length - value, 0)
        this.generateData(this.rawdata.slice(this.rawdata.length - value, this.rawdata.length))
      } else {
        this.generateData(this.rawdata);
      }
    })
    this.rawdata = (JSON.parse(localStorage.getItem('saved-executions')) as any[])
      .filter(({ currentIndex }) => currentIndex !== 0);
    this.generateData(this.rawdata);
  }

  private generateData(dataset: any[]) {
    this.total = dataset.length;
    this.data = dataset.map((date) => {
      const diff = moment(date.finishTime).diff(date.startTime);
      let lastPeopleIndex = date.currentIndex;
      if (lastPeopleIndex == -1) {
        lastPeopleIndex = date.configuration.totalIterations;
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
        data: this.data.map(d => d.diff),
        label: 'Daily time'
      },
      {
        data: this.data.map(d => d.lastPeopleIndex),
        label: 'People',
        yAxisID: 'y-axis-1'
      }
    ];
    this.lineChartLabels = dataset.map((date) => moment(date.startTime).format("MM-DD"));
    const averageTime = this.data.reduce((acc, current) => acc += current.diff, 0) / dataset.length;
    this.averageTime = moment(averageTime * 1000).format('mm:ss');
    this.export();
  }

  public export() {
    const csv = [['Date', 'Duration', 'Participans']];
    this.data.forEach((d) => {
      csv.push([d.date, d.diffStr, d.lastPeopleIndex]);
    });
    let final = ``
    csv.forEach(d => {
      final += `${d.join(',')}
`
    })
    this.csvUri = this.sanitizer.bypassSecurityTrustUrl("data:text/plain;charset=UTF-8," + encodeURIComponent(final));
  }

}
