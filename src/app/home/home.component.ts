import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { XbrlUtility } from '../edgar';
import { XbrlService } from '../edgar';
import { EdgarArchiveService } from '../edgar';
import { VChartComponent } from '../v-chart';

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

  public singleDatas: any[] = [];
  public multiDatas: any[] = [];

  public selectedXbrlStatement: string;
  public xbrlStatement: any = {};
  public xbrlStatementKeys: any = [];
  public contexts;
  public units;
  public paredContextRefs;
  public rectangle: any = {};
  public rectangleKeys: any = [];

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
        roles.forEach((role) => this.xbrlService.xbrlStatements[role] = XbrlUtility.constructXbrlStatement(role, this.xbrlService.xbrls));
        this.contexts = ((this.xbrlService.xbrls || {}).ins || {}).contexts;
        this.units = ((this.xbrlService.xbrls || {}).ins || {}).units;

        // this.xbrlService.xbrlStatements.filter((xbrlStatement) => !XbrlUtility.isBlank(xbrlStatement.calculationLinkTrees)).map((xbrlStatement) => {
        //   let newMultiData = [];
        //   let newSingleData = [];
        //   xbrlStatement.calculationLinkTrees.map((calculationLinkTree) => {
        //     // console.log('Object.keys(calculationLinkTree): ', JSON.stringify(Object.keys(calculationLinkTree)));
        //     let rootKey = Object.keys(calculationLinkTree)[0];
        //     let root = calculationLinkTree[rootKey] || {};
        //     let branch = root.branch || {};
        //     let branchesKeys = Object.keys(branch) || [];
        //     let series = branchesKeys.map((branchesKey) => { return {
        //       name: (((branch[branchesKey] || {}).instances || {}).Context_As_Of_31_Dec_2015T00_00_00_TO_31_Dec_2015T00_00_00 || {}).localName || '',
        //       value: parseInt((((branch[branchesKey] || {}).instances || {}).Context_As_Of_31_Dec_2015T00_00_00_TO_31_Dec_2015T00_00_00 || {}).textContent || 0, 10)
        //     }; });
        //     newSingleData = newSingleData.concat(series);
        //     newMultiData.push({name: rootKey, series});
        //   });
        //   // console.log('newMulti: ', JSON.stringify(newMultiData));
        //   if (!XbrlUtility.isBlank(newSingleData)) {
        //     this.singleDatas.push(newSingleData);
        //   }
        //   if (!XbrlUtility.isBlank(newMultiData)) {
        //     this.multiDatas.push(newMultiData);
        //   }
        // });
      },
      (error) => console.log(error)
    );
  }

  public clearXbrls() {
    this.xbrlService.clearXbrls();
  }

  public selectXbrlStatement(role) {
    // console.log('selected role: ', role);
    // console.log('this.xbrlService.xbrlStatements keys: ', JSON.stringify(Object.keys(this.xbrlService.xbrlStatements)));
    this.selectedXbrlStatement = role;
    this.xbrlStatement = (this.xbrlService.xbrlStatements || {})[this.selectedXbrlStatement];
    let tree = (this.xbrlStatement || {}).presentationCompositeLinkTree || {};
    let dimensions = XbrlUtility.getXbrlStatementDimensions(this.xbrlStatement);
    this.paredContextRefs = XbrlUtility.pareContextRefs(this.xbrlStatement.contextRefs, this.contexts, dimensions);
    this.rectangle = XbrlUtility.rectangularizeTree(tree) || {};
    // console.log('this.rectangle: ', JSON.stringify(this.rectangle));
    this.rectangleKeys = Object.keys(this.rectangle);
    // console.log('rectangleKeys: ', JSON.stringify(this.rectangleKeys));
  }

  public contextRefToHeader(contextRef) {
    return XbrlUtility.getContextRefHeading(contextRef, this.contexts);
  }

  public repeat(str: string, times: number = 1): string {
    return str.repeat(Math.max(times || 0, 0));
  }

  public getLabel(toHref: string, role?: string): string {
    return XbrlUtility.getLabel((this.xbrlService.xbrls || {}).lab, toHref, role) || toHref;
  }

  public getHrefLastPiece(str): string {
    return XbrlUtility.getHrefLastPiece(str);
  }

}
