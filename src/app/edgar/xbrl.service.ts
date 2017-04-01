import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { XbrlReportInterface, XbrlStatementInterface } from './';

@Injectable()
export class XbrlService {

  public xbrls: XbrlReportInterface = {};
  public selectedXbrl: any;
  public roles: any = [];
  public xbrlStatements: any = [];

  // constructor() {}

  public clearXbrls() {
    this.xbrls = {};
    this.selectedXbrl = null;
    this.roles = [];
    this.xbrlStatements = [];
  }

}
