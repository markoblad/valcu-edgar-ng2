import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';


@Injectable()
export class EdgarArchiveService {
  headers: Headers = new Headers({

    // Origin: 'https://valcu.co',
    // Referrer: 'https://valcu.co',
    'Content-Type': 'application/json',
    Accept: 'application/json'

    // 'Content-Type': '',
    // 'Access-Control-Allow-Origin:': '*',
    // 'Content-Type': 'text/html; charset=utf-8',
    // 'Content-Type': 'application/x-www-form-urlencoded, application/json, text/html; charset=utf-8',
    // Accept: 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    // 'Access-Control-Request-Headers': 'Content-Type, Authorization',
  });

  // edgarBrowseUrl: string = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=";
  edgarBrowseUrl: string = "//localhost:3003/edgar/cgi-bin/browse-edgar?action=getcompany&type=10-k&count=10&CIK=";
  // edgarBrowseUrl: string = "https://valcu.co/?CIK=";
  // edgarArchiveUrl: string = 'https://valcu.co';
  // edgarArchiveUrl: string = 'https://www.sec.gov/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  edgarArchiveUrl: string = '//localhost:3003/edgar/Archives/edgar/data/'; // ${cik}/${accountNumberNoDash}/${accountNumber}-index.htm
  // 0001213900-16-011346
  // 000121390016011346
  // https://www.sec.gov/Archives/edgar/data/0001371128/000121390016011346/0001213900-16-011346-index.htm

  // edgarArchiveFileUrl: string = 'https://www.sec.gov/Archives/edgar/data';
  // edgarArchiveFileUrl: string = 'https://www.sec.gov/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xsd';
  // edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_pre.xml';
  edgarArchiveFileUrl: string = '//localhost:3003/edgar/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_def.xml';
  // https://www.sec.gov/Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml

  edgarCompanyKeysObj: any = {};

  constructor(private http: Http) {
  }

  get(path: string): Observable<any> {
    return this.http.get(`${this.edgarArchiveUrl}${path}`, this.headers)
    .map(this.checkForError)
    .catch(err => Observable.throw(err))
    .map(this.getJson);
  }

  getEdgarCompanyKeys(cik: string): Observable<any> {
console.log('this.headers: ', JSON.stringify(this.headers));
// console.log("getting: ", `${this.edgarBrowseUrl}${cik}`);
console.log("getting: ", `${this.edgarArchiveFileUrl}`);
    // return this.http.get(`${this.edgarBrowseUrl}${cik}`, this.headers)
    return this.http.get(`${this.edgarArchiveFileUrl}`, this.headers)
    .map(this.checkForError)
    .catch(err => Observable.throw(err))
    .map(this.toXMLDocumentSelection);
  }

