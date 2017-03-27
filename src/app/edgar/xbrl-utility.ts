import { Injectable } from '@angular/core';

@Injectable()
export class XbrlUtility {

  // constructor() {}

  public static get nsPrefixES(): [string] {
    // return ['ns', 'link', 'xsd', 'xs'];
    return ['ns', 'link', 'xlink', 'xsd', 'xs'];
  }

  public static get INS_nsPrefixES(): [string] {
    return ['ns', 'xbrli', 'link', 'xlink', 'xbrldi', 'xsd', 'xs'];
    // xbrldt
  }

  public static get XSD_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        roleType: {
          rename: 'roles',
          atts: [
            'roleURI',
          ],
          tags: {
            definition: {
              rename: 'def',
              textContent: true,
              transformFn: XbrlUtility.justTextTransform,
            },
            usedOn: {
              rename: 'uses',
              textContent: true,
              transformFn: XbrlUtility.arrayedTextTransform,
            },
          },
        },
        element: {
          rename: 'elements',
          atts: [
            'id',
            'name',
            'nillable',
            'substitutionGroup',
            'type',
            'periodType', // 'xbrli:periodType'
            'abstract',
            'balance', // 'xbrli:balance'
          ],
        },
      },
    // loc hrefs from # map to xsd element ids; loc hrefs starting from # may be duplicative of loc labels but sometimes labels have a random number appended
    // arc froms and tos map to loc labels
    //  roleRef roleURIs map to xlink:roles within file; roleRef href from # maps to xsd;
    };
  }

  public static get PRE_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        roleRef: {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        presentationLink: {
          rename: 'presentationLinks',
          atts: [
            'role', // xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            loc: {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            presentationArc: {
              rename: 'presentationArcs',
              atts: [
                'order',
                'preferredLabel',
                'arcrole', // 'xlink:arcrole'
                'from', // 'xlink:from'
                'to', // 'xlink:to',
                'type', // 'xlink:type'
                'priority',
                'use',
              ],
            },
          },
        },
      },
      // roleRef href connects to xsd at #; roleRef roleURI connects to pLink xlink:xrole
      // loc href conncects to xsd; loc xlink:label connects to pArc; pArc connects to loc xlink:labels
      // preferredLabel connects to lab.xml link:label xlink:role
      //  some locs points to dei hrefs
    };
  }

  public static get DEF_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        roleRef: {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        definitionLink: {
          rename: 'definitionLinks',
          atts: [
            'role', // xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            loc: {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            definitionArc: {
              rename: 'definitionArcs',
              atts: [
                'order',
                'arcrole', // 'xlink:arcrole'
                'from', // 'xlink:from'
                'to', // 'xlink:to',
                'type', // 'xlink:type'
                'closed', // 'xbrldt:close'
                'contextElement', // xbrldt:contextElement
                'targetRole', // xbrldt:targetRole
              ],
            },
          },
        },
      },
    };
  }

  public static get CAL_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        roleRef: {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        calculationLink: {
          rename: 'calculationLinks',
          atts: [
            'role', // xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            loc: {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            calculationArc: {
              rename: 'calculationArcs',
              atts: [
                'order',
                'weight',
                'arcrole', // 'xlink:arcrole'
                'from', // 'xlink:from'
                'to', // 'xlink:to',
                'type', // 'xlink:type'
                'priority',
                'use',
              ],
            },
          },
        },
      },
    };
  }

  public static get LAB_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        roleRef: {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        label: {
          rename: 'labels',
          atts: [
            'id',
            'label', // xlink:label
            'role', // xlink:role
            'type', // 'xlink:type'
            'lang', // 'xml:lang'
          ],
          textContent: true,
        },
        loc: {
          rename: 'locs',
          atts: [
            'href', // 'xlink:href'
            'label', // 'xlink:label'
            'type', // 'xlink:type'
          ],
        },
        labelArc: {
          rename: 'labelArcs',
          atts: [
            'order',
            'arcrole', // 'xlink:arcrole'
            'from', // 'xlink:from'
            'to', // 'xlink:to',
            'type', // 'xlink:type'
          ],
        },
      },
      // loc href maps to xsd; loc label maps to labelArc from; labelArc to maps to label label
      // roleRef dont seem to be come in in the lab files
    };
  }

  public static get INS_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        context: { // xbrli:context
          rename: 'contexts',
          atts: [
            'id',
          ],
          tags: {
            entity: { // xbrli:entity
              tags: {
                identifier: { // xbrli:identifier
                  atts: [
                    'scheme',
                  ],
                  textContent: true,
                },
                segment: { // xbrli:segment
                  rename: 'segments',
                  textContent: true,
                  tags: {
                    explicitMember: { // xbrldi:explicitMember
                      atts: [
                        'dimension'
                      ],
                      textContent: true,

                    }
                  },
                }
              }
            },
            period: { // xbrli:period
              tags: {
                startDate: { // xbrli:startDate
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
                endDate: { // xbrli:endDate
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
                instant: { // xbrli:instant
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
              },
              transformFn: XbrlUtility.firstArrayItemTransform,
            },
            scenario: {
              rename: 'scenarios',
              textContent: true,
            }
          }
        },
        unit: { // xbrli:unit
          rename: 'units',
          atts: [
            'id',
          ],
          tags: {
            measure: { // xbrli:measure
              textContent: true,
            },
            divide: { // xbrli:divide
              textContent: false,
              tags: {
                unitNumerator: { // xbrli:unitNumerator
                  textContent: true,
                  tags: {
                    measure: { // xbrli:measure
                      textContent: true,
                    },
                  },
                },
                unitDenominator: { // xbrli:unitDenominator
                  textContent: true,
                  tags: {
                    measure: { // xbrli:measure
                      textContent: true,
                    },
                  },
                },
              },
            },
          },
        },
        loc: { // link:loc
          rename: 'locs',
          atts: [
            'href', // 'xlink:href'
            'label', // 'xlink:label'
            'type', // 'xlink:type'
          ],
        },
        footnoteArc: { // link:footnoteArc
          rename: 'footnoteArcs',
          atts: [
            'order',
            'arcrole', // 'xlink:arcrole'
            'from', // 'xlink:from'
            'to', // 'xlink:to'
            'type', // 'xlink:type'
          ],
        },
        footnote: { // link:loc
          rename: 'footnotes',
          textContent: true,
          atts: [
            'label', // 'xlink:label'
            'role', // 'xlink:role'
            'type', // 'xlink:type'
            'lang', // 'xml:lang'
          ],
        },
        // @ins_h["footnotes"] = begin EdgarBuilder::construct_footnotes(@ins_h) || [] rescue [] end
        // '...': {
        //   textContent: true,
        //   atts: [
        //     'contextRef',
        //     'decimals',
        //     'id',
        //     'unitRef',
        //     'nil',
        //     'lang', //'xml:lang'
        //   ],
        // },
      },
      // @ins_h["doc"] = begin doc rescue "" end
      // @ins_h = nil if @ins_h["doc"].blank?
    };
    // #item names map to xsd elements, with first underscore changed to colon;
    // #item unitRefs map internally to unit id
    // #item contextRefs map interanlly to context ids
    // #xbrldi:explicitMember dimension under contexts maps to ?;
    // # explicitMember text (colon needs to be changed to underscore) maps to xsd element id where it is in the company's namespace
    // #entity is cik

    //  #item parsing doesnt occur here, but in EdgarBuilder
  }

  public static justTextTransform(objs) { return ((objs || [])[0] || {}).textContent; }

  public static arrayedTextTransform(objs) { return (objs || []).map((i) => (i || {}).textContent ); }
  public static firstArrayItemTransform(objs) { return (objs || [])[0]; }

  public static processDoc(doc: XMLDocument, fn: (doc: XMLDocument, nsHref: string, nsPrefix: string, nss: {}) => {}): any {
    let nsHref;
    let nsPrefix;
    let nss;
    ({nsHref, nsPrefix, nss} = XbrlUtility.getNamespace(doc));
    // console.log('doc', doc);
    let returnObj = fn(doc, nsHref, nsPrefix, nss);
    return returnObj;
  }

  public static processTypeDoc(doc: XMLDocument, structure): any {
    return XbrlUtility.processDoc(doc, (returnedDoc, nsHref, nsPrefix, nss) => {
      let returnObj  =  {roles: [], elements: []};
      returnObj = XbrlUtility.processStructure(returnedDoc, nsHref, nsPrefix, nss, structure, returnObj);
      // @pre_h = nil if @pre_h["roles"].blank? || @pre_h["dlinks"].blank?
      // @cal_h = nil if @cal_h["roles"].blank? || @cal_h["clinks"].blank?
      // @lab_h = nil if @lab_h["labels"].blank? || @lab_h["locs"].blank? || @lab_h["labarcs"].blank?
      return returnObj;
    });
  }

  public static getNamespace(doc: XMLDocument): {nsHref?: string, nsPrefix?: string, nss?: {}} {
    let nsHref: string = doc.lookupNamespaceURI(null);
    let nsPrefix = doc.lookupPrefix(nsHref);
    let nss = {};
    XbrlUtility.INS_nsPrefixES.forEach((ns) => {
      let uri = doc.lookupNamespaceURI(ns);
      // console.log('ns: ', ns);
      // console.log('ns uri: ', uri);
      if (uri) { nss[ns] = uri; }
    });
    // console.log('nsHref', nsHref);
    // console.log('nsPrefix', nsPrefix);
    // console.log('nss', JSON.stringify(nss));
    return {nsHref, nsPrefix, nss};
  }

  public static parseTag(tag: string, nsHref: string, nsPrefix: string, nss: any, doc: XMLDocument, global: boolean = true): any {
    let parseResult = null;
    parseResult = XbrlUtility.parseTagNS(tag, nsHref, nsPrefix, doc, global);
    if (Object.keys(parseResult).length === 0) {
      let nsUris = Object.keys(nss);
      for (let i in Object.keys(nsUris)) {
        if (i.length > 0) {
          parseResult = XbrlUtility.parseTagNS(tag, nss[nsUris[i]], nsUris[i], doc, global);
          if (Object.keys(parseResult).length > 0) { break; }
        }
      }
    }
    return parseResult;
  }

  public static parseTagNS(tag: string, nsHref: string, nsPrefix: string, doc: XMLDocument, global: boolean = true): any {
    // console.log(xml.getElementsByTagNameNS('http://my.namespace', 'CreationDate'));
    // var response = transport.responseXML.getElementsByTagName("channel");
    // var sunrise = response[0].getElementsByTagNameNS("[Namespace URI]", "astronomy")[0].getAttribute("sunrise");
    // IE? use getElementsByTagName("yweather:astronomy")
    // MSXML? set the "SelectionNamespaces" property on the XML DOMDocument object,
    // then use the non-standard "selectNodes" (or "selectSingleNode") method with an XPath selector. See xml.com/pub/a/2002/06/05/msxml4.html

    // getElementsByTagNameNS(Namespace,"*");
    // 'poss': //*[starts-with(@DependencyType,'poss')]
    // https://developer.mozilla.org/en-US/docs/Introduction_to_using_XPath_in_JavaScript
    // var xpathResult = document.evaluate( xpathExpression, contextNode, namespaceResolver, resultType, result );

    // return doc.getElementsByTagName(tag);
    return doc.getElementsByTagNameNS(nsHref, tag);
  }
