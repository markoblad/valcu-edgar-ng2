import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { XbrlUtility } from '../edgar';

@Injectable()
export class EdgarArchiveService {

  private static toXMLDocumentSelection(resp: Response) {
    let txt = resp.text();
    let doc = new DOMParser().parseFromString(txt, 'application/xml');
    let selection = (<XMLDocument> doc.lastChild);
    return (selection);
  }

  // public proxyUrl: string = '//localhost:3003/edgar/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public edgarProxyUrl: string = '/edgar/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public edgarCikBrowsePathStub: string = 'cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=';
  // https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001375796&owner=exclude&action=getcompany&Find=Search
  // edgarArchiveUrl: string = 'https://www.sec.gov/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  public edgarArchivePathStub: string = 'Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  // 0001213900-16-011346
  // 000121390016011346
  // https://www.sec.gov/Archives/edgar/data/0001371128/000121390016011346/0001213900-16-011346-index.htm

  // https://www.sec.gov/Archives/edgar/data/1371128

  // https://www.sec.gov/Archives/edgar/monthly/
  // https://www.sec.gov/Archives/edgar/monthly/xbrlrss-2007-08.xml

  public edgarCompanyKeysObj: any = {};

  // http://xbrl.fasb.org/us-gaap/2012/stm/us-gaap-stm-com-2012-01-31.xsd
  public fasbXbrlProxyUrl: string = '/fasb/xbrl/';
  // http://xbrl.fasb.org/us-gaap/2012/stm/
  // public fasbXbrlAcctSystemYearPathStub: string = 'us-gaap-2012-01-31/stm/';
  public fasbXbrlAcctSystemYearPathStub: string = 'us-gaap/2012/stm/';

