import { Injectable } from '@angular/core';

@Injectable()
export class XbrlUtility {

  constructor() {
  }

  public static get NS_PREFIXES(): [string] { 
    return ['ns', 'link', 'xsd', 'xs'];
  }

  public static get INS_NS_PREFIXES(): [string] { 
    return ['ns', 'xbrli', 'link', 'xbrldi', 'xsd', 'xs'];
  }

  public static get XSD_TAX(): {tags: any, atts: any} { return {
      tags: {
        r_tag: 'roleType',
        def_tag: 'definition',
        use_tag: 'usedOn',
        e_tag: 'element',
      },
      atts: {
        id_att: 'id',
        name_att: 'name',
        nillable_att: 'nillable',
        substitution_group_att: 'substitutionGroup',
        type_att: 'type',
        period_type_att: 'periodType', // 'xbrli:periodType'
        abstract_att: 'abstract',
        balance_att: 'balance', // 'xbrli:balance'
        e_atts: ['id', 'name', 'nillable', 'substitution_group', 'type', 'period_type', 'abstract', 'balance'],
      }
    // loc hrefs from # map to xsd element ids; loc hrefs starting from # may be duplicative of loc labels but sometimes labels have a random number appended
    // arc froms and tos map to loc labels
    //  roleRef roleURIs map to xlink:roles within file; roleRef href from # maps to xsd; 
    };
  }

  public static processDoc(doc: XMLDocument, fn: (doc: XMLDocument, ns_href: string, ns_prefix: string, nss: {}) => {}): any {
    let ns_href, ns_prefix, nss, returnObj;
    ({ns_href, ns_prefix, nss} = XbrlUtility.getNamespace(doc));
    returnObj = fn(doc, ns_href, ns_prefix, nss);
    return returnObj;
  }

  public static getNamespace(doc: XMLDocument): {ns_href?: string, ns_prefix?: string, nss?: {}} {
    let ns_href: string = doc.lookupNamespaceURI(null);
    let ns_prefix = doc.lookupPrefix(ns_href);
    let nss = {};
    XbrlUtility.INS_NS_PREFIXES.forEach(function(ns) {
      let uri = doc.lookupNamespaceURI(ns)
      if (uri) {
        nss[ns] = uri;
      }
    });
    return {ns_href: ns_href, ns_prefix: ns_prefix, nss: nss}
  }

  public static parseTag(tag: string, ns_href: string, ns_prefix: string, nss: any, doc: XMLDocument, global: boolean=true): any {
    let parseResult = null;
    parseResult = XbrlUtility.parseTagNS(tag, ns_href, ns_prefix, doc, global);
    if (Object.keys(parseResult).length === 0) {
      let nsUris = Object.keys(nss);
      for (let i = 0; i < nsUris.length; i++) {
        let ns_prefix = nsUris[i];
        parseResult = XbrlUtility.parseTagNS(tag, nss[ns_prefix], ns_prefix, doc, global);
        if (Object.keys(parseResult).length > 0) break;
      };
    }
    return parseResult
  }

