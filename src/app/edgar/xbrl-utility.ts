import { Injectable } from '@angular/core';

@Injectable()
export class XbrlUtility {

  constructor() {
  }

  public static get NS_PREFIXES(): [string] { 
    // return ['ns', 'link', 'xsd', 'xs'];
    return ['ns', 'link', 'xlink', 'xsd', 'xs'];
  }

  public static get INS_NS_PREFIXES(): [string] { 
    return ['ns', 'xbrli', 'link', 'xlink', 'xbrldi', 'xsd', 'xs'];
    // xbrldt
  }

  public static get XSD_TAX(): {tags: any, e_tag_atts: any} { return {
      tags: {
        r_tag: 'roleType',
        def_tag: 'definition',
        use_tag: 'usedOn',
        e_tag: 'element',
      },
      e_tag_atts: [
        'id',
        'name',
        'nillable',
        'substitutionGroup',
        'type',
        'periodType', // 'xbrli:periodType'
        'abstract',
        'balance', // 'xbrli:balance'
      ]
    // loc hrefs from # map to xsd element ids; loc hrefs starting from # may be duplicative of loc labels but sometimes labels have a random number appended
    // arc froms and tos map to loc labels
    //  roleRef roleURIs map to xlink:roles within file; roleRef href from # maps to xsd; 
    };
  }

  public static get PRE_TAX(): {tags: any, r_tag_atts: any, p_tag_atts: any, l_tag_atts: any, pa_tag_atts: any} { return {
      tags: {
        r_tag: 'roleRef',
        p_tag: 'presentationLink',
        l_tag: 'loc',
        pa_tag: 'presentationArc'
      },
      r_tag_atts: [
        'roleURI',
        'href', // 'xlink:href'
        'type', // 'xlink:type'
      ],
      p_tag_atts: [
        'role', //xlink:role
        'type', // 'xlink:type'
        'title', // 'xlink:title'
      ],
      l_tag_atts: [
        'href', // 'xlink:href'
        'label', // 'xlink:label'
        'type', // 'xlink:type'
      ],
      pa_tag_atts: [
        'order',
        'preferredLabel',
        'arcrole', // 'xlink:arcrole'
        'from', // 'xlink:from'
        'to', // 'xlink:to',
        'type', // 'xlink:type'
        'priority',
        'use',
      ]
      // roleRef href connects to xsd at #; roleRef roleURI connects to pLink xlink:xrole
      // loc href conncects to xsd; loc xlink:label connects to pArc; pArc connects to loc xlink:labels
      // preferredLabel connects to lab.xml link:label xlink:role
      //  some locs points to dei hrefs
    };
  }

  public static get DEF_TAX(): {tags: any, r_tag_atts: any, d_tag_atts: any, l_tag_atts: any, da_tag_atts: any} { return {
      tags: {
        r_tag: 'roleRef',
        d_tag: 'definitionLink',
        l_tag: 'loc',
        da_tag: 'definitionArc'
      },
      r_tag_atts: [
        'roleURI',
        'href', // 'xlink:href'
        'type', // 'xlink:type'
      ],
      d_tag_atts: [
        'role', //xlink:role
        'type', // 'xlink:type'
        'title', // 'xlink:title'
      ],
      l_tag_atts: [
        'href', // 'xlink:href'
        'label', // 'xlink:label'
        'type', // 'xlink:type'
      ],
      da_tag_atts: [
        'order',
        'arcrole', // 'xlink:arcrole'
        'from', // 'xlink:from'
        'to', // 'xlink:to',
        'type', // 'xlink:type'
        'closed', // 'xbrldt:close'
        'contextElement', //xbrldt:contextElement
        'targetRole', // xbrldt:targetRole
      ]
    };
  }



  public static processDoc(doc: XMLDocument, fn: (doc: XMLDocument, ns_href: string, ns_prefix: string, nss: {}) => {}): any {
    let ns_href, ns_prefix, nss, returnObj;
    ({ns_href, ns_prefix, nss} = XbrlUtility.getNamespace(doc));
console.log('doc', doc);
    returnObj = fn(doc, ns_href, ns_prefix, nss);
    return returnObj;
  }

