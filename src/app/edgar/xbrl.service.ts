import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { XbrlUtility } from '../edgar';
import { XbrlVReportInterface, XbrlVStatementInterface, XbrlReportInterface, XbrlStatementInterface } from './';
import { EdgarArchiveService } from '../edgar';
import * as nlp from 'compromise/builds/compromise.es6.js';

@Injectable()
export class XbrlService {

  public xbrlVReports: any = {};
  public xbrlVReportKeys: string[] = [];

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
    public edgarArchiveService: EdgarArchiveService
  ) {}

  public addParsedXbrls(xbrlVReportKey: string, parsedXbrls: any[] = [], edgarArchiveFiles: any[]): void {
    let xbrlVReport: XbrlVReportInterface = {
      edgarArchiveFiles,
      xbrls: {},
      roleURIs: [],
      contexts: {},
      units: {},
      xbrlVStatements: {},
      description: null,
    };
    parsedXbrls.map((parsedXbrl) => {
      xbrlVReport.xbrls[parsedXbrl.type] = parsedXbrl;
      if (parsedXbrl.type === 'ins') {
        xbrlVReport.description = XbrlUtility.getXbrlVReportDescription(xbrlVReport);
      }
    });
    xbrlVReport.roleURIs = XbrlUtility.getXbrlsRoleURIs(parsedXbrls);

    xbrlVReport.roleURIs.forEach((roleURI) => {
      let xbrlVStatement: XbrlVStatementInterface = {
        roleURI,
        xbrlStatement: XbrlUtility.constructXbrlStatement(roleURI, xbrlVReport.xbrls),
        xbrlStatementKeys: null,
        paredContextRefs: null,
        rectangle: null,
        rectangleKeys: null,
      };
      // console.log('before');
      xbrlVReport.xbrlVStatements[roleURI] = xbrlVStatement;
      // console.log('after');
    });
    xbrlVReport.contexts = ((xbrlVReport.xbrls || {}).ins || {}).contexts;
    xbrlVReport.units = ((xbrlVReport.xbrls || {}).ins || {}).units;
    xbrlVReport.status = XbrlUtility.isBlank(parsedXbrls) ? 2 : 4;
    if (this.xbrlVReportKeys.indexOf(xbrlVReportKey) < 0) {
      this.xbrlVReportKeys = (this.xbrlVReportKeys.concat([xbrlVReportKey])).sort((a, b) => parseInt(b.substring(10), 10) - parseInt(a.substring(10), 10));
    }
    // console.log('this.xbrlVReportKeys: ', JSON.stringify(this.xbrlVReportKeys));
    this.xbrlVReports[xbrlVReportKey] = xbrlVReport;
  }

  public selectedXbrlVReportDisplayable(): any {
    return this.selectedXbrlVReport && this.selectedXbrlVReport.status && this.selectedXbrlVReport.status >= 4;
  }

  public selectDefaultXbrlVStatement(): void {
    let xbrlVStatementKeys = Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {});
    // console.log('xbrlVStatementKeys: ', JSON.stringify(xbrlVStatementKeys));
    this.selectXbrlVStatement((xbrlVStatementKeys.indexOf(this.selectedXbrlVStatementRoleURI) >= 0) ? this.selectedXbrlVStatementRoleURI : xbrlVStatementKeys[0]);
  }

  public getXbrlReport(xbrlVReportKey, xbrlVReport, verbose?: boolean) {
    return this.edgarArchiveService.getParsedXbrls(xbrlVReport.edgarArchiveFiles, verbose).subscribe(
      (parsedXbrls) => {
        // console.log('parsedXbrls: ', JSON.stringify(parsedXbrls));
        this.addParsedXbrls(xbrlVReportKey, parsedXbrls, xbrlVReport.edgarArchiveFiles);
        if (XbrlUtility.isBlank(this.selectedXbrlVReportKey)) {
          this.selectXbrlVReport(xbrlVReportKey);
        } else {
          // this.selectDefaultXbrlVStatement();
        }

        // this.xbrlStatements.filter((xbrlStatement) => !XbrlUtility.isBlank(xbrlStatement.calculationLinkTrees)).map((xbrlStatement) => {
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
    this.xbrlVReports = {};
    this.xbrlVReportKeys = [];
    this.selectedXbrlVReportKey = null;
    this.selectedXbrlVReport = null;
    this.selectedXbrlVStatementRoleURI = null;
    this.selectedXbrlVStatement = null;
  }

  public setNlpMode(nlpMode: string): void {
    this.nlpMode = nlpMode;
    this.nlpDisplay = !XbrlUtility.isBlank(nlpMode);
  }

  public selectXbrlVReport(xbrlVReportKey): void {
    let selectedXbrlVReport = (this.xbrlVReports || {})[xbrlVReportKey] || {};
    if (!selectedXbrlVReport.status || selectedXbrlVReport.status < 4) {
      this.selectedXbrlVReportKey = null;
      this.selectedXbrlVReport = null;
      this.getXbrlReport(xbrlVReportKey, selectedXbrlVReport, this.verbose);
      this.selectedXbrlVReport = (this.xbrlVReports || {})[xbrlVReportKey] || {};
    } else {
      this.selectedXbrlVReportKey = xbrlVReportKey;
      this.selectedXbrlVReport = selectedXbrlVReport;
      // if (XbrlUtility.isBlank(this.selectedXbrlVStatementRoleURI) ||
        // !(Object.keys((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {}).indexOf(this.selectedXbrlVStatementRoleURI) >= 0)) {
      this.selectDefaultXbrlVStatement();
      // }
    }
  }

  public selectPriorXbrlVReport(xbrlVReportKey): void {
    this.priorXbrlVReport = ((this || {xbrlVReports: {}}).xbrlVReports || {})[xbrlVReportKey] || {};
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

  public contextRefToHeader(contextRef) {
    return XbrlUtility.getContextRefHeading(contextRef, (this.selectedXbrlVReport || {contexts: {}}).contexts);
  }

  public getLabel(toHref: string, role?: string): string {
    return XbrlUtility.manageLabelBreaks(XbrlUtility.getLabel((this.selectedXbrlVReport.xbrls || {}).lab, toHref, role) || toHref);
  }

  public getXbrlVReportDescriptionByKey(xbrlVReportKey: string): string {
    return this.xbrlVReports[xbrlVReportKey].description || xbrlVReportKey;
  }

  public getLastSlash(str): string {
    return XbrlUtility.getLastSlash(str);
  }

  public displayRoleURI(roleURI): string {
    let pieces = (((((this.selectedXbrlVReport.xbrls || {}).xsd || {}).roleTypes || {})[roleURI] || {}).definition || '').split(/\s+-\s+/);
    return XbrlUtility.manageLabelBreaks(pieces[pieces.length - 1]);
    // || (XbrlUtility.getLastSlash(roleURI) || '').replace(/[A-Z]/g, (letter) => ' ' + letter).trim();
  }

  public displayPeriodKey(periodKey): string {
    return XbrlUtility.manageLabelBreaks(periodKey);
  }

  public getContent(item, contextRef, decimals?: any, unitsPool?: any): any {
    let instance = ((item || {}).instances || {})[contextRef] || {};
    let textContent = (instance).textContent || '';
    let instanceDecimals = (((item || {}).instances || {})[contextRef] || {}).decimals;
    let value = textContent;
    let details = '';
    if (!XbrlUtility.isBlank(instance.unitRef) && !XbrlUtility.isBlank(unitsPool)) {
      if (XbrlUtility.isNumber(textContent)) {
        value = parseFloat(textContent);
        if (XbrlUtility.isNumber(instanceDecimals)) {
          value = value * Math.pow(10, parseFloat(instanceDecimals));
        }
        value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      }
      details = '<br /><span class="details">' + (((unitsPool || {})[instance.unitRef] || {}).display || 'N/A') + '</span>';
    }
    return this.displayContent(value) + details;
  }

  public getPriorContent(item, contextRef): any {
    if (XbrlUtility.isBlank(this.priorXbrlVReportKey)) {
      let xbrlVReportKeys = Object.keys((this || {xbrlVReports: {}}).xbrlVReports || {});
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
    // console.log('displaying');
    if (this.nlpDisplay && !XbrlUtility.isBlank(content) && !XbrlUtility.isNumber(content)) {
      // return nlp(XbrlUtility.htmlToMDA(content).join('\n')).normalize().out('normal');
      // return XbrlUtility.htmlToMDA(content).join('\n').replace(/\s*\n+\s*/g, '\<br \/\>');
      let parsedNlp = nlp(XbrlUtility.htmlToMDA(content).join('\n') || '');
      return this.nlpMode === 'people' ? parsedNlp.people().out('html') : (this.nlpMode === 'places' ? parsedNlp.places().out('html') : (parsedNlp.out('text')));
    } else {
      return content;
    }
  }

}