  post(path, body): Observable<any> {
    return this.http.post(
      `${this.edgarArchiveUrl}${path}`,
      JSON.stringify(body),
      {headers: this.headers}
    )
    .map(this.checkForError)
    .catch(err => Observable.throw(err))
    .map(this.getJson);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.edgarArchiveUrl}${path}`, this.headers)
    .map(this.checkForError)
    .catch(err => Observable.throw(err))
    .map(this.getJson);
  }

  setHeaders(headers) {
    Object.keys(headers)
    .forEach(header => this.headers.set(header, headers[header]));
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
    let selection = (<Element>doc.lastChild);
    // let selection = doc;
    let content = selection.textContent;
    // let content = Object.keys(doc).toString();
    // let smalls = selection.querySelectorAll('.small');
    // if (smalls.length > 0) {
    //   content = selection.querySelectorAll('.small')[0].textContent;
    // }
    return (content);
  }

  private toXMLDocumentSelection(resp: Response) {
    let txt = resp.text();
    let doc = new DOMParser().parseFromString(txt, 'application/xml');
    let selection = (<Element>doc.lastChild);
    return (selection);
  }

  private checkForError(resp: Response): Response {
    if (resp.status >= 200 && resp.status < 300) {
      return resp;
    } else {
      const error = new Error(resp.statusText);
      error['response'] = resp;
    }
  }

  // def self.get_edgar_company_keys(statement_model)
  //   this.edgarCompanyKeysObj["cik"] = @statement_model.company.cik
  //   this.edgarCompanyKeysObj["trimmed_cik"]= this.edgarCompanyKeysObj["cik"].to_i.to_s

  //   #Obtain the edgar account number (doesn't work for non-10-k filers, e.g., foreign private issuers filing 20-f)
  //   # edgar_search_url = "http://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=#{this.edgarCompanyKeysObj['cik']}&type=10-k&count=10"
  //   edgar_search_url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=#{this.edgarCompanyKeysObj['cik']}&type=10-k&count=10"
  //   edgar_doc = Nokogiri::HTML(open(edgar_search_url))
  //   edgar_acc_item =  edgar_doc.at_css(".small")
  //   this.edgarCompanyKeysObj["edgar_acc_no"] = /\d\d\d\d\d\d\d\d\d\d-\d\d-\d\d\d\d\d\d/.match(edgar_acc_item.text).to_s
  //   this.edgarCompanyKeysObj["edgar_acc_no_no_dash"] = this.edgarCompanyKeysObj["edgar_acc_no"].gsub("-","")
  //   this.edgarCompanyKeysObj["filing_type_num"] = this.edgarCompanyKeysObj["edgar_acc_no"][0..9]
  //   this.edgarCompanyKeysObj["filing_year_last_two"] = this.edgarCompanyKeysObj["edgar_acc_no"][11..12]
  //   this.edgarCompanyKeysObj["file_tag_num"] = this.edgarCompanyKeysObj["edgar_acc_no"][14..19]
  //   return this.edgarCompanyKeysObj
  //   #edgar_file_date = edgar_doc.at_css("tr:nth-child(2) td:nth-child(4)").text
  // end

  // def self.get_edgar_report_keys(statement_model, edgar_company_keys_h)
  //   @statement_model = statement_model
  //   this.edgarCompanyKeysObj = edgar_company_keys_h
  //   @edgar_report_keys_h = Hash.new

  //   #Obtain the edgar reporting date
  //   edgar_filing_index_url = "https://www.sec.gov/Archives/edgar/data/#{this.edgarCompanyKeysObj['cik']}/#{this.edgarCompanyKeysObj['edgar_acc_no_no_dash']}/" \
  //     "#{this.edgarCompanyKeysObj['filing_type_num']}-#{this.edgarCompanyKeysObj['filing_year_last_two']}-#{this.edgarCompanyKeysObj['file_tag_num']}-index.htm"
  //   edgar_form_index_doc = Nokogiri::HTML(open(edgar_filing_index_url))
  //   @edgar_report_keys_h["edgar_reporting_date"] =  edgar_form_index_doc.at_css(".formGrouping:nth-child(2) :nth-child(2)").text
  //   @edgar_report_keys_h["reporting_date"] = @edgar_report_keys_h["edgar_reporting_date"].gsub("-","")

  //   #Obtain the xml doc prefix (the ticker?)
  //   edgar_filing_file_url = "https://www.sec.gov/Archives/edgar/data/#{this.edgarCompanyKeysObj['trimmed_cik']}/#{this.edgarCompanyKeysObj['edgar_acc_no_no_dash']}/"
  //   edgar_filing_file_doc = Nokogiri::HTML(open(edgar_filing_file_url))
  //   edgar_filing_file_links =  edgar_filing_file_doc.css("a")
  //   edgar_xml_instance_ext = "-" + @edgar_report_keys_h["reporting_date"] + ".xml"
  //   edgar_filing_file_links.each do |link|
  //     if link.attribute('href').value.to_s.include?(edgar_xml_instance_ext)
  //       @ticker = link.attribute('href').value.to_s.gsub(edgar_xml_instance_ext, "")
  //     end
  //   end
  //   @edgar_report_keys_h["ticker"] = @ticker
  //   return @edgar_report_keys_h
  // end


  // def self.process_edgar_url(url)
  //   limiter = 0
  //   begin
  //     limiter += 1
  //     doc = Nokogiri::XML(open(URI.encode(url))) {|config| config.recover.nonet}
  //   rescue Exception => e
  //     if limiter < MAXIMUM_RETRIES
  //       retry
  //     else
  //       doc = nil
  //       str = "Failure in EdgarFileGrabber::process_____file to parse doc using Nokogiri::XML for url #{url}."
  //        ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarFileGrabber", calling_method: __method__, parameters: {url: url}, description: str, message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //      end
  //   end
  //   begin
  //     ns_href = doc.root.namespace.href
  //   rescue
  //     ns_href = ""
  //   end
  //   begin
  //     ns_prefix = doc.root.namespace.prefix
  //   rescue
  //     ns_prefix = ""
  //   end
  //   return doc, ns_href, ns_prefix
  // end

}