  public static getNamespace(doc: XMLDocument): {ns_href?: string, ns_prefix?: string, nss?: {}} {
    let ns_href: string = doc.lookupNamespaceURI(null);
    let ns_prefix = doc.lookupPrefix(ns_href);
    let nss = {};
    XbrlUtility.INS_NS_PREFIXES.forEach(function(ns) {
      let uri = doc.lookupNamespaceURI(ns)
console.log('ns: ', ns);
console.log('ns uri: ', uri);
      if (uri) {
        nss[ns] = uri;
      }
    });
console.log('ns_href', ns_href);
console.log('ns_prefix', ns_prefix);
console.log('nss', JSON.stringify(nss));
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

  public static getNodeAtts(node, atts: any, ns_href, ns_prefix, nss): any {
    if (node && atts) {
// console.log('atts: ', JSON.stringify(atts));
      let obj = {};
// console.log('nsUris: ', nss);
      let nsUris = Object.keys(nss);
      (atts || []).forEach(function(att) {
      let attVal = node.getAttribute(att);
      if (attVal === null) {
        for (let i = 0; i < nsUris.length; i++) {
          let ns_prefix = nsUris[i];
  // console.log('ns_prefix: ', ns_prefix);
          attVal = XbrlUtility.getNodeAttNS(node, att, nss[ns_prefix]);
          if (attVal !== null) break
        };
      }
      obj[att] = attVal;
      });
      return obj
    }
  }

  public static getNodeAttNS(node, att: string, ns_href): any {
    // return node.getAttribute(att);
    return node.getAttributeNS(ns_href, att);
  }

  public static getNodeTagsAtts(node, tag: string, tagAtts: [string], ns_href, ns_prefix, nss): any {
    if (node && tag && tagAtts) {
      let parse = XbrlUtility.parseTag(tag, ns_href, ns_prefix, nss, node, false);
      let objs      = [];
      for (let i = 0; i < parse.length; i++) {
        let parseI = parse[i];
        if (parseI) {
          let nestedObj = {};
          nestedObj = XbrlUtility.getNodeAtts(parseI, tagAtts, ns_href, ns_prefix, nss);
          if (nestedObj) objs.push(nestedObj);
        }
      }
      return objs
    }
  }


  // {roles: [uri: string, def: string, use: string], elements: [any]}
  public static processXsdDoc(doc: XMLDocument): any {
    return XbrlUtility.processDoc(doc, function(doc, ns_href, ns_prefix, nss) {
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
// console.log('roles', JSON.stringify(roles));
      let elementsParse = XbrlUtility.parseTag(XbrlUtility.XSD_TAX.tags.e_tag, ns_href, ns_prefix, nss, doc, true);
      let elements = [];
      for (let i = 0; i < elementsParse.length; i++) {
        let element = elementsParse[i];
        if (element) {
          let eObj = XbrlUtility.getNodeAtts(element, XbrlUtility.XSD_TAX.e_tag_atts, ns_href, ns_prefix, nss);
          if (eObj) elements.push(eObj);
        }
      };
      returnObj.elements = elements;
// console.log('elements', JSON.stringify(elements));
// console.log('returnObj', JSON.stringify(returnObj));
      return returnObj
    });
  }

  public static processPreDoc(doc: XMLDocument): any {
    return XbrlUtility.processDoc(doc, function(doc, ns_href, ns_prefix, nss) {
      let returnObj  =  {roles: [], plinks: []};
      let rolesParse = XbrlUtility.parseTag(XbrlUtility.PRE_TAX.tags.r_tag, ns_href, ns_prefix, nss, doc, true);
console.log('rolesParse', JSON.stringify(rolesParse));


      let roles      = [];
      for (let i = 0; i < rolesParse.length; i++) {
        let roleParse = rolesParse[i];
        if (roleParse) {
          let obj = XbrlUtility.getNodeAtts(roleParse, XbrlUtility.PRE_TAX.r_tag_atts, ns_href, ns_prefix, nss);
          if (obj) roles.push(obj);
        }
      };
      returnObj.roles = roles;
// console.log('roles', JSON.stringify(roles));

      let plinksParse = XbrlUtility.parseTag(XbrlUtility.PRE_TAX.tags.p_tag, ns_href, ns_prefix, nss, doc, true);
      let plinks      = [];
      for (let i = 0; i < plinksParse.length; i++) {
        let plinkParse = plinksParse[i];


        let obj = {locs: [], prearcs: []};
        if (plinkParse) {
          obj = XbrlUtility.getNodeAtts(plinkParse, XbrlUtility.PRE_TAX.p_tag_atts, ns_href, ns_prefix, nss);
        }
        obj.locs = XbrlUtility.getNodeTagsAtts(plinkParse, XbrlUtility.PRE_TAX.tags.l_tag, XbrlUtility.PRE_TAX.l_tag_atts, ns_href, ns_prefix, nss)
        obj.prearcs = XbrlUtility.getNodeTagsAtts(plinkParse, XbrlUtility.PRE_TAX.tags.pa_tag, XbrlUtility.PRE_TAX.pa_tag_atts, ns_href, ns_prefix, nss)
        if (obj) plinks.push(obj);
      };
      returnObj.plinks = plinks;
    // @pre_h = nil if @pre_h["roles"].blank? || @pre_h["plinks"].blank?


// console.log('elements', JSON.stringify(elements));
// console.log('returnObj', JSON.stringify(returnObj));
      return returnObj
    });
  }

  public static processDefDoc(doc: XMLDocument): any {
    return XbrlUtility.processDoc(doc, function(doc, ns_href, ns_prefix, nss) {
      let returnObj  =  {roles: [], dlinks: []};
      let rolesParse = XbrlUtility.parseTag(XbrlUtility.DEF_TAX.tags.r_tag, ns_href, ns_prefix, nss, doc, true);
console.log('rolesParse', JSON.stringify(rolesParse));


      let roles      = [];
      for (let i = 0; i < rolesParse.length; i++) {
        let roleParse = rolesParse[i];
        if (roleParse) {
          let obj = XbrlUtility.getNodeAtts(roleParse, XbrlUtility.DEF_TAX.r_tag_atts, ns_href, ns_prefix, nss);
          if (obj) roles.push(obj);
        }
      };
      returnObj.roles = roles;
// console.log('roles', JSON.stringify(roles));

      let dlinksParse = XbrlUtility.parseTag(XbrlUtility.DEF_TAX.tags.d_tag, ns_href, ns_prefix, nss, doc, true);
      let dlinks      = [];
      for (let i = 0; i < dlinksParse.length; i++) {
        let dlinkParse = dlinksParse[i];


        let obj = {locs: [], defarcs: []};
        if (dlinkParse) {
          obj = XbrlUtility.getNodeAtts(dlinkParse, XbrlUtility.DEF_TAX.d_tag_atts, ns_href, ns_prefix, nss);
        }
        obj.locs = XbrlUtility.getNodeTagsAtts(dlinkParse, XbrlUtility.DEF_TAX.tags.l_tag, XbrlUtility.DEF_TAX.l_tag_atts, ns_href, ns_prefix, nss)
        obj.defarcs = XbrlUtility.getNodeTagsAtts(dlinkParse, XbrlUtility.DEF_TAX.tags.pa_tag, XbrlUtility.DEF_TAX.pa_tag_atts, ns_href, ns_prefix, nss)
        if (obj) dlinks.push(obj);
      };
      returnObj.dlinks = dlinks;
    // @pre_h = nil if @pre_h["roles"].blank? || @pre_h["dlinks"].blank?


// console.log('elements', JSON.stringify(elements));
// console.log('returnObj', JSON.stringify(returnObj));
      return returnObj
    });
  }

}
