import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { XbrlUtility, XbrlVStatementUtility } from '../edgar';
import { XbrlVReportInterface, XbrlVStatementInterface, XbrlReportInterface, XbrlStatementInterface } from './';
import { EdgarArchiveService } from '../edgar';
// import * as nlp from 'compromise/builds/compromise.es6.js';
import * as nlp from 'compromise';

@Injectable()
export class XbrlService {

  public xbrlVReports: any = {};
  public xbrlVReportKeys: string[] = [];

  public selectedXbrlVReportKey: string;
  public selectedXbrlVReport: XbrlVReportInterface;
  public selectingXbrlVReport: boolean = false;
  public selectedXbrlVStatementRoleURI: string;
  public selectedXbrlVStatement: XbrlVStatementInterface;
  public selectingXbrlVStatement: boolean = false;

  public priorXbrlVReportKey: string;
  public priorXbrlVReport: XbrlVReportInterface;
  public priorXbrlVStatementRoleURI: string;
  public priorXbrlVStatement: XbrlVStatementInterface;

  public parsed: any;
  public parsedOut: any;
  public nlpDisplay: boolean = false;
  public nlpMode: string = null;

  public verbose: boolean = false;

  constructor(
    public edgarArchiveService: EdgarArchiveService
  ) {
    this.xbrlVReports = {
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
      'taxonomy': {
        edgarArchiveFiles: [
          {
            type: 'cal',
            url: 'us-gaap-stm-sfp-cls-cal-2012-01-31.xml',
            source: 'fasb',
          },
        ],
      },
    };
  }

  public packageXbrlVReport(xbrlVReportKey: string, parsedXbrls: any[] = [], edgarArchiveFiles: any[], description?: string): XbrlVReportInterface {
    let xbrlVReport: XbrlVReportInterface = {
      version: XbrlUtility.VERSION,
      xbrlVReportKey,
      edgarArchiveFiles,
      xbrls: {},
      roleURIs: [],
      contexts: {},
      units: {},
      xbrlVStatements: {},
      description: null,
    };
    let xbrls: XbrlReportInterface = {};
    parsedXbrls.map((parsedXbrl) => {
      xbrls[parsedXbrl.type] = parsedXbrl;
      if (parsedXbrl.type === 'lab') {
        xbrlVReport.lab = parsedXbrl;
      }
    });
    xbrlVReport.roleURIs = XbrlUtility.getXbrlsRoleURIs(parsedXbrls);

    xbrlVReport.roleURIs.forEach((roleURI) => {
      let xbrlVStatement: XbrlVStatementInterface = {
        roleURI,
        xbrlStatement: XbrlUtility.constructXbrlStatement(roleURI, xbrls),
        xbrlStatementKeys: null,
        paredContextRefs: null,
        rectangle: null,
        rectangleKeys: null,
      };
      // console.log('before');
      xbrlVReport.xbrlVStatements[roleURI] = xbrlVStatement;
      // console.log('after');
    });
    let ins = xbrls.ins || {};
    xbrlVReport.contexts = ins.contexts;
    xbrlVReport.units = ins.units;
    xbrlVReport.instances = ins.instances;
    xbrlVReport.description = description || XbrlUtility.getXbrlVReportDescription(xbrlVReport);
    console.log('xbrlVReport.description: ', xbrlVReport.description);
    xbrlVReport.status = XbrlUtility.isBlank(parsedXbrls) ? 2 : 4;

    return xbrlVReport;
  }

  public addParsedXbrls(xbrlVReportKey: string, parsedXbrls: any[] = [], edgarArchiveFiles: any[], description?: string): XbrlVReportInterface {
    let xbrlVReport = this.packageXbrlVReport(xbrlVReportKey, parsedXbrls, edgarArchiveFiles, description);
    return this.addXbrlVReport(xbrlVReport, xbrlVReportKey);
  }

