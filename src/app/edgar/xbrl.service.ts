import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { XbrlUtility } from '../edgar';
import { XbrlVReportInterface, XbrlVStatementInterface, XbrlReportInterface, XbrlStatementInterface } from './';

@Injectable()
export class XbrlService {

  public xbrlVReports: any = {};
  public xbrlVReportKeys: string[] = [];

  // constructor() {}

  public clearXbrlReports() {
    this.xbrlVReports = {};
    this.xbrlVReportKeys = [];
  }

  public addParsedXbrls(xbrlVReportKey: string, parsedXbrls: any[] = [], edgarArchiveFiles: any[]): void {

    let xbrlVReport: XbrlVReportInterface = {
      edgarArchiveFiles,
      xbrls: {},
      roleURIs: [],
      contexts: {},
      units: {},
      xbrlVStatements: {},
    };
    parsedXbrls.map((parsedXbrl) => {
      xbrlVReport.xbrls[parsedXbrl.type] = parsedXbrl;
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
      xbrlVReport.xbrlVStatements[roleURI] = xbrlVStatement;
    });
    xbrlVReport.contexts = ((xbrlVReport.xbrls || {}).ins || {}).contexts;
    xbrlVReport.units = ((xbrlVReport.xbrls || {}).ins || {}).units;
    this.xbrlVReportKeys.push(xbrlVReportKey);
    console.log('this.xbrlVReportKeys: ', JSON.stringify(this.xbrlVReportKeys));
    this.xbrlVReports[xbrlVReportKey] = xbrlVReport;
  }

}
