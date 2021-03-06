import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'v-chart'
  selector: 'v-chart',  // <v-chart></v-chart>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // providers: [
  // ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './v-chart.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './v-chart.component.html'
})
export class VChartComponent implements OnInit {

  @Input()
  public vChartType: string = 'barHorizontalStacked';

  @Input()
  public single: any[] = [
    // {
    //   'name': 'Germany',
    //   'value': 8940000
    // },
    // {
    //   'name': 'USA',
    //   'value': 5000000
    // },
    // {
    //   'name': 'France',
    //   'value': 7200000
    // }
  ];

  @Input()
  public multi: any[] = [
    // {
    //   'name': 'Germany',
    //   'series': [
    //     {
    //       'name': '2010',
    //       'value': 7300000
    //     },
    //     {
    //       'name': '2011',
    //       'value': 8940000
    //     }
    //   ]
    // },

    // {
    //   'name': 'USA',
    //   'series': [
    //     {
    //       'name': '2010',
    //       'value': 7870000
    //     },
    //     {
    //       'name': '2011',
    //       'value': 8270000
    //     }
    //   ]
    // },

    // {
    //   'name': 'France',
    //   'series': [
    //     {
    //       'name': '2010',
    //       'value': 5000002
    //     },
    //     {
    //       'name': '2011',
    //       'value': 5800000
    //     }
    //   ]
    // }
  ];

  @Input()
  // view: any[] = [700, 400];
  public view: any[] = [1200, 800];

  // options
  @Input()
  public showXAxis = true;

  @Input()
  public showYAxis = true;

  @Input()
  public gradient = false;

  @Input()
  public showLegend = true;

  @Input()
  public showXAxisLabel = true;

  @Input()
  public xAxisLabel = 'Country';

  @Input()
  public showYAxisLabel = true;

  @Input()
  public yAxisLabel = 'Population';

  @Input()
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // constructor(
  // ) {}

  public ngOnInit() {
    console.log('hello `VChart` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public onSelect(event) {
    console.log(event);
  }
}
