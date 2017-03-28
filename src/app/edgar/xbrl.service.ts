import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class XbrlService {

  public xbrls: any = [];
  public selectedXbrl: any;
  public roles: any = [];

  // constructor() {}

  public clearXbrls() {
    this.xbrls = [];
    this.selectedXbrl = null;
  }

}
