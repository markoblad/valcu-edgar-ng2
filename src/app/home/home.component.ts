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
// import * as NlpCompromise from 'compromise';
import { XbrlService } from '../edgar';
import { VChartComponent } from '../v-chart';
import * as nlp from 'compromise/builds/compromise.es6.js';
import * as JsDiff from 'diff/dist/diff.min.js';

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

  public valcuLogo = 'assets/img/valcu_v.png';
  public name = 'valcu-edgar-ng2';
  // public url = 'https://twitter.com/valcuco';
  public url = '/';
  public isCollapsed = true;

  public localState = { value: '1371128' };
  public edgarContents: any = [];
  // TypeScript public modifiers

  public singleDatas: any[] = [];
  public multiDatas: any[] = [];

  public selectedXbrlVReportKey: string;
  public selectedXbrlVReport: XbrlVReportInterface;
  public selectedXbrlVStatementRoleURI: string;
  public selectedXbrlVStatement: XbrlVStatementInterface;

  public priorXbrlVReportKey: string;
  public priorXbrlVReport: XbrlVReportInterface;
  public priorXbrlVStatementRoleURI: string;
  public priorXbrlVStatement: XbrlVStatementInterface;

  public parsed: any;
  public parsedOut: any;
  public nlpDisplay: boolean = false;
  public nlpMode: string = null;

  private verbose: boolean = false;

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
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xsd',
          },
          {
            type: 'pre',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_pre.xml',
          },
          {
            type: 'def',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_def.xml',
          },
          {
            type: 'cal',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_cal.xml',
          },
          {
            type: 'lab',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_lab.xml',
          },
          {
            type: 'ins',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml',
          },
        ],
      },
      '000121390017002526': {
        edgarArchiveFiles: [
          {
            type: 'xsd',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xsd',
          },
          {
            type: 'pre',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_pre.xml',
          },
          {
            type: 'def',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_def.xml',
          },
          {
            type: 'cal',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_cal.xml',
          },
          {
            type: 'lab',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_lab.xml',
          },
          {
            type: 'ins',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml',
          },
        ],
      },
    };
  }