//         @r = doc.xpath("//ns:#{tag}", "ns" => nsHref)
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

//         @r = doc.css("/ns|#{tag}", "ns" => nsHref)
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

  public static getNodeAtts(node, atts: any, nsHref, nsPrefix, nss, obj?: any): any {
    if (node && atts) {
      // console.log('atts: ', JSON.stringify(atts));
      let returnObj = obj || {};
      // console.log('nsUris: ', nss);
      let nsUris = Object.keys(nss);
      (atts || []).forEach((att) => {
        let attVal = node.getAttribute(att);
        if (attVal === null) {
          for (let i in Object.keys(nsUris)) {
            if (i.length > 0) {
              attVal = XbrlUtility.getNodeAttNS(node, att, nss[nsUris[i]]);
              if (attVal !== null) { break; }
            }
          }
        }
        returnObj[att] = attVal;
      });
      return returnObj;
    } else {
      return obj;
    }
  }

  public static getNodeAttNS(node, att: string, nsHref): any {
    // return node.getAttribute(att);
    return node.getAttributeNS(nsHref, att);
  }

  public static getNodeTagsAtts(node, tag: string, tagAtts: [string], textContent: boolean, transformFn: (untransformedObj: any) => any, nsHref, nsPrefix, nss,
                                fn?: (node: any, nsHref: string, nsPrefix: string, nss: {}, obj: {}) => [any]): any {
    if (node && tag) {
      let parse = XbrlUtility.parseTag(tag, nsHref, nsPrefix, nss, node, false);
      let objs = [];
      for (let i in Object.keys(parse)) {
        if (i.length > 0) {
          let parseI = parse[i];
          if (parseI) {
            let nestedObj = <any> {};
            // nestedObj.tagName = ((parseI || {}).tagName || '').trim();
            nestedObj.nodeName = ((parseI || {}).nodeName || '').trim();
            if (textContent) {
              nestedObj.textContent = ((parseI || {}).textContent || '').trim();
            }
            nestedObj = XbrlUtility.getNodeAtts(parseI, tagAtts, nsHref, nsPrefix, nss, nestedObj);
            if (fn) {
              nestedObj = fn(parseI, nsHref, nsPrefix, nss, nestedObj);
            }
            if (nestedObj) { objs.push(nestedObj); }
          }
        }
      }
      return transformFn ? transformFn(objs) : objs;
    }
  }

  public static processStructure(doc: XMLDocument, nsHref: string, nsPrefix: string, nss: {}, structure: {rename?, atts?, textContent?, tags?}, obj: {any}): any {
    let tags = Object.keys(structure.tags || {}) || [];
    for (let i in Object.keys(tags)) {
      if (i.length > 0) {
        let tag = tags[i];
        let tagStructure = structure.tags[tag];
        let name = tagStructure.rename || tag;
        let nestedTagsObj = tagStructure.tags;
        let nodeTagResults = XbrlUtility.getNodeTagsAtts(doc, tag, tagStructure.atts, tagStructure.textContent, tagStructure.transformFn, nsHref, nsPrefix, nss,
        nestedTagsObj ? (node, rNsHref, rNsPrefix, rNss, nestedObj): any => {
          return XbrlUtility.processStructure(node, rNsHref, rNsPrefix, rNss, {tags: nestedTagsObj}, nestedObj);
        } : null);
        if (!XbrlUtility.isBlank(nodeTagResults)) { obj[name] = nodeTagResults; }
      }
    }
    return obj;
  }

  public static isBlank(obj: any): boolean {
    return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0) || (typeof obj !== 'object' && obj.length === 0);
  }

  // def self.construct_statement(role, data)

  //   # Here is the ruby hash map of the statement created by this method
  //   # @statement =
  //   # {
  //   #   "role" => "",
  //   #   "role_definition" => "",
  //   #   "role_use" => "",
  //   #   "pre_link_type" => "",
  //   #   "def_link_type" => "",
  //   #   "cal_link_type" => "",
  //   #   "items" =>
  //   #   [{
  //   #     "to_href" => "",
  //   #     "to_preferred_label" => "",

  //   #     "pre_from_href" => "",
  //   #     "pre_order" => "",
  //   #     "pre_arcrole" => "",
  //   #     "pre_type" => "",
  //   #     "pre_priority" => "",
  //   #     "pre_use" => "",

  //   #     "def_from_href" => [],
  //   #     "def_order" => [],
  //   #     "def_arcrole" => [],
  //   #     "def_type" => [],
  //   #     "def_closed" => [],
  //   #     "def_context_element" => [],
  //   #     "def_target_role" => [],

  //   #     "cal_from_href" => "",
  //   #     "cal_order" => "",
  //   #     "cal_arcrole" => "",
  //   #     "cal_type" => "",
  //   #     "cal_priority" => "",
  //   #     "cal_use" => "",
  //   #     "cal_weight" => "",

  //   #     "xsd_to_id" => "",
  //   #     "xsd_to_name" => "",
  //   #     "xsd_to_nillable" => "",
  //   #     "xsd_to_substitution_group" => "",
  //   #     "xsd_to_type" => "",
  //   #     "xsd_to_period_type" => "",
  //   #     "xsd_to_abstract" => "",
  //   #     "xsd_to_balance" => "",

  //   #     "to_instances" =>
  //   #     [{
  //   #       "context" => "",
  //   #       "value" => "",
  //   #       "decimals" => "",
  //   #       "xbrl_id" => "",
  //   #       "unit" => "",
  //   #       "nil" => "",
  //   #       "language" => ""
  //   #     }]

  //   #     "labels" =>
  //   #      [{
  //   #       "label_arc_from" => "",
  //   #       "label_arc_to" => "",
  //   #       "label_arc_order" => "",
  //   #       "label_arc_arcrole" => "",
  //   #       "label_arc_type" => "",
  //   #       "label_role" => "",
  //   #       "label_value" => "",
  //   #       "label_language" => "",
  //   #       "label_id" => ""
  //   #     }]

  //   #   }]
  //   #   "contexts" =>
  //   #   [{
  //   #     "xbrl_id" => "",
  //   #     "entity_identifier_scheme" => "",
  //   #     "entity_identifier_text" => "",
  //   #     "segments" =>
  //   #     [{
  //   #       "segment_explicit_member_dimension" => "",
  //   #       "segment_explicit_member_text" => ""
  //   #     }
  //   #     OR
  //   #     {
  //   #       "deprecated_segment_name" => "",
  //   #       "deprecated_segment_value" => ""
  //   #     }],
  //   #     "scenarios" => "",
  //   #     "start_date" => "",
  //   #     "end_date" => "",
  //   #     "instant_date" => ""
  //   #   }],

  //   #   "units" =>
  //   #   [{
  //   #   "xbrl_id" => u,
  //   #   "plain_measure" => "",
  //   #   "divide_numerator_measure" => "",
  //   #   "divide_denominator_measure" => ""
  //   #   }]
  //   # }

  //   @statement = {}
  //   @role = role

  //   begin
  //     @pre = []
  //     unless data["pre"].blank? || data["pre"]["plinks"].blank?
  //       @pre = data["pre"]["plinks"].select {|plink| plink["role"] == @role } #find all presentationlinks with "role" == @role
  //     end
  //   rescue Exception => e
  //     @pre = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign pre presentationLinks to @pre for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   @pre_link_type = ""
  //   unless @pre.blank?
  //     begin
  //       @pre_link_type = @pre.collect {|pre| pre["type"] || "" }.uniq.compact.join(', ')
  //     rescue Exception => e
  //       @pre_link_type = ""
  //       str = "Error in EdgarBuilder::construct_statement trying to assign presentationLink type to @pre_link_type for #{@role}."
  //       ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //       message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //     end
  //   end
  //   begin
  //     @def = []
  //     unless data["def"].blank? || data["def"]["dlinks"].blank?
  //       @def = data["def"]["dlinks"].select {|dlink| dlink["role"] == @role } #find all definitionlinks with "role" == @role
  //     end
  //   rescue Exception => e
  //     @def = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign def definitionLinks to @def for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   @def_link_type = ""
  //   unless @def.blank?
  //     begin
  //       @def_link_type = @def.collect {|def_item| def_item["type"] || "" }.uniq.compact.join(', ')
  //     rescue Exception => e
  //       @def_link_type = ""
  //       str = "Error in EdgarBuilder::construct_statement trying to assign definitionLink type to @def_link_type for #{@role}."
  //       ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //       message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //     end
  //   end
  //   begin
  //     @cal = []
  //     unless data["cal"].blank? || data["cal"]["clinks"].blank?
  //       @cal = data["cal"]["clinks"].select {|clink| clink["role"] == @role } #find all calculationlinks with "role" == @role
  //     end
  //   rescue Exception => e
  //     @cal = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign cal calculationLinks to @cal for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   @cal_link_type = ""
  //   unless @cal.blank?
  //     begin
  //       @cal_link_type = @cal.collect {|cal| cal["type"] || "" }.uniq.compact.join(', ')
  //     rescue Exception => e
  //       @cal_link_type = ""
  //       str = "Error in EdgarBuilder::construct_statement trying to assign calculationLink type to @cal_link_type for #{@role}."
  //       ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //       message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //     end
  //   end
  //   begin
  //     @xsd = []
  //     @xsd = data["xsd"]["elements"] || []
  //   rescue Exception => e
  //     @xsd = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign xsd elements to @xsd for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   @role_definition = ""
  //   begin
  //     @role_definition = data["xsd"]["roles"].select {|role| role["uri"] == @role }.first["def"] || ""
  //     raise ArgumentError, "@role_definition is blank in xsd file." if @role_definition.blank?
  //   rescue
  //     begin
  //       @role_definition = @pre["title"] || ""
  //       raise ArgumentError, "@role_definition is blank in pre file." if @role_definition.blank?
  //     rescue
  //       begin
  //         @role_definition = @def["title"] || ""
  //         raise ArgumentError, "@role_definition is blank in def file." if @role_definition.blank?
  //       rescue
  //         begin
  //           @role_definition = @cal["title"] || ""
  //           raise ArgumentError, "@role_definition is blank in cal file." if @role_definition.blank?
  //         rescue
  //           @role_definition = ""
  //         end
  //       end
  //     end
  //     # str = "Error in EdgarBuilder::construct_statement trying to assign xsd role def to @role_definition for #{@role}."
  //     # ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     # message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   @role_use = ""
  //   begin
  //     @role_use = data["xsd"]["roles"].select {|role| role["uri"] == @role }.first["use"] || ""
  //   rescue Exception => e
  //     @role_use = ""
  //     # str = "Error in EdgarBuilder::construct_statement trying to assign xsd use to @role_use for #{@role}."
  //     # ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     # message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   begin
  //     @lab_labels = []
  //     @lab_labels = data["lab"]["labels"] || []
  //   rescue Exception => e
  //     @lab_labels = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign lab labels to @lab_labels for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   begin
  //     @lab_locs = []
  //     @lab_locs = data["lab"]["locs"] || []
  //   rescue Exception => e
  //     @lab_locs = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign lab locators to @lab_locs for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   begin
  //     @lab_labarcs = []
  //     @lab_labarcs = data["lab"]["labarcs"] || []
  //   rescue Exception => e
  //     @lab_labarcs = []
  //     str = "Error in EdgarBuilder::construct_statement trying to assign lab labarcs to @lab_labarcs for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end
  //   begin
  //     @ins = {}
  //     @ins = data["ins"] || {}
  //   rescue Exception => e
  //     @ins = {}
  //     str = "Error in EdgarBuilder::construct_statement trying to assign ins to @ins for #{@role}."
  //     ValcuErrorHandling::log_and_show_rescue({calling_object: "EdgarBuilder", calling_method: __method__, description: str,
  //     message: e.message.truncate(10000, :separator => ' '), backtrace: e.backtrace.inspect.truncate(10000, :separator => ' '), log_file: LOG_FILE, addressed: 'f'})
  //   end

  //   @item_a = []

  //   @item_template = {
  //     "to_href" => "",

  //     "to_preferred_label" => "",
  //     "pre_from_href" => "",
  //     "pre_order" => "",
  //     "pre_arcrole" => "",
  //     "pre_type" => "",
  //     "pre_priority" => "",
  //     "pre_use" => "",

  //     "def_from_href" => [],
  //     "def_order" => [],
  //     "def_arcrole" => [],
  //     "def_type" => [],
  //     "def_closed" => [],
  //     "def_context_element" => [],
  //     "def_target_role" => [],

  //     "cal_from_href" => "",
  //     "cal_order" => "",
  //     "cal_arcrole" => "",
  //     "cal_type" => "",
  //     "cal_priority" => "",
  //     "cal_use" => "",
  //     "cal_weight" => "",

  //     "xsd_to_id" => "",
  //     "xsd_to_name" => "",
  //     "xsd_to_nillable" => "",
  //     "xsd_to_substitution_group" => "",
  //     "xsd_to_type" => "",
  //     "xsd_to_period_type" => "",
  //     "xsd_to_abstract" => "",
  //     "xsd_to_balance" => "",

  //     "to_instances" => [],
  //     "labels" => []
  //   }

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished initiating variables for #{@role}; starting pre construction."

  //   @pre.each do |pre|
  //     unless pre.blank? || pre["prearcs"].blank?
  //       pre["prearcs"].each do |i|
  //         from_href = begin pre["locs"].select {|l| l["label"] == i["from"] }.first["href"] || "" rescue "" end
  //         to_href = begin pre["locs"].select {|l| l["label"] == i["to"] }.first["href"] || "" rescue "" end

  //         @pre_h = {}
  //         @pre_h = {
  //           "to_href" => begin to_href rescue "" end,
  //           "to_preferred_label" => begin i["preferred_label"] rescue "" end,

  //           "pre_from_href" => begin from_href rescue "" end,
  //           "pre_order" => begin i["order"] || "" rescue "" end,
  //           "pre_arcrole" => begin i["arcrole"] || "" rescue "" end,
  //           "pre_type" => begin i["type"] || "" rescue "" end,
  //           "pre_priority" => begin i["priority"] || "" rescue "" end,
  //           "pre_use" => begin i["use"] || "" rescue "" end
  //         }
  //         item_clone = @item_template.clone
  //         @item_a << item_clone.merge(@pre_h)

  //       end
  //     end
  //   end

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished pre construction; starting def construction."

  //   @def.each do |def_item|
  //     unless def_item.blank? || def_item["defarcs"].blank?
  //       def_item["defarcs"].each do |i|
  //         from_href = def_item["locs"].select {|l| l["label"] == i["from"] }.first["href"] || ""
  //         to_href = def_item["locs"].select {|l| l["label"] == i["to"] }.first["href"] || ""

  //         @def_h = {}
  //         @def_h["def_from_href"] = []
  //         @def_h["def_order"] = []
  //         @def_h["def_arcrole"] = []
  //         @def_h["def_type"] = []
  //         @def_h["def_closed"] = []
  //         @def_h["def_context_element"] = []
  //         @def_h["def_target_role"] = []
  //         @def_h = {
  //           "def_from_href" => [from_href] || [],
  //           "to_href" => to_href,
  //           "def_order" => [i["order"]] || [],
  //           "def_arcrole" => [i["arcrole"]] || [],
  //           "def_type" => [i["type"]] || [],
  //           "def_closed" => [i["closed"]] || [],
  //           "def_context_element" => [i["context_element"]] || [],
  //           "def_target_role" => [i["target_role"]] || []
  //         }
  //         @matches = []
  //         @matches = @item_a.select {|a| a["to_href"] == to_href }
  //         if !@matches.blank? && @matches.count == 1
  //           @item_a.map! do |a|
  //             if (a["to_href"] == to_href)
  //               def_from_hrefs = []
  //               def_from_hrefs = a["def_from_href"] + [from_href]
  //               a["def_from_href"] = def_from_hrefs || []
  //               def_orders = []
  //               def_orders = a["def_order"] + [i["order"]]
  //               a["def_order"] = def_orders || []
  //               def_arcroles = []
  //               def_arcroles = a["def_arcrole"] + [i["arcrole"]]
  //               a["def_arcrole"] = def_arcroles || []
  //               def_types = []
  //               def_types = a["def_type"] + [i["type"]]
  //               a["def_type"] = def_types || []
  //               def_closeds = []
  //               def_closeds = a["def_closed"] + [i["closed"]]
  //               a["def_closed"] = def_closeds || []
  //               def_context_elements = []
  //               def_context_elements = a["def_context_element"] + [i["context_element"]]
  //               a["def_context_element"] = def_context_elements || []
  //               def_target_roles = []
  //               def_target_roles = a["def_target_role"] + [i["target_role"]]
  //               a["def_target_role"] = def_target_roles || []
  //               a
  //             else
  //               a
  //             end
  //           end
  //         elsif !@matches.blank? && @matches.count > 1
  //           @item_a.map! do |a|
  //             if (a["to_href"] == to_href && a["pre_from_href"] == from_href)
  //               def_from_hrefs = []
  //               def_from_hrefs = a["def_from_href"] + [from_href]
  //               a["def_from_href"] = def_from_hrefs || []
  //               def_orders = []
  //               def_orders = a["def_order"] + [i["order"]]
  //               a["def_order"] = def_orders || []
  //               def_arcroles = []
  //               def_arcroles = a["def_arcrole"] + [i["arcrole"]]
  //               a["def_arcrole"] = def_arcroles || []
  //               def_types = []
  //               def_types = a["def_type"] + [i["type"]]
  //               a["def_type"] = def_types || []
  //               def_closeds = []
  //               def_closeds = a["def_closed"] + [i["closed"]]
  //               a["def_closed"] = def_closeds || []
  //               def_context_elements = []
  //               def_context_elements = a["def_context_element"] + [i["context_element"]]
  //               a["def_context_element"] = def_context_elements || []
  //               def_target_roles = []
  //               def_target_roles = a["def_target_role"] + [i["target_role"]]
  //               a["def_target_role"] = def_target_roles || []
  //               a
  //             elsif (a["to_href"] == to_href)
  //               def_from_hrefs = []
  //               def_from_hrefs = a["def_from_href"] + [from_href]
  //               a["def_from_href"] = def_from_hrefs || []
  //               def_orders = []
  //               def_orders = a["def_order"] + [i["order"]]
  //               a["def_order"] = def_orders || []
  //               def_arcroles = []
  //               def_arcroles = a["def_arcrole"] + [i["arcrole"]]
  //               a["def_arcrole"] = def_arcroles || []
  //               def_types = []
  //               def_types = a["def_type"] + [i["type"]]
  //               a["def_type"] = def_types || []
  //               def_closeds = []
  //               def_closeds = a["def_closed"] + [i["closed"]]
  //               a["def_closed"] = def_closeds || []
  //               def_context_elements = []
  //               def_context_elements = a["def_context_element"] + [i["context_element"]]
  //               a["def_context_element"] = def_context_elements || []
  //               def_target_roles = []
  //               def_target_roles = a["def_target_role"] + [i["target_role"]]
  //               a["def_target_role"] = def_target_roles || []
  //               a
  //             else
  //               a
  //             end
  //           end
  //         else
  //           item_clone = {}
  //           item_clone = @item_template.clone
  //           @item_a << item_clone.merge(@def_h)
  //         end
  //       end
  //     end
  //   end

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished def construction; starting cal construction."

  //   @cal.each do |cal|
  //     unless cal.blank? || cal["calarcs"].blank?
  //       cal["calarcs"].each do |i|
  //         from_href = cal["locs"].detect {|l| l["label"] == i["from"] }["href"] || ""
  //         to_href = cal["locs"].detect {|l| l["label"] == i["to"] }["href"] || ""

  //         @cal_h = {}
  //         @cal_h = {
  //           "cal_from_href" => from_href,
  //           "to_href" => to_href,
  //           "cal_order" => i["order"] || "",
  //           "cal_arcrole" => i["arcrole"] || "",
  //           "cal_type" => i["type"] || "",
  //           "cal_priority" => i["priority"] || "",
  //           "cal_use" => i["use"] || "",
  //           "cal_weight" => i["weight"] || ""
  //         }

  //         @found = 0
  //         @item_a.map! do |a|
  //           if (a["to_href"] == to_href || EdgarItemSchema.split_href(a["to_href"]) == EdgarItemSchema.split_href(to_href)) && a["cal_from_href"].blank?
  //             @found = 1
  //             a.merge!(@cal_h)
  //           else
  //             a
  //           end
  //         end
  //         if @found == 0
  //           item_clone = {}
  //           item_clone = @item_template.clone
  //           @item_a << item_clone.merge(@cal_h)
  //         end
  //       end
  //     end
  //   end

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished cal construction; starting dimension collection."

  //   used_context_xbrl_ids = []
  //   used_context_xbrl_ids = create_context_pool(@item_a, {contexts_plain: @ins["contexts_plain"], contexts_segments: @ins["contexts_segments"], contexts_scenarios: @ins["contexts_scenarios"]})

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished dimension collection; starting root generation."

  //   # generate items for future use in building tree
  //   to_href_item_list = []
  //   to_href_item_list = @item_a.collect { |item| item["to_href"] }
  //   @possible_root_pre_from_hrefs = []
  //   @possible_root_pre_from_hrefs = @item_a.collect {|item| item["pre_from_href"] unless to_href_item_list.include?(item["pre_from_href"]) }
  //   unless @possible_root_pre_from_hrefs.blank?
  //     @possible_root_pre_from_hrefs.uniq!
  //   end
  //   unless @possible_root_pre_from_hrefs.blank?
  //     @possible_root_pre_from_hrefs.compact!
  //   end
  //   @generated_items = []
  //   if @possible_root_pre_from_hrefs.blank?
  //     @full_pre_from_href_list = []
  //     @full_pre_from_href_list = @item_a.collect {|item| item["pre_from_href"] }
  //     unless @full_pre_from_href_list.blank?
  //       @full_pre_from_href_list.uniq!
  //     end
  //     unless @full_pre_from_href_list.blank?
  //       @full_pre_from_href_list.compact!
  //     end
  //     unless @full_pre_from_href_list.blank?
  //       @full_pre_from_href_list.each do |pre_from_href|
  //         item_clone = {}
  //         item_clone = @item_template.clone
  //         @generated_items << item_clone.merge(
  //         {
  //           "pre_from_href" => "valcu_generated_pre_from_href",
  //           "to_href" => pre_from_href
  //         })
  //       end
  //     end
  //   else
  //     @possible_root_pre_from_hrefs.each do |possible_root_pre_from_href|
  //       unless possible_root_pre_from_href.blank?
  //         item_clone = {}
  //         item_clone = @item_template.clone
  //         @generated_items << item_clone.merge(
  //         {
  //           "pre_from_href" => "valcu_generated_pre_from_href",
  //           "to_href" => possible_root_pre_from_href
  //         })
  //       end
  //     end
  //   end
  //   @item_a += @generated_items

  //   @context_refs = []
  //   @units = []
  //   @labels = []
  //   # html_reg_ex = </?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)/?>
  //   # html_reg_ex = "/<\/?[^>]*>/"

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished root generation; starting instance and label gathering."

  //   @item_a.map! do |a|
  //     #generate a pre_from_href for each that is blank
  //     if a["pre_from_href"].blank?
  //       a["pre_from_href"] = "valcu_generated_pre_from_href"
  //     end

  //     xsd_element = @xsd.select { |e| e["id"] == a["to_href"].split('#')[-1] }.first
  //     a["xsd_to_id"] = begin xsd_element["id"] || "" rescue "" end
  //     a["xsd_to_name"] = begin xsd_element["name"] || "" rescue "" end
  //     a["xsd_to_nillable"] = begin xsd_element["nillable"] || "" rescue "" end
  //     a["xsd_to_substitution_group"] = begin xsd_element["substitution_group"] || "" rescue "" end
  //     a["xsd_to_type"] = begin xsd_element["type"] || "" rescue "" end
  //     a["xsd_to_period_type"] = begin xsd_element["period_type"] || "" rescue "" end
  //     a["xsd_to_abstract"] = begin xsd_element["abstract"] || "" rescue "" end
  //     a["xsd_to_balance"] = begin xsd_element["balance"] || "" rescue "" end

  //     a["to_instances"] = []
  //     a["labels"] = []
  //     href = a["to_href"] || ""
  //     unless href.blank?
  //       ins_tag = href.split('#')[-1].gsub('_', ':') || ""
  //       ins_elements = begin @ins["doc"].xpath("//#{ins_tag}") rescue @ins["doc"].css("//#{ins_tag.gsub(':', '|')}") rescue @ins["doc"].css("//#{ins_tag.split(':')[-1]}") rescue [] end
  //       ins_elements.each do |ie|
  //         if used_context_xbrl_ids.include?(ie["contextRef"])
  //           @to_instance_h = {}
  //           @to_instance_h =
  //           {
  //             "context" => EdgarFileGrabber::get_edgar_attribute(ie, "contextRef"),
  //             "value" => begin clean_edgar_text(ie.text.to_s).strip || "" rescue "" end,
  //             "decimals" => EdgarFileGrabber::get_edgar_attribute(ie, "decimals"),
  //             "xbrl_id" => EdgarFileGrabber::get_edgar_attribute(ie, "id"),
  //             "unit" => EdgarFileGrabber::get_edgar_attribute(ie, "unitRef"),
  //             "nil" => EdgarFileGrabber::get_edgar_attribute(ie, "nil"),
  //             "language" => EdgarFileGrabber::get_edgar_attribute(ie, "lang")
  //             # the below order can be used if comparing to objects created before xbrl_file ~ 140000 (when ruby 1.8.7 was used)
  //             # "xbrl_id" => EdgarFileGrabber::get_edgar_attribute(ie, "id"),
  //             # "decimals" => EdgarFileGrabber::get_edgar_attribute(ie, "decimals"),
  //             # "value" => begin clean_edgar_text(ie.text.to_s).strip || "" rescue "" end,
  //             # "unit" => EdgarFileGrabber::get_edgar_attribute(ie, "unitRef"),
  //             # "nil" => EdgarFileGrabber::get_edgar_attribute(ie, "nil"),
  //             # "language" => EdgarFileGrabber::get_edgar_attribute(ie, "lang"),
  //             # "context" => EdgarFileGrabber::get_edgar_attribute(ie, "contextRef")
  //           }
  //           a["to_instances"] << @to_instance_h
  //           # collect the contexts and units from the items while we're looping through
  //           @context_refs << @to_instance_h["context"]
  //           @units << @to_instance_h["unit"]
  //         end
  //       end

  //       # collect the labels that apply to the item/a
  //       a["labels"] = construct_label(@lab_locs, @lab_labarcs, @lab_labels, href)
  //       a["labels"].each {|label| @labels << label }
  //       a
  //     else
  //       a["to_instances"] = []
  //       a["labels"] = []
  //       a
  //     end
  //     a
  //   end

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished instance and label gathering; starting context collecting."

  //   # gather info on contexts and units and add to hash outside of the items
  //   @context_refs.compact! unless @context_refs.blank?
  //   @context_refs.uniq! unless @context_refs.blank?
  //   @context_a = []
  //   unless @context_refs.blank?
  //     @context_refs.each do |context_ref|
  //       @context_a << @ins["contexts_segments"].select {|instance_context| instance_context["xbrl_id"] == context_ref }.first unless @ins["contexts_segments"].blank?
  //       @context_a << @ins["contexts_plain"].select {|instance_context| instance_context["xbrl_id"] == context_ref }.first unless @ins["contexts_plain"].blank?
  //       @context_a << @ins["contexts_scenarios"].select {|instance_context| instance_context["xbrl_id"] == context_ref }.first unless @ins["contexts_scenarios"].blank?
  //     end
  //     @context_a.compact! unless @context_a.blank?
  //   end
  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished context collecting; starting unit collecting."

  //   @units.compact!
  //   unless @units.blank?
  //     @units.uniq!
  //     @unit_a = []

  //     @units.each do |u|
  //       begin unit = @ins["units"].select {|iu| iu["xbrl_id"] == u }.first rescue unit = "" end
  //       @unit_a << {
  //         "xbrl_id" => u,
  //         "plain_measure" => begin unit["plain_measure"] || "" rescue "" end,
  //         "divide_numerator_measure" => begin unit["divide_numerator_measure"] || "" rescue "" end,
  //         "divide_denominator_measure" => begin unit["divide_denominator_measure"] || "" rescue "" end
  //       }
  //     end
  //   end

  //   # puts DateTime.now.utc.to_s + " - EdgarBuilder::construct_statement finished unit collecting."

  //   @statement = {
  //     "role" => @role,
  //     "role_definition" => @role_definition,
  //     "role_use" => @role_use,
  //     "pre_link_type" => @pre_link_type,
  //     "def_link_type" => @def_link_type,
  //     "cal_link_type" => @cal_link_type,
  //     "items" => begin @item_a rescue [] end,
  //     "contexts" => begin @context_a rescue [] end,
  //     "units" => begin @unit_a rescue [] end,
  //     "labels" => begin @labels rescue [] end
  //   }
  //   return @statement
  // end

  // def self.construct_footnotes(ins)
  //   @ins = {}
  //   @ins["foot_locs"] = []
  //   @ins["foot_locs"] = begin ins["foot_locs"] rescue [] end
  //   @ins["foot_arcs"] = []
  //   @ins["foot_arcs"] = begin ins["foot_arcs"] rescue [] end
  //   @ins["foots"] = []
  //   @ins["foots"] = begin ins["foots"] rescue [] end
  //   @footnotes = []

  //   unless @ins.blank? || @ins["foot_arcs"].blank?
  //     @ins["foot_arcs"].each do |i|
  //       foot = begin @ins["foots"].select {|foot| foot["label"] == i["to"] }.first rescue {} end
  //       footnote_h = {}
  //       footnote_h = {
  //         "href" => begin @ins["foot_locs"].select {|l| l["label"] == i["from"] }.first["href"] || "" rescue "" end,
  //         "arc_from_label" => begin i["from"] || "" rescue "" end,
  //         "arc_to_label" => begin i["to"] || "" rescue "" end,
  //         "arc_arcrole" => begin i["arcrole"] || "" rescue "" end,
  //         "arc_order" => begin i["order"] || "" rescue "" end,
  //         "arc_type" => begin i["type"] || "" rescue "" end,
  //         "role" => begin foot["role"] || "" rescue "" end,
  //         "footnote_type" => begin foot["footnote_type"] || "" rescue "" end,
  //         "language" => begin foot["lang"] || "" rescue "" end,
  //         "value" => begin clean_edgar_text(foot["text"]) || "" rescue "" end
  //       }
  //       @footnotes << footnote_h
  //     end
  //   end
  //   return @footnotes
  // end

  // def self.construct_label(lab_locs, lab_labarcs, lab_labels, href)
  //   label_template = {
  //     "label_arc_from" => "",
  //     "label_arc_to" => "",
  //     "label_arc_order" => "",
  //     "label_arc_arcrole" => "",
  //     "label_arc_type" => "",
  //     "label_role" => "",
  //     "label_value" => "",
  //     "label_language" => "",
  //     "label_id" => ""
  //   }
  //   # collect the labels that apply to the item/a
  //   label_h = {}
  //   to_label = begin lab_locs.select {|l| l["href"] == href }.first["label"] || "" rescue "" end
  //   @arc = []
  //   @arc = begin lab_labarcs.select {|l| l["from"] == to_label }.first || "" rescue "" end

  //   unless @arc.blank?
  //     label_h =
  //     {
  //       "label_arc_from" => begin @arc["from"] || "" rescue "" end,
  //       "label_arc_to" => begin @arc["to"] || "" rescue "" end,
  //       "label_arc_order" => begin @arc["order"] || "" rescue "" end,
  //       "label_arc_arcrole" => begin @arc["arcrole"] || "" rescue "" end,
  //       "label_arc_type" => begin @arc["type"] || "" rescue "" end
  //     }
  //     intermediate_label_clone = {}
  //     intermediate_label_clone = label_template.clone
  //     intermediate_label_clone.merge!(label_h)

  //     to_to = begin @arc["to"] || "" rescue "" end
  //     to_items = begin lab_labels.select {|l| l["label"] == to_to} rescue [] end
  //     @label_a = []
  //     to_items.each do |to_item|
  //       label_h = {}
  //       label_h =
  //       {
  //         "label_role" => begin to_item["role"] || "" rescue "" end,
  //         "label_value" => begin clean_edgar_text(to_item["text"]) || "" rescue "" end,
  //         "label_language" => begin to_item["lang"] || "" rescue "" end,
  //         "label_id" => begin to_item["id"] || "" rescue "" end
  //       }
  //       label_clone = {}
  //       label_clone = intermediate_label_clone.clone
  //       label = label_clone.merge(label_h)
  //       @label_a << label
  //     end
  //     return @label_a
  //   else
  //     return {}
  //   end
  // end

}
