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

  public static get XSD_STRUCTURE(): {atts?: [any], textContent?: string, tags: any} {
    return {
      tags: {
        'roleType': {
          rename: 'roles',
          atts: [
            'roleURI',
          ],
          tags: {
            'definition': {
              rename: 'def',
              textContent: true,
              transformFn: XbrlUtility.justTextTransform,
            },
            'usedOn': {
              rename: 'uses',
              textContent: true,
              transformFn: XbrlUtility.arrayedTextTransform,
            },
          },
        },
        'element': {
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
        'roleRef': {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        'presentationLink': {
          rename: 'plinks',
          atts: [
            'role', //xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            'loc': {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            'presentationArc': {
              rename: 'prearcs',
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
        'roleRef': {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        'definitionLink': {
          rename: 'dlinks',
          atts: [
            'role', //xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            'loc': {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            'definitionArc': {
              rename: 'defarcs',
              atts: [
                'order',
                'arcrole', // 'xlink:arcrole'
                'from', // 'xlink:from'
                'to', // 'xlink:to',
                'type', // 'xlink:type'
                'closed', // 'xbrldt:close'
                'contextElement', //xbrldt:contextElement
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
        'roleRef': {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        'calculationLink': {
          rename: 'clinks',
          atts: [
            'role', //xlink:role
            'type', // 'xlink:type'
            'title', // 'xlink:title'
          ],
          tags: {
            'loc': {
              rename: 'locs',
              atts: [
                'href', // 'xlink:href'
                'label', // 'xlink:label'
                'type', // 'xlink:type'
              ],
            },
            'calculationArc': {
              rename: 'calarcs',
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
        'roleRef': {
          rename: 'roles',
          atts: [
            'roleURI',
            'href', // 'xlink:href'
            'type', // 'xlink:type'
          ],
        },
        'label': {
          rename: 'labels',
          atts: [
            'id',
            'label', // xlink:label
            'role', //xlink:role
            'type', // 'xlink:type'
            'lang', // 'xml:lang'
          ],
          textContent: true,
        },
        'loc': {
          rename: 'locs',
          atts: [
            'href', // 'xlink:href'
            'label', // 'xlink:label'
            'type', // 'xlink:type'
          ],
        },
        'labelArc': {
          rename: 'labarcs',
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
        'context': { // xbrli:context
          rename: 'contexts',
          atts: [
            'id',
          ],
          tags: {
            'entity': { // xbrli:entity
              tags: {
                'identifier': { // xbrli:identifier
                  atts: [
                    'scheme',
                  ],
                  textContent: true,
                },
                'segments': { // xbrli:segment
                  tags: {
                    'explicitMember': { // xbrldi:explicitMember
                      atts: [
                        'dimension'
                      ],
                      textContent: true,

                    }
                  }
                }
              }
            },
            'period': { // xbrli:period
              tags: {
                'startDate': { // xbrli:startDate
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
                'endDate': { // xbrli:endDate
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
                'instant': { // xbrli:instant
                  textContent: true,
                  transformFn: XbrlUtility.justTextTransform,
                },
              },
              transformFn: XbrlUtility.firstArrayItemTransform,
            },
            'scenario': {
              rename: 'scenarios',
            }
          }
        },
      },
    };
    // #item names map to xsd elements, with first underscore changed to colon; 
    // #item unitRefs map internally to unit id
    // #item contextRefs map interanlly to context ids
    // #xbrldi:explicitMember dimension under contexts maps to ?;
    // # explicitMember text (colon needs to be changed to underscore) maps to xsd element id where it is in the company's namespace
    // #entity is cik
  }

    // u_tag = "unit" # "xbrli:unit"
    // uid_att = "id"
    // um_tag = "measure" # "xbrli:measure"
    // um_text = ""
    // ud_tag = "divide" # "xbrli:divide"
    // udn_tag = "unitNumerator" # "xbrli:unitNumerator"
    // udnm_tag = "measure" # "xbrli:measure"
    // udnm_text = ""
    // udd_tag = "unitDenominator" # "xbrli:unitDenominator"
    // uddm_tag = "measure" # "xbrli:measure"
    // uddm_text = ""

    // i_tags = "..."
    // icr_att = "contextRef"
    // id_att = "decimals"
    // ii_att = "id"
    // iur_att = "unitRef"
    // i_nil_att = "nil"
    // i_lang_att = "lang" #xml:lang 
    // i_text = ""

    // l_tag = "loc" # "link:loc"
    // l_href_att = "href" # "xlink:href"
    // l_label_att = "label" # "xlink:label"
    // l_type_att = "type" # "xlink:type"
    // l_atts = %w(href label type)

    // fa_tag = "footnoteArc" # "link:footnoteArc"
    // fa_order_att = "order"
    // fa_arcrole_att = "arcrole" # "xlink:arcrole"
    // fa_from_att = "from" # "xlink:from"
    // fa_to_att = "to" # "xlink:to"
    // fa_type_att = "type" # "xlink:type"
    // fa_atts = %w(order arcrole from to type)

    // f_tag = "footnote" # "link:footnote"
    // f_label_att = "label" # "xlink:label"
    // f_role_att = "role" # "xlink:role"
    // f_footnote_type_att = "type" # "xlink:type"
    // f_lang_att = "lang" # "xml:lang"
    // f_text = ""
    // f_atts = %w(label role footnote_type lang)


  //     identifier = parse_ins_tag_chain([ent_tag, identifier_tag], ns_href, c, FALSE).first
  //     @c_h["entity_identifier_scheme"] = get_edgar_attribute(identifier, identifier_scheme_att)
  //     @c_h["entity_identifier_text"] = begin identifier.text.strip || "" rescue "" end

  //     @c_h["segments"] = []
  //     segs = parse_ins_tag_chain([ent_tag, seg_tag, expm_tag], ns_href, c, FALSE)
  //     @s_h = {}
  //     segs.each do |seg|
  //       @s_h = {}
  //       @s_h["segment_explicit_member_dimension"] = get_edgar_attribute(seg, expmd_att)
  //       @s_h["segment_explicit_member_text"] = begin seg.text.strip || "" rescue "" end
  //       @c_h["segments"] << @s_h
  //     end
  //     if @s_h["segment_explicit_member_dimension"].blank?
  //       deprecated_segments = parse_ins_tag_chain([ent_tag, seg_tag], ns_href, c, FALSE)
  //       unless deprecated_segments.blank?
  //         @children = []
  //         deprecated_segments.children.each do |child|
  //           prefix = begin child.namespace.prefix || "" rescue "" end
  //           name = begin child.name || "" rescue "" end  
  //           value = begin child.text.strip || "" rescue "" end
  //           @namespaced_name = name
  //           unless prefix.blank?
  //             @namespaced_name = prefix + ":" + name
  //           end
  //           unless @namespaced_name.blank? || (@namespaced_name == "text" && value.blank?)
  //             @deprecated_segment_method = TRUE
  //             @child = {}
  //             @child = begin {"deprecated_segment_name" => @namespaced_name, "deprecated_segment_value" => value} || {} rescue {} end
  //             @children << @child
  //           end
  //         end
  //         @c_h["segments"] << @children
  //       end
  //     end

  //     period = parse_ins_tag(p_tag, ns_href, c, FALSE).first
  //     @c_h["start_date"] = begin parse_ins_tag(psd_tag, ns_href, period, FALSE).first.text.strip || "" rescue "" end
  //     @c_h["end_date"] = begin parse_ins_tag(ped_tag, ns_href, period, FALSE).first.text.strip || "" rescue "" end
  //     @c_h["instant_date"] = begin parse_ins_tag(pi_tag, ns_href, period, FALSE).first.text.strip || "" rescue "" end

  //     scenarios = parse_ins_tag(scenario_tag, ns_href, c, FALSE)
  //     @scenario_a = []
  //     scenarios.each do |scenario|
  //       @children = []
  //       scenario.children.each do |child|
  //         prefix = begin child.namespace.prefix || "" rescue "" end
  //         name = begin child.name || "" rescue "" end  
  //         value = begin child.text.strip || "" rescue "" end
  //         @namespaced_name = name
  //         unless prefix.blank?
  //           @namespaced_name = prefix + ":" + name
  //         end
  //         unless @namespaced_name == "text" && value.blank?
  //           @child = []
  //           @child = [@namespaced_name, value]
  //           @child.reject!(&:empty?)
  //           @children << @child
  //         end
  //       end
  //       @children.flatten!
  //       @content = ""
  //       @content = @children.join(",")
  //       @scenario_a << @content
  //     end
  //     @c_h["scenarios"] = @scenario_a.join(",")

  //     @ins_h["contexts"] << @c_h
  //   end

  //   # Categorize contexts by lack of sgements and scenarios and with them
  //   @ins_h["contexts_plain"] = []
  //   @ins_h["contexts_segments"] = []
  //   @ins_h["contexts_scenarios"] = []
  //   @ins_h["contexts_plain"], @ins_h["contexts_segments"], @ins_h["contexts_scenarios"] = sort_contexts(@ins_h["contexts"], {deprecated_segment_method: @deprecated_segment_method})

  //   @ins_h["units"] = []
  //   us = parse_ins_tag(u_tag, ns_href, doc, TRUE)

  //   us.each do |u|
  //     u_h = {}
  //     u_h["xbrl_id"] = get_edgar_attribute(u, uid_att)
  //     u_h["plain_measure"] = begin parse_ins_tag(um_tag, ns_href, u, FALSE).first.text.strip || "" rescue "" end
  //     u_h["divide_numerator_measure"] = begin parse_ins_tag_chain([ud_tag, udn_tag, udnm_tag], ns_href, u, FALSE).first.text.strip || "" rescue "" end
  //     u_h["divide_denominator_measure"] = begin parse_ins_tag_chain([ud_tag, udd_tag, uddm_tag], ns_href, u, FALSE).first.text.strip || "" rescue "" end
  //     @ins_h["units"] << u_h
  //   end

  //  #item parsing doesnt occur here, but in EdgarBuilder

  //   @ins_h["foot_locs"] = []
  //   ls = parse_ins_tag(l_tag, ns_href, doc, TRUE)
  //   ls.each do |l|
  //     @ins_h["foot_locs"] << Hash[l_atts.map {|att| ["#{att}", get_edgar_attribute(l, eval("l_#{att}_att")) || "" ] }]
  //   end

  //   @ins_h["foot_arcs"] = []
  //   fas = parse_ins_tag(fa_tag, ns_href, doc, TRUE)
  //   fas.each do |fa|
  //     @ins_h["foot_arcs"] << Hash[fa_atts.map {|att| ["#{att}", get_edgar_attribute(fa, eval("fa_#{att}_att")) || "" ] }]
  //   end

  //   @ins_h["foots"] = []
  //   fs = parse_ins_tag(f_tag, ns_href, doc, TRUE)
  //   fs.each do |f|
  //     @ins_h["foots"] << Hash[f_atts.map {|att| ["#{att}", get_edgar_attribute(f, eval("f_#{att}_att")) || "" ] }].merge({"text" => begin f.text.strip || "" rescue "" end })
  //   end
  //   @ins_h["footnotes"] = []
  //   @ins_h["footnotes"] = begin EdgarBuilder::construct_footnotes(@ins_h) || [] rescue [] end

  //   @ins_h["doc"] = begin doc rescue "" end
  //   @ins_h = nil if @ins_h["doc"].blank?
  //   return @ins_h
  // end

  public static justTextTransform(objs) { return ((objs || [])[0] || {}).textContent }

  public static arrayedTextTransform(objs) { return (objs || []).map(function(i) { return  (i || {}).textContent; }); }
  public static firstArrayItemTransform(objs) { return (objs || [])[0]; }

  public static processDoc(doc: XMLDocument, fn: (doc: XMLDocument, ns_href: string, ns_prefix: string, nss: {}) => {}): any {
    let ns_href, ns_prefix, nss, returnObj;
    ({ns_href, ns_prefix, nss} = XbrlUtility.getNamespace(doc));
console.log('doc', doc);
    returnObj = fn(doc, ns_href, ns_prefix, nss);
    return returnObj;
  }

  public static processTypeDoc(doc: XMLDocument, structure): any {
    return XbrlUtility.processDoc(doc, function(doc, ns_href, ns_prefix, nss) {
      let returnObj  =  {roles: [], elements: []};
      returnObj = XbrlUtility.processStructure(doc, ns_href, ns_prefix, nss, structure, returnObj);
      // @pre_h = nil if @pre_h["roles"].blank? || @pre_h["dlinks"].blank?
      // @cal_h = nil if @cal_h["roles"].blank? || @cal_h["clinks"].blank?
      //   @lab_h = nil if @lab_h["labels"].blank? || @lab_h["locs"].blank? || @lab_h["labarcs"].blank? 
      return returnObj
    });
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

  public static getNodeAtts(node, atts: any, ns_href, ns_prefix, nss, obj?: any): any {
    if (node && atts) {
// console.log('atts: ', JSON.stringify(atts));
      let returnObj = obj || {};
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
        returnObj[att] = attVal;
      });
      return returnObj
    } else {
      return obj
    }
  }

  public static getNodeAttNS(node, att: string, ns_href): any {
    // return node.getAttribute(att);
    return node.getAttributeNS(ns_href, att);
  }

  public static getNodeTagsAtts(node, tag: string, tagAtts: [string], textContent: boolean, transformFn: (untransformedObj: any) => any, ns_href, ns_prefix, nss,
  fn?: (node: any, ns_href: string, ns_prefix: string, nss: {}, obj: {}) => [any]): any {
    if (node && tag) {
      let parse = XbrlUtility.parseTag(tag, ns_href, ns_prefix, nss, node, false);
      let objs = [];
      for (let i = 0; i < parse.length; i++) {
        let parseI = parse[i];
        if (parseI) {
          let nestedObj = <any>{};
          if (textContent) {
            nestedObj.textContent = ((parseI || {}).textContent || '').trim();
          }
          nestedObj = XbrlUtility.getNodeAtts(parseI, tagAtts, ns_href, ns_prefix, nss, nestedObj);
          if (fn) {
            nestedObj = fn(parseI, ns_href, ns_prefix, nss, nestedObj);
          }
          if (nestedObj) objs.push(nestedObj);
        }
      }
      return transformFn ? transformFn(objs) : objs
    }
  }

  public static processStructure(doc: XMLDocument, ns_href: string, ns_prefix: string, nss: {}, structure: {rename?, atts?, textContent?, tags?}, obj: {any}): any {
    let tags = Object.keys(structure.tags || {}) || [];
    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      let tagStructure = structure.tags[tag];
      let name = tagStructure.rename || tag;
      let nestedTagsObj = tagStructure.tags;
      obj[name] = XbrlUtility.getNodeTagsAtts(doc, tag, tagStructure.atts, tagStructure.textContent, tagStructure.transformFn, ns_href, ns_prefix, nss,
      nestedTagsObj ? function(node, ns_href, ns_prefix, nss, nestedObj): any {
        return XbrlUtility.processStructure(node, ns_href, ns_prefix, nss, {tags: nestedTagsObj}, nestedObj);
      } : null);
    }
    return obj
  }

}
