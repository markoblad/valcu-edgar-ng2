import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
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
  public edgarCikBrowsePathStub: string = 'cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=';
  // https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001375796&owner=exclude&action=getcompany&Find=Search
  // edgarBrowseUrl: string = 'https://valcu.co/?CIK=';
  // proxyUrl: string = 'https://valcu.co';
  // edgarArchiveUrl: string = 'https://www.sec.gov/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public proxyUrl: string = '//localhost:3003/edgar/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public edgarArchivePathStub: string = 'Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  // 0001213900-16-011346
  // 000121390016011346
  // https://www.sec.gov/Archives/edgar/data/0001371128/000121390016011346/0001213900-16-011346-index.htm

  // https://www.sec.gov/Archives/edgar/data/1371128

  // https://www.sec.gov/Archives/edgar/monthly/
  // https://www.sec.gov/Archives/edgar/monthly/xbrlrss-2007-08.xml

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
    return this.http.get(`${this.proxyUrl}${this.edgarArchivePathStub}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getCikArchive(cik: string): Observable<any> {
    let path = this.edgarArchivePathStub + (cik || '').toString().trim().replace(/^0+/, '').trim();
    // console.log('path: ', path);
    let url = this.proxyUrl + path;
    // console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toArchiveUrlObjs(resp, path));
  }

  public getArchive(archivePath: string): Observable<any> {
    let url = this.proxyUrl + (archivePath || '').replace(/^\//, '').trim();
    // console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toArchiveUrlObjs(resp, archivePath));
  }

  public getCikInfo(cik: string): Observable<any> {
    let url = this.proxyUrl + this.edgarCikBrowsePathStub + (cik || '').toString().trim().replace(/^\//, '').trim();
    // console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toCikInfoObj(resp));
  }

  public getParsedXbrls(edgarArchiveFiles: any[] = [], verbose?: boolean): Observable<any> {
    // console.log('this.headers: ', JSON.stringify(this.headers));
    // console.log("getting: ", `${this.edgarBrowseUrl}${cik}`);
    // console.log('getting: ', `${this.edgarArchiveFileUrl}`);
    // return this.http.get(`${this.edgarBrowseUrl}${cik}`, this.headers)
    let observableBatch = [];
    edgarArchiveFiles.forEach((obj) => {
      // console.log('obj.url: ', obj.url);
      let url = this.proxyUrl + (obj.url || '').replace(/^\//, '');
      observableBatch.push(this.http.get(url, this.headers)
        .map(this.checkForError)
        .catch((err) => Observable.throw(err))
        .map((resp) => this.toParsedXbrl(resp, obj.type, verbose))
      );
    });
    return Observable.forkJoin(observableBatch);
  }

  public post(path, body): Observable<any> {
    return this.http.post(
      `${this.proxyUrl}${this.edgarArchivePathStub}${path}`,
      // JSON.stringify(body),
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(`${this.proxyUrl}${this.edgarArchivePathStub}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public archiveUrlObjsToEdgarArchiveFiles(archiveUrlObjs): any {
    let edgarArchiveFiles = [];
    (archiveUrlObjs || []).filter((archiveUrlObj) => archiveUrlObj.href.match(/\.(?:xsd)|(?:xml)$/))
    .forEach((archiveUrlObj) => {
      let edgarArchiveFile = {url: archiveUrlObj.href, type: null};
      if (archiveUrlObj.href.match(/\.xsd$/)) {
        edgarArchiveFile.type = 'xsd';
      } else if (archiveUrlObj.href.match(/\_pre\.xml$/)) {
        edgarArchiveFile.type = 'pre';
      } else if (archiveUrlObj.href.match(/\_def\.xml$/)) {
        edgarArchiveFile.type = 'def';
      } else if (archiveUrlObj.href.match(/\_cal\.xml$/)) {
        edgarArchiveFile.type = 'cal';
      } else if (archiveUrlObj.href.match(/\_lab\.xml$/)) {
        edgarArchiveFile.type = 'lab';
      } else if (archiveUrlObj.href.match(/\-\d{8}\.xml$/) && !archiveUrlObj.href.match(/FilingSummary\.xml$/)) {
        console.log('archiveUrlObj.href: ', archiveUrlObj.href);
        edgarArchiveFile.type = 'ins';
      }
      if (!XbrlUtility.isBlank(edgarArchiveFile.type)) {
        edgarArchiveFiles.push(edgarArchiveFile);
      }
    });
    return XbrlUtility.isBlank(edgarArchiveFiles) ? null : edgarArchiveFiles;
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

  private toParsedXbrl(resp: Response, type, verbose?: boolean) {
    let doc = EdgarArchiveService.toXMLDocumentSelection(resp);
    return XbrlUtility.processTypeDoc(doc, type, verbose);
  }

  private toArchiveUrlObjs(resp: Response, path: string): any[] {
    let txt = resp.text();
    // console.log(txt);
    let doc = new DOMParser().parseFromString(txt, 'text/html');
    let selection = (<Element> doc.lastChild);
    let urlObjs = XbrlUtility.getNodeTagsAtts(selection, 'a', null, ['href'], true, (objs) => objs.filter((obj) => (obj.href || '').indexOf(path) >= 0), null, null, null, null);
    return urlObjs;
  }

  private toCikInfoObj(resp: Response): {} {
    let txt = resp.text();
    // console.log(txt);
    let doc = new DOMParser().parseFromString(txt, 'text/html');
    let selection = (<Element> doc.lastChild);
    // console.log('selection: ', JSON.stringify(selection));
    // let content = selection.querySelectorAll('.companyInfo')[0].textContent;
    let companyName = (selection.querySelectorAll('.companyName')[0].firstChild.textContent || '').trim();
    let cik = (selection.querySelectorAll('.companyName a')[0].firstChild.textContent || '').trim().substring(0, 10);

    console.log('content: ', companyName);
    return {companyName, cik};
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