  public addXbrlVReport(xbrlVReport: XbrlVReportInterface, xbrlVReportKey?: string): XbrlVReportInterface {
    xbrlVReportKey = xbrlVReportKey || (xbrlVReport || {}).xbrlVReportKey;
    if (this.xbrlVReportKeys.indexOf(xbrlVReportKey) < 0) {
      this.xbrlVReportKeys = (this.xbrlVReportKeys.concat([xbrlVReportKey])).sort((a, b) => parseInt(b.substring(10), 10) - parseInt(a.substring(10), 10));
    }
    this.xbrlVReports[xbrlVReportKey] = xbrlVReport;
    return xbrlVReport;
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
    return this.edgarArchiveService.getXbrlVReport(xbrlVReportKey)
    .subscribe((cachedXbrlVReport) => {
      if (XbrlUtility.isBlank(cachedXbrlVReport)) {
        console.log('cachedXbrlVReport is blank');
        return this.edgarArchiveService.getParsedXbrls(xbrlVReport.edgarArchiveFiles, verbose).subscribe(
          (parsedXbrls) => {
            // console.log('parsedXbrls: ', JSON.stringify(parsedXbrls));
            xbrlVReport = this.addParsedXbrls(xbrlVReportKey, parsedXbrls, xbrlVReport.edgarArchiveFiles);
            console.log('getXbrlReport xbrlVReport.description: ', xbrlVReport.description);
            this.edgarArchiveService.postXbrlVReport(xbrlVReport).subscribe(
              (returnObj) => {
                // console.log('postXbrlVReport returnObj: ', JSON.stringify(returnObj));
            });
            if (XbrlUtility.isBlank(this.selectedXbrlVReportKey)) {
                this.selectXbrlVReport(xbrlVReportKey);
            } else {
              // this.selectDefaultXbrlVStatement();
            }
            this.selectingXbrlVReport = false;
          },
          (error) => console.log(error)
        );
      } else {
        xbrlVReport = this.addXbrlVReport(cachedXbrlVReport, xbrlVReportKey);
        if (XbrlUtility.isBlank(this.selectedXbrlVReportKey)) {
          this.selectXbrlVReport(xbrlVReportKey);
        } else {
          // this.selectDefaultXbrlVStatement();
        }
        this.selectingXbrlVReport = false;
        return Observable.of(xbrlVReport);
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

    });
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
    this.selectingXbrlVReport = true;
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
      this.selectingXbrlVReport = false;
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
    this.selectingXbrlVStatement = true;
    XbrlUtility.rectangularizeXbrlVStatement(
      ((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI],
      (this.selectedXbrlVReport || {contexts: {}}).contexts
    );
    this.selectedXbrlVStatement = ((this.selectedXbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[xbrlVStatementRoleURI] || {};
    this.selectedXbrlVStatementRoleURI = xbrlVStatementRoleURI;
    this.selectingXbrlVStatement = false;
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
    return XbrlUtility.manageLabelBreaks(XbrlUtility.getLabel(this.selectedXbrlVReport.lab, toHref, role) || toHref);
  }

  public getXbrlVReportDescriptionByKey(xbrlVReportKey: string): string {
    return this.xbrlVReports[xbrlVReportKey].description || xbrlVReportKey;
  }

  public getLastSlash(str): string {
    return XbrlUtility.getLastSlash(str);
  }

  public displayRoleURI(roleURI): string {
    let definition = XbrlUtility.getRoleURIDefinition(this.selectedXbrlVReport, roleURI);
    // let categorization = XbrlVStatementUtility.categorizeStatement(definition);
    let pieces = (definition || '').split(/\s+-\s+/);
    // return XbrlUtility.manageLabelBreaks(pieces[pieces.length - 1] + ' ' + JSON.stringify(categorization));
    return XbrlUtility.manageLabelBreaks(pieces[pieces.length - 1]);
    // || (XbrlUtility.getLastSlash(roleURI) || '').replace(/[A-Z]/g, (letter) => ' ' + letter).trim();
  }

  public displayPeriodKey(periodKey): string {
    // return XbrlUtility.manageLabelBreaks(periodKey);
    return periodKey.toString().split(/\s+/).join('<br />');
  }

  public getInstance(item, contextRef): any {
    return ((item || {}).instances || {})[contextRef];
  }

  public getInstanceTextContent(item, contextRef): any {
    let instance = this.getInstance(item, contextRef) || {};
    return (instance).textContent;
  }

  public getUnits(item, contextRef, unitsPool?: any): any {
    let instance = this.getInstance(item, contextRef) || {};
    return (unitsPool || {})[instance.unitRef];
  }

  public getContent(item, contextRef, decimals?: any, unitsPool?: any): any {
    let instance = this.getInstance(item, contextRef) || {};
    let textContent = (instance).textContent || '';
    let instanceDecimals = (((item || {}).instances || {})[contextRef] || {}).decimals;
    let value = textContent;
    let details = '<div class="xbrl-details bg-primary text-white text-left">';
    // details += '<div class="xbrl-details-footnotes">Instance: ' + JSON.stringify(instance) + '</div>';
    let units = (unitsPool || {})[instance.unitRef];
    if (!XbrlUtility.isBlank(instance.unitRef)) {
      if (XbrlUtility.isNumber(textContent)) {
        value = parseFloat(textContent);
        if (XbrlUtility.isNumber(instanceDecimals)) {
          value = value * Math.pow(10, parseFloat(instanceDecimals));
        }
        value = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      }
      details += '<div class="xbrl-details-units bg-info">Units: ' + ((units || {}).display || 'N/A') + '</div>';
    }
    if (!XbrlUtility.isBlank(instance.footnotes)) {
      details += '<div class="xbrl-details-footnotes">Footnotes: ' + (instance.footnotes || []).map((footnote) => footnote.textContent).join('<br />') + '</div>';
    }
    details += '</div>';
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
    // console.log('priorItem: ', JSON.stringify(priorItem));
    let contextRefs = Object.keys((priorItem || {}).instances || {});
    // console.log('contextRefs: ', JSON.stringify(contextRefs));
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