  private headers: Headers = new Headers({
    // Origin: 'https://valcu.co',
    // Referrer: 'https://valcu.co',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Origin': 'http://localhost:3003'

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
    return this.http.get(`${this.edgarProxyUrl}${this.edgarArchivePathStub}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getCachedCikArchive(cik: string): Observable<any> {
    let unscopedCikArchiveObj = {};
    return this.getCikArchive(cik)
    .flatMap((cikArchiveUrlObjs) => {
      cikArchiveUrlObjs.forEach((cikArchiveUrlObj) => {
        unscopedCikArchiveObj[XbrlUtility.getLastSlash(cikArchiveUrlObj.href)] = cikArchiveUrlObj;
      });
      return this.getCikArchiveCache(cik);
    })
    .map(this.getJson)
    .map((cikArchiveCache) => {
      // console.log('JSON.stringify(cikArchiveCache): ', JSON.stringify(cikArchiveCache));
      let edgarArchiveFileObj = cikArchiveCache.edgarArchiveFileObj;
      cikArchiveCache.xbrl.forEach((cikArchiveObj) => {
        let archive = cikArchiveObj.archive;
        let obj = unscopedCikArchiveObj[archive];
        if (obj) {
          obj.hasXbrl = cikArchiveObj.has_xbrl;
          obj.edgarArchiveFiles = edgarArchiveFileObj[archive];
          console.log('cikArchiveObj: ', JSON.stringify(cikArchiveObj));
          obj.description = cikArchiveObj.description;
        }
        unscopedCikArchiveObj[archive] = obj;
      });
      cikArchiveCache.notXbrl.forEach((cikArchiveObj) => {
        let archive = cikArchiveObj.archive;
        let obj = unscopedCikArchiveObj[archive];
        if (obj) {
          obj.hasXbrl = cikArchiveObj.has_xbrl;
        }
        unscopedCikArchiveObj[archive] = obj;
      });
      return Object.keys(unscopedCikArchiveObj).map((key) => unscopedCikArchiveObj[key]);
    });
  }

  public getCikArchiveCache(cik: string): Observable<any> {
    let url = `/edgar_archives/?cik=` + (cik || '').toString().trim().replace(/^\//, '').trim();
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public cacheCikArchive(cik: string, cikArchiveUrlObjs: any): Observable<any> {
    console.log('cacheCikArchive');
    return this.http.post(
      `/edgar_archives/`,
      {cik, cikArchiveUrlObjs},
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getCikArchive(cik: string): Observable<any> {
    let path = this.edgarArchivePathStub + (cik || '').toString().trim().replace(/^0+/, '').trim();
    // console.log('path: ', path);
    let url = this.edgarProxyUrl + path;
    // console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toArchiveUrlObjs(resp, path));
  }

  public addCachedArchiveToCikObj(cikObj: any): Observable<any> {
    return this.getCachedArchive(cikObj.href)
    .flatMap((archiveObjs) => {
      cikObj.edgarArchiveFiles = archiveObjs;
      return Observable.of(cikObj);
    });
  }

  public getCachedArchive(archivePath: string): Observable<any> {
    let unscopedArchiveObj = {};
    return this.getArchive(archivePath)
    .flatMap((archiveUrlObjs) => {
      // console.log('JSON.stringify(archiveUrlObjs): ', JSON.stringify(archiveUrlObjs));
      archiveUrlObjs.forEach((archiveUrlObj) => {
        unscopedArchiveObj[XbrlUtility.getLastSlash(archiveUrlObj.href)] = archiveUrlObj;
      });
      this.cacheArchive(archivePath, archiveUrlObjs).subscribe();
      // return this.getArchiveCache(archivePath);
      return Observable.of(archiveUrlObjs);

    })
    .map(this.getJson);
    // .map((archiveCache) => {
    //   console.log('JSON.stringify(archiveCache): ', JSON.stringify(archiveCache));
    //   // archiveCache.forEach((archiveObj) => {
    //   //   let obj = unscopedArchiveObj[archiveObj.archive];
    //   //   if (obj) {
    //   //     obj.hasXbrl = archiveObj.has_xbrl;
    //   //   }
    //   // });
    //   return Object.keys(unscopedArchiveObj).map((key) => unscopedArchiveObj[key]);
    // });
  }

  public getArchiveCache(archivePath: string): Observable<any> {
    let archivePathPieces = (archivePath || '').toString().trim().replace(/^\//, '').trim().split('/');
    // let cik = archivePathPieces[archivePathPieces.length - 2];
    let archive = archivePathPieces[archivePathPieces.length - 1];
    let url = `/edgar_archive_files/?archive=` + archive;
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public cacheArchive(archivePath: string, archiveUrlObjs: any): Observable<any> {
    console.log('cacheArchive');
    return this.http.post(
      `/edgar_archives/`,
      {archivePath, archiveUrlObjs},
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getArchive(archivePath: string): Observable<any> {
    let url = this.edgarProxyUrl + (archivePath || '').replace(/^\//, '').trim();
    // console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toArchiveUrlObjs(resp, archivePath));
  }

  public getArchiveXbrlZip(archivePath: string): Observable<any> {
    let url = this.edgarProxyUrl + (archivePath || '').replace(/^\//, '').trim() + '/' + this.archivePathtoXbrlZipFolder(archivePath);
    console.log('getArchiveXbrlZip: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toUnZipped(resp));
  }

  public archivePathtoXbrlZipFolder(archivePath: string): string {
    // https://www.sec.gov/Archives/edgar/data/1564408/000156459017010357/0001564590-17-010357-xbrl.zip
    let archiveFolder = XbrlUtility.getLastSlash((archivePath || '').replace(/^\//, '').replace(/\/$/, '').trim());
    return `${archiveFolder.substring(0, 10)}-${archiveFolder.substring(10, 12)}-${archiveFolder.substring(12)}-xbrl.zip`;
  }

  public getCachedEdgarTerm(term: string): Observable<any> {
    console.log('term: ', term);
    let cached: boolean = false;
    return this.getEdgarTermCache(term)
    .flatMap((obj) => {
      if (XbrlUtility.isBlank(obj)) {
        return this.getCikInfo(term);
      } else {
        console.log('cached');
        cached = true;
        return Observable.of(obj);
      }
    })
    .flatMap((obj2) => {
      if (!cached) {
        this.cacheEdgarTerm(term, obj2).subscribe();
      }
      return Observable.of(obj2);
    })
    .map(this.getJson);
  }

  public getEdgarTermCache(term: string): Observable<any> {
    let url = `/edgar_terms/?term=` + (term || '').toString().trim().replace(/^\//, '').trim();
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson)
    .map(this.toCikInfoObjFromCache);
  }

  public cacheEdgarTerm(term: string, cikInfoObj: any): Observable<any> {
    console.log('cacheEdgarTerm');
    console.log('term2: ', term);
    // console.log('cikInfoObj: ', JSON.stringify(cikInfoObj));
    return this.http.post(
      `/edgar_terms/`, // /${xbrlVReport.xbrlVReportKey}
      {term, cikInfoObj},
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getCikInfo(term: string): Observable<any> {
    let url = this.edgarProxyUrl + this.edgarCikBrowsePathStub + (term || '').toString().trim().replace(/^\//, '').trim();
    console.log('url: ', url);
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map((resp) => this.toCikInfoObj(resp));
  }

  public getParsedXbrls(edgarArchiveFiles: any[] = [], verbose?: boolean): Observable<any> {
    console.log('edgarArchiveFiles: ', JSON.stringify(edgarArchiveFiles));
    // console.log('this.headers: ', JSON.stringify(this.headers));
    // console.log('getting: ', `${this.edgarArchiveFileUrl}`);
    let observableBatch = [];
    edgarArchiveFiles.forEach((obj) => {
      // console.log('obj.url: ', obj.url);
      let proxyUrl = obj.source === 'fasb' ? this.fasbXbrlProxyUrl : this.edgarProxyUrl;
      let pathStub = obj.source === 'fasb' ? this.fasbXbrlAcctSystemYearPathStub : this.edgarArchivePathStub;
      // VM38693:1 GET http://localhost:3003/fasb/xbrl/us-gaap-2012-01-31/stm/us-gaap-stm-sfp-cls-cal-2012-01-31.xml
      let url = proxyUrl + pathStub + (obj.url || '').replace(/^\//, '').replace(pathStub, '');
      observableBatch.push(this.http.get(url, this.headers)
        .map(this.checkForError)
        .catch((err) => Observable.throw(err))
        .map((resp) => this.toParsedXbrl(resp, obj.type, verbose))
      );
    });
    return Observable.forkJoin(observableBatch);
  }

  public getXbrlVReport(xbrlVReportKey: string): Observable<any> {
    return this.getXbrlVReportCache(xbrlVReportKey)
    .flatMap((json) => {
      console.log('json: ', JSON.stringify(json));
      if (XbrlUtility.isBlank(json)) {
        return Observable.of([]);
      } else {
        return this.getXbrlVReportZip((json || {}).url);
      }
    });
  }

  public getXbrlVReportZip(url: string): Observable<any> {
    return this.http.get(
      url,
      {headers: new Headers({
        // 'Content-Type': 'application/javascript',
        'Content-Type': 'application/json',
        // 'Accept': 'application/json',
        // 'Accept-Encoding': 'gzip',
        'Content-Encoding': 'gzip',
        // 'Content-Encoding': 'application/x-gzip',
        // 'Content-Encoding': 'application/gzip',
      })}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public getXbrlVReportCache(xbrlVReportKey: string): Observable<any> {
    console.log('xbrlVReportKey: ', xbrlVReportKey);
    let url = `/xbrl_v_reports/?archive=` + (xbrlVReportKey || '').toString().trim().replace(/^\//, '').trim();
    return this.http.get(url)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public post(path, body): Observable<any> {
    return this.http.post(
      `${this.edgarProxyUrl}${this.edgarArchivePathStub}${path}`,
      // JSON.stringify(body),
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public delete(path: string): Observable<any> {
    return this.http.delete(`${this.edgarProxyUrl}${this.edgarArchivePathStub}${path}`, this.headers)
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  public archiveUrlObjsToEdgarArchiveFiles(archiveUrlObjs): any {
    let edgarArchiveFiles = [];
    (archiveUrlObjs || [])
    .map((archiveUrlObj) => {
      if (!archiveUrlObj.href) {
        archiveUrlObj.href = this.edgarArchivePathStub + (archiveUrlObj.cik || '') + '/' +
        (archiveUrlObj.archive || '') + '/' + (archiveUrlObj.file_name || '');
      }
      return archiveUrlObj;
    })
    .filter((archiveUrlObj) => archiveUrlObj.href.match(/\.(?:xsd)|(?:xml)$/))
    .forEach((archiveUrlObj) => {
      let edgarArchiveFile = {url: archiveUrlObj.href, type: null};
      let href = archiveUrlObj.href;
      if (href.match(/\.xsd$/)) {
        edgarArchiveFile.type = 'xsd';
      } else if (href.match(/\_pre\.xml$/)) {
        edgarArchiveFile.type = 'pre';
      } else if (href.match(/\_def\.xml$/)) {
        edgarArchiveFile.type = 'def';
      } else if (href.match(/\_cal\.xml$/)) {
        edgarArchiveFile.type = 'cal';
      } else if (href.match(/\_lab\.xml$/)) {
        edgarArchiveFile.type = 'lab';
      } else if (href.match(/\-\d{8}\.xml$/) && !href.match(/FilingSummary\.xml$/)) {
        console.log('archiveUrlObj.href: ', href);
        edgarArchiveFile.type = 'ins';
      }
      if (!XbrlUtility.isBlank(edgarArchiveFile.type)) {
        edgarArchiveFiles.push(edgarArchiveFile);
      }
    });
    return XbrlUtility.isBlank(edgarArchiveFiles) ? null : edgarArchiveFiles;
  }

  public postXbrlVReport(xbrlVReport): Observable<any> {
    // console.log('xbrlvreport:', JSON.stringify({data: xbrlVReport}));
    console.log('posting report');
    return this.http.post(
      `/xbrl_v_reports/`, // /${xbrlVReport.xbrlVReportKey}
      {data: xbrlVReport},
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch((err) => Observable.throw(err))
    .map(this.getJson);
  }

  private setHeaders(headers) {
    Object.keys(headers)
    .forEach((header) => this.headers.set(header, headers[header]));
  }

  private unzip(resp: Response) {
    return resp instanceof Response ? resp.json() : resp;
  }

  private getJson(resp: Response) {
//     if (!(resp instanceof Response)) {
// console.log('json resp' + JSON.stringify(resp));
//     }
// {"_body":"...","status":200,"ok":true,"statusText":"OK",
// "headers":{"Last-Modified":["Fri"," 28 Jul 2017 11:33:53 GMT"],
// "Content-Type":["application/gzip"],"Cache-Control":["public"," max-age=31536000"]},
// "type":2,"url":"..."}
    return resp instanceof Response ? resp.json() : resp;
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
    let urlObjs = XbrlUtility.getNodeTagsAtts(
      selection,
      'a',
      null,
      ['href'],
      true,
      (objs) => objs.filter((obj) => (obj.href || '').indexOf(path) >= 0),
      null,
      null,
      null,
      null
    );
    return urlObjs;
  }

  private toUnZipped(resp: Response): any {
    let zipObj = resp.text();
    console.log('zipObj: ', zipObj);
    return 'return';
  }

  private toCikInfoObjFromCache(obj: any): {} {
    if (!obj) {
      return null;
    }
    obj.companyName = obj.entity_name;
    return obj;
  }

  private toCikInfoObj(resp: Response): {} {
    let txt = resp.text();
    // console.log(txt);
    let doc = new DOMParser().parseFromString(txt, 'text/html');
    let selection = (<Element> doc.lastChild);
    // console.log('selection: ', JSON.stringify(selection));
    // let content = selection.querySelectorAll('.companyInfo')[0].textContent;
    let companyName = (((selection.querySelectorAll('.companyName')[0] || {firstChild: null}).firstChild || {}).textContent || '').trim();
    let cik = (((selection.querySelectorAll('.companyName a')[0] || {firstChild: null}).firstChild || {}).textContent || '').trim().substring(0, 10);

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
