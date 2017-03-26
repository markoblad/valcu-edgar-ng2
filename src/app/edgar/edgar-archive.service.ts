import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import { XbrlUtility } from '../edgar';

@Injectable()
export class EdgarArchiveService {

  private static toXMLDocumentSelection(resp: Response) {
    let txt = resp.text();
    let doc = new DOMParser().parseFromString(txt, 'application/xml');
    let selection = (<XMLDocument> doc.lastChild);
    return (selection);
  }

  // edgarBrowseUrl: string = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=';
  public edgarBrowseUrl: string = '//localhost:3003/edgar/cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=';
  // edgarBrowseUrl: string = 'https://valcu.co/?CIK=';
  // edgarArchiveUrl: string = 'https://valcu.co';
  // edgarArchiveUrl: string = 'https://www.sec.gov/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public edgarArchiveUrl: string = '//localhost:3003/edgar/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  // 0001213900-16-011346
  // 000121390016011346
  // https://www.sec.gov/Archives/edgar/data/0001371128/000121390016011346/0001213900-16-011346-index.htm

  // edgarArchiveFileUrl: string = 'https://www.sec.gov/Archives/edgar/data';
  // edgarArchiveFileUrl: string = 'https://www.sec.gov/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml';
  public edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xsd';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_pre.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_def.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_cal.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_lab.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_ins.xml';
  // https://www.sec.gov/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml

  public edgarCompanyKeysObj: any = {};

  private headers: Headers = new Headers({
    // Origin: 'https://valcu.co',
    // Referrer: 'https://valcu.co',
    'Content-Type': 'application/json',
    'Accept': 'application/json'

    // 'Content-Type': '',
    // 'Access-Control-Allow-Origin:': '*',
    // 'Content-Type': 'text/html; charset=utf-8',
    // 'Content-Type': 'application/x-www-form-urlencoded, application/json, text/html; charset=utf-8',
    // Accept: 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    // 'Access-Control-Request-Headers': 'Content-Type, Authorization',
  });

  constructor(private http: Http) {
  }

  public get(path: string): Observable<any> {
    return this.http.get(`${this.edgarArchiveUrl}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getEdgarCompanyKeys(cik: string): Observable<any> {
    // console.log('this.headers: ', JSON.stringify(this.headers));
    // console.log("getting: ", `${this.edgarBrowseUrl}${cik}`);
    // console.log('getting: ', `${this.edgarArchiveFileUrl}`);
    // return this.http.get(`${this.edgarBrowseUrl}${cik}`, this.headers)
    return this.http.get(`${this.edgarArchiveFileUrl}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.toParsedXBRL);
  }

  public post(path, body): Observable<any> {
    return this.http.post(
      `${this.edgarArchiveUrl}${path}`,
      JSON.stringify(body),
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(`${this.edgarArchiveUrl}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  private setHeaders(headers) {
    Object.keys(headers)
    .forEach((header) => this.headers.set(header, headers[header]));
  }

  private getJson(resp: Response) {
    return resp.json();
  }

  private toString(resp: Response) {
    // let body = resp.json();
    let txt = resp.text();
// console.log(txt);
    // return JSON.stringify(body.data || { });
    // let doc = new DOMParser().parseFromString(body.data, 'application/xml');
    let doc = new DOMParser().parseFromString(txt, 'application/xml');
    // let selection = (<Element>doc.firstChild);
    let selection = (<Element> doc.lastChild);
    // let selection = doc;
    let content = selection.textContent;
    // let content = Object.keys(doc).toString();
    // let smalls = selection.querySelectorAll('.small');
    // if (smalls.length > 0) {
    //   content = selection.querySelectorAll('.small')[0].textContent;
    // }
    return (content);
  }

  private toParsedXBRL(resp: Response) {
    let doc = EdgarArchiveService.toXMLDocumentSelection(resp);
    return XbrlUtility.processTypeDoc(doc, XbrlUtility.XSD_STRUCTURE);
    // return XbrlUtility.processTypeDoc(doc, XbrlUtility.PRE_STRUCTURE);
    // return XbrlUtility.processTypeDoc(doc, XbrlUtility.LAB_STRUCTURE);
    // return XbrlUtility.processTypeDoc(doc, XbrlUtility.INS_STRUCTURE);
  }

  private checkForError(resp: Response): Response {
    if (resp.status >= 200 && resp.status < 300) {
      return resp;
    } else {
      const error = new Error(resp.statusText);
      error['response'] = resp;
    }
  }

}
