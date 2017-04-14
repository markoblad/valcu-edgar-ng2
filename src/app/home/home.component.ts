import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { XbrlUtility } from '../edgar';
import { XbrlService } from '../edgar';
import { EdgarArchiveService } from '../edgar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  public edgarContents: any = [];
  // TypeScript public modifiers

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

  constructor(
    public appState: AppState,
    public title: Title,
    public edgarArchiveService: EdgarArchiveService,
    public xbrlService: XbrlService
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
    // this.edgarContent = this.edgarArchiveService.get(value)
    this.edgarArchiveService.getEdgarCompanyKeys(value).subscribe(
      (res) => {
        res.map((xbrl) => {
          this.xbrlService.xbrls[xbrl.type] = xbrl;
        });
        let roles = XbrlUtility.getXbrlsRoles(res);
        this.xbrlService.roles = roles;
        this.xbrlService.xbrlStatements = roles.map((role) => XbrlUtility.constructXbrlStatement(role, this.xbrlService.xbrls));
        let newMulti = []
        this.xbrlService.xbrlStatements.find((i) => !XbrlUtility.isBlank(i.calculationLinkTrees))
        .calculationLinkTrees.map((calculationLinkTree) => {
          let rootKey = Object.keys(calculationLinkTree)[0] || {};
          let branch = calculationLinkTree[rootKey].branch || {};
          let branchesKeys = Object.keys(branch);
          let series = branchesKeys.map((branchesKey) => { return {name: (((branch[branchesKey] || {}).instances || {}).Context_As_Of_31_Dec_2015T00_00_00_TO_31_Dec_2015T00_00_00 || {}).localName, value: parseInt((((branch[branchesKey] || {}).instances || {}).Context_As_Of_31_Dec_2015T00_00_00_TO_31_Dec_2015T00_00_00 || {}).textContent || 0)}});
          newMulti.push({
            name: rootKey,
            series: series
          }); 
        });
console.log('newMulti: ', JSON.stringify(newMulti));
        this.multi = newMulti;
      },
      (error) => console.log(error)
    );
  }

  public clearXbrls() {
    this.xbrlService.clearXbrls();
  }
}
