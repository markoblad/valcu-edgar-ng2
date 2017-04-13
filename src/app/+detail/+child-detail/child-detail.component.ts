import {
  Component,
  OnInit,
} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

console.log('`ChildDetail` component loaded asynchronously');

@Component({
  selector: 'child-detail',
  template: `
    <ngx-charts-bar-horizontal-stacked
      class="chart-container"
      [view]='view'
      [scheme]='colorScheme'
      [results]='single'
      [gradient]='gradient'
      [xAxis]='showXAxis'
      [yAxis]='showYAxis'
      [legend]='showLegend'
      [showXAxisLabel]='showXAxisLabel'
      [showYAxisLabel]='showYAxisLabel'
      [xAxisLabel]='xAxisLabel'
      [yAxisLabel]='yAxisLabel'
      (select)='onSelect($event)'>
    </ngx-charts-bar-horizontal-stacked>
  `,
})
export class ChildDetailComponent implements OnInit {
  single: any[] = [
    {
      'name': 'Germany',
      'value': 8940000
    },
    {
      'name': 'USA',
      'value': 5000000
    },
    {
      'name': 'France',
      'value': 7200000
    }
  ];

  multi: any[] = [
    {
      'name': 'Germany',
      'series': [
        {
          'name': '2010',
          'value': 7300000
        },
        {
          'name': '2011',
          'value': 8940000
        }
      ]
    },

    {
      'name': 'USA',
      'series': [
        {
          'name': '2010',
          'value': 7870000
        },
        {
          'name': '2011',
          'value': 8270000
        }
      ]
    },

    {
      'name': 'France',
      'series': [
        {
          'name': '2010',
          'value': 5000002
        },
        {
          'name': '2011',
          'value': 5800000
        }
      ]
    }
  ];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    // Object.assign(this, {single, multi})   
  }
  
  public onSelect(event) {
    console.log(event);
  }

  public ngOnInit() {
    console.log('hello `ChildDetail` component');
  }

}