  public static parseTagNS(tag: string, ns_href: string, ns_prefix: string, doc: XMLDocument, global: boolean=true): any {
    // console.log(xml.getElementsByTagNameNS('http://my.namespace', 'CreationDate'));
    // var response = transport.responseXML.getElementsByTagName("channel");
    // var sunrise = response[0].getElementsByTagNameNS("[Namespace URI]", "astronomy")[0].getAttribute("sunrise");
    // IE? use getElementsByTagName("yweather:astronomy")
    // MSXML? set the "SelectionNamespaces" property on the XML DOMDocument object, then use the non-standard "selectNodes" (or "selectSingleNode") method with an XPath selector. See xml.com/pub/a/2002/06/05/msxml4.html

    // getElementsByTagNameNS(Namespace,"*");
    // 'poss': //*[starts-with(@DependencyType,'poss')]
    // https://developer.mozilla.org/en-US/docs/Introduction_to_using_XPath_in_JavaScript
    // var xpathResult = document.evaluate( xpathExpression, contextNode, namespaceResolver, resultType, result );

    // return doc.getElementsByTagName(tag);
    return doc.getElementsByTagNameNS(ns_href, tag);
  }
//         @r = doc.xpath("//ns:#{tag}", "ns" => ns_href)
//         raise ArgumentError, "Xpath of //ns:#{tag} is blank." if @r.blank?
// for ins
//           @r = doc.xpath("//xbrli:#{tag}")
//           @r = doc.xpath("//link:#{tag}")
// for ins
//               @r = doc.xpath("//xbrldi:#{tag}")
//             @r = doc.css("//#{tag}")
//               @r = doc.xpath("//xsd:#{tag}")
// not for ins?
//                 @r = doc.xpath("//xs:#{tag}")
//                   no_namespace_doc = ""
//                   no_namespace_doc = doc.dup
//                   no_namespace_doc = doc.remove_namespaces!
//                   @r = no_namespace_doc.xpath("//#{tag}")

//         @r = doc.css("/ns|#{tag}", "ns" => ns_href)
//         raise ArgumentError, "CSS of /ns|#{tag} is blank." if @r.blank?
// for ins
//           @r = doc.css("/xbrli|#{tag}")
//           @r = doc.css("/link|#{tag}")
// for ins
//               @r = doc.css("/xbrldi|#{tag}")
//             @r = doc.css("/#{tag}")
//               @r = doc.css("/xsd|#{tag}")
//                 @r = doc.css("/xs|#{tag}")
//                   no_namespace_doc = ""
//                   no_namespace_doc = doc.dup
//                   no_namespace_doc = doc.remove_namespaces!
//                   @r = no_namespace_doc.css("/#{tag}")

  // {roles: [uri: string, def: string, use: string], elements: [any]}
  public static processXsdDoc(doc: XMLDocument): any {
    return XbrlUtility.processDoc(doc, function(doc, ns_href, ns_prefix, nss) {
console.log('doc', doc);
console.log('ns_href', ns_href);
console.log('ns_prefix', ns_prefix);
console.log('nss', JSON.stringify(nss));
      let returnObj  =  {roles: [], elements: []};
      let rolesParse = XbrlUtility.parseTag(XbrlUtility.XSD_TAX.tags.r_tag, ns_href, ns_prefix, nss, doc, true);
console.log('rolesParse', JSON.stringify(rolesParse));
      let roles      = [];
      for (let i = 0; i < rolesParse.length; i++) {
        let role = rolesParse[i];
        let uses = [];
        let useParse = XbrlUtility.parseTag(XbrlUtility.XSD_TAX.tags.use_tag, ns_href, ns_prefix, nss, role, false);
        for (let useParseI = 0; useParseI < useParse.length; useParseI++) {
          let useI = useParse[useParseI];
          uses.push(((useI || {}).textContent || '').trim());
        }
        if (role) {
          roles.push({
            uri: role.getAttribute('roleURI') || '',
            def: ((XbrlUtility.parseTag(XbrlUtility.XSD_TAX.tags.def_tag, ns_href, ns_prefix, nss, role, false)[0] || {}).textContent || '').trim(),
            uses: uses,
          });
          
        }
      };
      returnObj.roles = roles;
console.log('roles', JSON.stringify(roles));
      let elementsParse = XbrlUtility.parseTag(XbrlUtility.XSD_TAX.tags.e_tag, ns_href, ns_prefix, nss, doc, true);
      let elements = [];
      for (let i = 0; i < elementsParse.length; i++) {
        let element = elementsParse[i];
        if (element) {
          let eObj = {};
          XbrlUtility.XSD_TAX.atts.e_atts.forEach(function(att) {
            let attVal = element.getAttribute(att);
            eObj[att] = attVal;
          });
          elements.push(eObj);
        }
      };
      returnObj.elements = elements;
// console.log('elements', JSON.stringify(elements));
console.log('returnObj', JSON.stringify(returnObj));
      return returnObj
    });
  }

}