// https://www.sec.gov/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml
  public ngOnInit() {
    console.log('hello `Home` component');
    // this.parsed = nlp('Now this is a story all about how..');
    // this.parsedOut = this.parsed.normalize().out('terms');
    // this.parsedOut = JsDiff.diffWords('Mark Edward Oblad', 'Henry Mark Oblad');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    if (!XbrlUtility.isBlank(value)) {
      this.clearXbrlReports();
      this.appState.set('searchTerm', value);
      this.localState.value = '';
      this.edgarArchiveService.getCikInfo(value).subscribe(
        (cikInfoObj) => {
          this.appState.set('companyName', (cikInfoObj || {}).companyName);
          this.appState.set('cik', (cikInfoObj || {}).cik);
          this.edgarArchiveService.getCikArchive(this.appState.get('cik')).subscribe(
            (cikObjs) => {
              // console.log('cikObjs: ', JSON.stringify(cikObjs || ''));
              cikObjs.forEach((cikObj) => {
                this.edgarArchiveService.getArchive(cikObj.href).subscribe(
                  (archiveObjs) => {
                    // console.log('archiveObjs: ', JSON.stringify(archiveObjs || ''));
                    let edgarArchiveFiles = this.edgarArchiveService.archiveUrlObjsToEdgarArchiveFiles(archiveObjs);
                    if (edgarArchiveFiles) {
                      let xbrlVReport = {edgarArchiveFiles};
                      // console.log('xbrlVReport: ', JSON.stringify(xbrlVReport));
                      let urlPieces = (edgarArchiveFiles[0].url || '').split('/');
                      let xbrlVReportKey = urlPieces[urlPieces.length - 2];
                      // console.log('xbrlVReportKey: ', xbrlVReportKey);
                      this.getXbrlReport(xbrlVReportKey, xbrlVReport, this.verbose);
                    }
                  },
                  (error) => console.log(error)
                );
              });
            },
            (error) => console.log(error)
          );
        },
        (error) => console.log(error)
      );
    } else {
      // console.log('this.xbrlService.xbrlVReports: ', JSON.stringify(this.xbrlService.xbrlVReports));
      Object.keys(this.xbrlService.xbrlVReports).forEach((xbrlVReportKey) => {
        // console.log('xbrlVReportKey: ', xbrlVReportKey);
        let xbrlVReport = this.xbrlService.xbrlVReports[xbrlVReportKey];
        this.getXbrlReport(xbrlVReportKey, xbrlVReport, this.verbose);
      });
    }
  }

  public getXbrlReport(xbrlVReportKey, xbrlVReport, verbose?: boolean) {
    this.edgarArchiveService.getParsedXbrls(xbrlVReport.edgarArchiveFiles, verbose).subscribe(
      (parsedXbrls) => {
        // console.log('parsedXbrls: ', JSON.stringify(parsedXbrls));
        this.xbrlService.addParsedXbrls(xbrlVReportKey, parsedXbrls, xbrlVReport.edgarArchiveFiles);
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
  }

  public clearXbrlReports() {
    this.setNlpMode(null);
    this.xbrlService.clearXbrlReports();
    this.selectedXbrlVReportKey = null;
    this.selectedXbrlVReport = null;
    this.selectedXbrlVStatementRoleURI = null;
    this.selectedXbrlVStatement = null;
    this.appState.set('companyName', null);
    this.appState.set('cik', null);
    this.appState.set('searchTerm', null);
  }

  public selectXbrlVReport(xbrlVReportKey): void {
    this.selectedXbrlVReport = ((this.xbrlService || {xbrlVReports: {}}).xbrlVReports || {})[xbrlVReportKey] || {};
    this.selectedXbrlVReportKey = xbrlVReportKey;
    // if (XbrlUtility.isBlank(this.selectedXbrlVStatementRoleURI) ||
      // !(Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {}).indexOf(this.selectedXbrlVStatementRoleURI) >= 0)) {
    let xbrlVStatementKeys = Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {});
    this.selectXbrlVStatement((xbrlVStatementKeys.indexOf(this.selectedXbrlVStatementRoleURI) >= 0) ? this.selectedXbrlVStatementRoleURI : xbrlVStatementKeys[0]);
    // }
  }

  public selectPriorXbrlVReport(xbrlVReportKey): void {
    this.priorXbrlVReport = ((this.xbrlService || {xbrlVReports: {}}).xbrlVReports || {})[xbrlVReportKey] || {};
    this.priorXbrlVReportKey = xbrlVReportKey;
    // if (XbrlUtility.isBlank(this.selectedXbrlVStatementRoleURI) ||
      // !(Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {}).indexOf(this.selectedXbrlVStatementRoleURI) >= 0)) {
    let xbrlVStatementKeys = Object.keys((this.priorXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {});
    this.selectPriorXbrlVStatement((xbrlVStatementKeys.indexOf(this.priorXbrlVStatementRoleURI) >= 0) ? this.priorXbrlVStatementRoleURI : xbrlVStatementKeys[0]);
    // }
  }

  public selectXbrlVStatement(xbrlVStatementRoleURI): void {
    XbrlUtility.rectangularizeXbrlVStatement(
      ((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI],
      (this.selectedXbrlVReport || {contexts: {}}).contexts
    );
    this.selectedXbrlVStatement = ((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI] || {};
    this.selectedXbrlVStatementRoleURI = xbrlVStatementRoleURI;
  }

  public selectPriorXbrlVStatement(xbrlVStatementRoleURI): void {
    XbrlUtility.rectangularizeXbrlVStatement(
      ((this.priorXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI],
      (this.priorXbrlVReport || {contexts: {}}).contexts
    );
    this.priorXbrlVStatement = ((this.priorXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI] || {};
    this.priorXbrlVStatementRoleURI = xbrlVStatementRoleURI;
  }

  public lineItemIterators(dimensions) {
    return [{dimension: null}].concat(dimensions || []);
  }

  public getDimensionedRectangleItems(rectangleKeys: string[] = [], dimension: any = {}): string[] {
    let paredRectangleKeys = rectangleKeys.filter((rectangleKey) => { // !dimension.dimension ||
      let rectangleItem = this.selectedXbrlVStatement.rectangle[rectangleKey] || {};
      return this.selectedXbrlVStatement.paredPeriodKeys.find((periodKey) => {
        return ((this.selectedXbrlVStatement.rectangle[rectangleKey] || {}).instances || {})[this.getContextRefByDimensionPeriodKey(dimension, periodKey)];
      });
    });
    return paredRectangleKeys.map((rectangleKey) => this.selectedXbrlVStatement.rectangle[rectangleKey]);
  }

  public getHeadDimensionedRectangleItem(rectangleKeys: string[] = [], dimension: any = {}): any {
    let foundFectangleKey = rectangleKeys.find((rectangleKey) => { // !dimension.dimension ||
      let rectangleItem = this.selectedXbrlVStatement.rectangle[rectangleKey] || {};
      return (rectangleItem && rectangleItem.domainMember === dimension.member &&
        rectangleItem.hypercubeDimension === dimension.dimension);
    });
    return this.selectedXbrlVStatement.rectangle[foundFectangleKey];
  }

  public getHeadDimensionedRectangleItemLabel(rectangleKeys: string[] = [], dimension: any = {}): any {
    let rectangleItem = this.getHeadDimensionedRectangleItem(rectangleKeys, dimension) || {};
    return this.getLabel(rectangleItem.toHref, rectangleItem.preferredLabel);
  }

  public getContextRefByDimensionPeriodKey(dimension: any, periodKey: string): string {
    let contextRefs = this.selectedXbrlVStatement.paredPeriods[periodKey] || [];
    return contextRefs.find((contextRef) => {
      let context = this.selectedXbrlVStatement.paredContexts[contextRef];
      let segments = [];
      context.entity.forEach((entity) => segments = segments.concat((entity || {}).segments || []));
      let explicitMembers = [];
      segments.forEach((segment) => explicitMembers = explicitMembers.concat((segment || {}).explicitMember || []));
      let foundDimension = explicitMembers.find((explicitMember: any = {}) => {
        return explicitMember.dimension === dimension.dimension && explicitMember.textContent === dimension.member;
      });
      return (!dimension.dimension && !foundDimension) || (dimension.dimension && foundDimension);
    });
  }

  public instanceObjIterators(dimension, rectangleItem, periodKeys): any {
    return periodKeys.map((periodKey) => {
      let contextRef = this.getContextRefByDimensionPeriodKey(dimension, periodKey);
      return {periodKey, contextRef};
    });
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
    return XbrlUtility.manageLabelBreaks(XbrlUtility.getLabel((this.selectedXbrlVReport.xbrls || {}).lab, toHref, role) || toHref);
  }

  public getLastSlash(str): string {
    return XbrlUtility.getLastSlash(str);
  }

  public displayRoleURI(roleURI): string {
    let pieces = (((((this.selectedXbrlVReport.xbrls || {}).xsd || {}).roleTypes || {})[roleURI] || {}).definition || '').split(/\s+-\s+/);
    return XbrlUtility.manageLabelBreaks(pieces[pieces.length - 1]);
     // ||
      // (XbrlUtility.getLastSlash(roleURI) || '').replace(/[A-Z]/g,  (letter) => ' ' + letter).trim();
  }

  public displayPeriodKey(periodKey): string {
    return XbrlUtility.manageLabelBreaks(periodKey);
  }

  public getContent(item, contextRef): any {
    return this.displayContent((((item || {}).instances || {})[contextRef] || {}).textContent || '');
  }

  public getPriorContent(item, contextRef): any {
    if (XbrlUtility.isBlank(this.priorXbrlVReportKey)) {
      let xbrlVReportKeys = Object.keys((this.xbrlService || {xbrlVReports: {}}).xbrlVReports || {});
      let priorXbrlVReportKey = xbrlVReportKeys[(xbrlVReportKeys.indexOf(this.selectedXbrlVReportKey) || 0) - 1] ||
        xbrlVReportKeys[(xbrlVReportKeys.indexOf(this.selectedXbrlVReportKey) || 0) + 1];
      this.selectPriorXbrlVReport(priorXbrlVReportKey);
    }
    if (XbrlUtility.isBlank(this.priorXbrlVStatementRoleURI)) {
      this.selectPriorXbrlVStatement(this.selectedXbrlVStatementRoleURI);
    }
    let priorItem = this.priorXbrlVStatement.rectangle[item.to];
    console.log('priorItem: ', JSON.stringify(priorItem));
    let contextRefs = Object.keys((priorItem || {}).instances || {});
    console.log('contextRefs: ', JSON.stringify(contextRefs));
    return this.displayContent((((priorItem || {}).instances || {})[contextRefs[0]] || {}).textContent || '');
  }

  public displayContent(content): any {
    console.log('displaying');
    if (this.nlpDisplay && !XbrlUtility.isBlank(content) && !XbrlUtility.isNumber(content)) {
      // return nlp(XbrlUtility.htmlToMDA(content).join('\n')).normalize().out('normal');
      // return XbrlUtility.htmlToMDA(content).join('\n').replace(/\s*\n+\s*/g, '\<br \/\>');
      let parsedNlp = nlp(XbrlUtility.htmlToMDA(content).join('\n') || '');
      return this.nlpMode === 'people' ? parsedNlp.people().out('html') : (this.nlpMode === 'places' ? parsedNlp.places().out('html') : (parsedNlp.out('text')));
    } else {
      return content;
    }
  }

  public setNlpMode(nlpMode: string): void {
    this.nlpMode = nlpMode;
    this.nlpDisplay = !XbrlUtility.isBlank(nlpMode);
  }

}
