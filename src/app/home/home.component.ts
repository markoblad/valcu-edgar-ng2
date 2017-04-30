import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { XbrlUtility } from '../edgar';
import { EdgarArchiveService } from '../edgar';
import { XbrlVReportInterface, XbrlVStatementInterface, XbrlReportInterface, XbrlStatementInterface } from '../edgar';
import { XbrlService } from '../edgar';
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

  public selectedXbrlVReportKey: string;
  public selectedXbrlVReport: XbrlVReportInterface;
  public selectedXbrlVStatementRoleURI: string;
  public selectedXbrlVStatement: XbrlVStatementInterface;

  constructor(
    public appState: AppState,
    public title: Title,
    public edgarArchiveService: EdgarArchiveService,
    public xbrlService: XbrlService
  ) {
    this.xbrlService.xbrlVReports = {
      '000121390016011346': {
        edgarArchiveFiles: [
          {
            type: 'xsd',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xsd',
          },
          {
            type: 'pre',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_pre.xml',
          },
          {
            type: 'def',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_def.xml',
          },
          {
            type: 'cal',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_cal.xml',
          },
          {
            type: 'lab',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_lab.xml',
          },
          {
            type: 'ins',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml',
          },
        ],
      },
      '000121390017002526': {
        edgarArchiveFiles: [
          {
            type: 'xsd',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xsd',
          },
          {
            type: 'pre',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_pre.xml',
          },
          {
            type: 'def',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_def.xml',
          },
          {
            type: 'cal',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_cal.xml',
          },
          {
            type: 'lab',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_lab.xml',
          },
          {
            type: 'ins',
            url: '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml',
          },
        ],
      },
    };
  }

// https://www.sec.gov/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml
  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
    // this.edgarContent = this.edgarArchiveService.get(value)
    Object.keys(this.xbrlService.xbrlVReports).forEach((xbrlVReportKey) => {
      let xbrlReport = this.xbrlService.xbrlVReports[xbrlVReportKey];
      this.edgarArchiveService.getParsedXbrls(xbrlReport.edgarArchiveFiles).subscribe(
        (parsedXbrls) => {
          // console.log('xbrlVReportKey: ', xbrlVReportKey);
          this.xbrlService.addParsedXbrls(xbrlVReportKey, parsedXbrls, xbrlReport.edgarArchiveFiles);
          if (XbrlUtility.isBlank(this.selectedXbrlVReportKey)) {
            this.selectXbrlVReport(Object.keys(this.xbrlService.xbrlVReports)[0]);
            this.selectXbrlVStatement(Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[0]);
          }

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

    });
  }

  public clearXbrlReports() {
    this.xbrlService.clearXbrlReports();
    this.selectedXbrlVReportKey = null;
    this.selectedXbrlVReport = null;
    this.selectedXbrlVStatementRoleURI = null;
    this.selectedXbrlVStatement = null;
  }

  public selectXbrlVReport(xbrlVReportKey): void {
    this.selectedXbrlVReport = ((this.xbrlService || {xbrlVReports: {}}).xbrlVReports || {})[xbrlVReportKey] || {};
    this.selectedXbrlVReportKey = xbrlVReportKey;
  }

  public selectXbrlVStatement(xbrlVStatementRoleURI): void {
    XbrlUtility.rectangularizeXbrlVStatement(((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI], (this.selectedXbrlVReport || {contexts: {}}).contexts);
    this.selectedXbrlVStatement = ((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI] || {};
    this.selectedXbrlVStatementRoleURI = xbrlVStatementRoleURI;
  }

  public xbrlVReportKeys() {
    return Object.keys(this.xbrlService.xbrlVReports || {});
  }

  public contextRefToHeader(contextRef) {
    return XbrlUtility.getContextRefHeading(contextRef, (this.selectedXbrlVReport || {contexts: {}}).contexts);
  }

  public repeat(str: string, times: number = 1): string {
    return str.repeat(Math.max(times || 0, 0));
  }

  public getLabel(toHref: string, role?: string): string {
    return XbrlUtility.getLabel((this.selectedXbrlVReport.xbrls || {}).lab, toHref, role) || toHref;
  }

  public getLastSlash(str): string {
    return XbrlUtility.getLastSlash(str);
  }

  public displayRoleURI(roleURI): string {
    let pieces = (((((this.selectedXbrlVReport.xbrls || {}).xsd || {}).roleTypes || {})[roleURI] || {}).definition || '').split(/\s+-\s+/);
    return pieces[pieces.length - 1];
     // ||
      // (XbrlUtility.getLastSlash(roleURI) || '').replace(/[A-Z]/g,  (letter) => ' ' + letter).trim();
  }

}
