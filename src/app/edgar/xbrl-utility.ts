import { Injectable } from '@angular/core';

export interface XbrlStructureInterface {
  rename?: string;
  atts?: string[];
  textContent?: boolean;
  tags?: any;
  transformFn?: Function;
  attSelectors?: any;
}

export interface XbrlReportInterface {
  xsd?: any;
  pre?: any;
  def?: any;
  cal?: any;
  lab?: any;
  ins?: any;
}

export interface XbrlVReportInterface {
  edgarArchiveFiles?: any[];
  xbrls?: XbrlReportInterface;
  roleURIs?: string[];
  contexts?: any;
  units?: any;
  xbrlVStatements?: {};
  description?: string;
  status?: number;
}

export interface XbrlVStatementInterface {
  roleURI: string;
  xbrlStatement: any;
  xbrlStatementKeys: any;
  paredContextRefs?: string[];
  paredContexts?: any;
  paredPeriodKeys?: string[];
  paredPeriods?: any;
  rectangle?: any;
  rectangleKeys?: string[];
  dimensions?: any[];
}

export interface XbrlToInstanceInterface {
  context: string;
  value: string;
  decimals: string;
  xbrlId: string;
  unit: string;
  nil: string;
  language: string;
}

export interface XbrlLabelInterface {
  labelArcFrom: string;
  labelArcTo: string;
  labelArcOrder: string;
  labelArcArcrole: string;
  labelArcType: string;
  labelRole: string;
  labelValue: string;
  labelLanguage: string;
  labelID: string;
}

export interface XbrlStatementItemInterface {
  toHref: string;

  prePreferredLabel: string;
  preFromHref: string;
  preOrder: string;
  preArcrole: string;
  preType: string;
  prePriority: string;
  preUse: string;

  defFromHref: string;
  defOrder: string;
  defArcrole: string;
  defType: string;
  defClosed: string;
  defContextElement: string;
  defTargetRole: string;

  calFromHref: string;
  calOrder: string;
  calArcrole: string;
  calType: string;
  calPriority: string;
  calUse: string;
  calWeight: string;

  xsdToID: string;
  xsdToName: string;
  xsdToNillable: string;
  xsdToSubstitutionGroup: string;
  xsdToType: string;
  xsdToPeriodType: string;
  xsdToAbstract: string;
  xsdToBalance: string;

  toInstances: [XbrlToInstanceInterface];
  labels: [XbrlLabelInterface];
}

export interface XbrlSegmentInterface {
  segmentExplicitMemberDimension?: string;
  segmentExplicitMemberText?: string;
  // OR
  deprecatedSegmentName?: string;
  deprecatedSegmentValue?: string;
}

export interface XbrlContextInterface {
  xbrlId: null;
  entityIdentifierScheme: null;
  entityIdentifierText: null;
  segments: [XbrlSegmentInterface];
  scenarios: null;
  startDate: null;
  endDate: null;
  instantDate: null;
}

export interface XbrlUnitInterface {
  xbrlId: string;
  plainMeasure: string;
  divideNumeratorMeasure: string;
  divideDenominatorMeasure: string;
}

export interface XbrlStatementInterface {
  roleURI: string;
  roleDefinition?: string;
  roleUse?: string;
  preLinkTypes?: string[];
  defLinkTypes?: string[];
  calLinkTypes?: string[];
  presentationCompositeLinkTree?: any;
  definitionCompositeLinkTree?: any;
  calculationCompositeLinkTree?: any;
  // items?: XbrlStatementItemInterface[];
  items?: any;
  contexts?: [XbrlContextInterface];
  contextRefs?: string[];
  units?: [XbrlUnitInterface];
}

@Injectable()
export class XbrlUtility {

  // constructor() {}

  public static get NSPREFIXES(): string[] {
    // return ['ns', 'link', 'xsd', 'xs'];
    return ['ns', 'link', 'xlink', 'xsd', 'xs'];
  }

  public static get INS_NSPREFIXES(): string[] {
    return ['ns', 'xbrli', 'link', 'xlink', 'xbrldi', 'xsd', 'xs'];
    // xbrldt
  }

  public static get BALANCE_SHEET_TERMS(): any[] {
    return ['balance sheet', 'condition', 'position', ['assets', 'liabilities', 'shareholder']];
  }

  public static get INCOME_STATEMENT_TERMS(): any[] {
    return ['operation', 'income', 'earning'];
  }

  public static get CASH_FLOW_TERMS(): any[] {
    return ['cash flow'];
  }

  public static get CHANGE_IN_EQUITY_TERMS(): any[] {
    return ['equity', 'capital', 'deficit'];
  }

  public static get PARENTHETICAL_TERMS(): any[] {
    return ['parenthetical'];
  }

  public static get CALC2_TERMS(): any[] {
    return ['calc2'];
  }

  // http://www.xbrl.org/2003/role/label
  // http://www.xbrl.org/2003/role/terseLabel
  // http://www.xbrl.org/2003/role/verboseLabel
  // http://www.xbrl.org/2003/role/totalLabel
  // http://www.xbrl.org/2003/role/periodStartLabel
  // http://www.xbrl.org/2003/role/periodEndLabel
  // http://www.xbrl.org/2003/role/definitionGuidance
  // http://www.xbrl.org/2003/role/documentation
  public static get LABEL_ROLES(): string[] {
    return [
      'terseLabel',
      'label',
      'verboseLabel',
      'totalLabel',
      'periodStartLabel',
      'periodEndLabel',
      'definitionGuidance',
      'documentation',
    ];
  }
   // role:
  public static get LOC_STRUCTURE(): XbrlStructureInterface {
    return {
      rename: 'locs',
      atts: [
        'href', // 'xlink:href'
        'label', // 'xlink:label'
        'type', // 'xlink:type'
      ],
      // transformFn: XbrlUtility.objsArrayToObjObjsByLabelHrefTransform,
      transformFn: XbrlUtility.objsArrayToObjObjsByLabelTransform,
    };
  }

  public static get ROLE_REF_STRUCTURE(): XbrlStructureInterface {
    return {
      rename: 'roleRefs',
      atts: [
        'roleURI',
        'href', // 'xlink:href'
        'type', // 'xlink:type'
      ],
    };
  }

  public static get LINK_ATTS(): string[] {
    return [
      'role', // xlink:role
      'type', // 'xlink:type'
      'title', // 'xlink:title'
    ];
  }

  public static get LABEL_STRUCTURE(): XbrlStructureInterface {
    return {
      rename: 'labels',
      atts: [
        'id',
        'label', // xlink:label
        'role', // xlink:role
        'type', // 'xlink:type'
        'lang', // 'xml:lang'
      ],
      textContent: true,
      // transformFn: XbrlUtility.objsArrayToObjObjsByLabelTransform,
      transformFn: XbrlUtility.objsArrayToObjObjsObjsByLabelRoleTransform,
    };
  }

  // xsdToID: string;
  // xsdToName: string;
  // xsdToNillable: string;
  // xsdToSubstitutionGroup: string;
  // xsdToType: string;
  // xsdToPeriodType: string;
  // xsdToAbstract: string;
  // xsdToBalance: string;

  public static get XSD_STRUCTURE(): XbrlStructureInterface {
    return {
      tags: {
        roleType: {
          rename: 'roleTypes',
          atts: [
            'roleURI',
          ],
          tags: {
            definition: {
              // rename: 'def',
              textContent: true,
              transformFn: XbrlUtility.justTextTransform,
            },
            usedOn: {
              rename: 'uses',
              textContent: true,
              transformFn: XbrlUtility.arrayedTextTransform,
            },
          },
          transformFn: XbrlUtility.objsArrayToObjObjsByRoleURITransform,
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
          transformFn: XbrlUtility.objsArrayToObjObjsByIdTransform,
        },
      },
    // loc hrefs from # map to xsd element ids; loc hrefs starting from # may be duplicative of loc labels but sometimes labels have a random number appended
    // arc froms and tos map to loc labels
    //  roleRef roleURIs map to xlink:roles within file; roleRef href from # maps to xsd;
    };
  }

//   preOrder: string;
// label
//   preArcrole: string;
//   preFromHref: string;
// to
//   preType: string;
//   prePriority: string;
//   preUse: string;

  public static get PRE_STRUCTURE(): XbrlStructureInterface {
    return {
      tags: {
        roleRef: XbrlUtility.ROLE_REF_STRUCTURE,
        presentationLink: {
          rename: 'presentationLinks',
          atts: XbrlUtility.LINK_ATTS,
          tags: {
            loc: XbrlUtility.LOC_STRUCTURE,
            presentationArc: {
              rename: 'arcs',
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
          transformFn: XbrlUtility.linksLocsArcsInterleaveTransform,
        },
      },
      // roleRef href connects to xsd at #; roleRef roleURI connects to pLink xlink:xrole
      // loc href conncects to xsd; loc xlink:label connects to pArc; pArc connects to loc xlink:labels
      // preferredLabel connects to lab.xml link:label xlink:role
      //  some locs points to dei hrefs
    };
  }

//   defOrder: string;
//   defArcrole: string;
//   defFromHref: string;
// to
//   defType: string;
//   defClosed: string;
//   defContextElement: string;
//   defTargetRole: string;

  public static get DEF_STRUCTURE(): XbrlStructureInterface {
    return {
      tags: {
        roleRef: XbrlUtility.ROLE_REF_STRUCTURE,
        definitionLink: {
          rename: 'definitionLinks',
          atts: XbrlUtility.LINK_ATTS,
          tags: {
            loc: XbrlUtility.LOC_STRUCTURE,
            definitionArc: {
              rename: 'arcs',
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
          transformFn: XbrlUtility.linksLocsArcsInterleaveTransform,
        },
      },
    };
  }

//   calOrder: string;
//   calWeight: string;
//   calArcrole: string;
//   calFromHref: string;
// to
//   calType: string;
//   calPriority: string;
//   calUse: string;

  public static get CAL_STRUCTURE(): XbrlStructureInterface {
    return {
      tags: {
        roleRef: XbrlUtility.ROLE_REF_STRUCTURE,
        calculationLink: {
          rename: 'calculationLinks',
          atts: XbrlUtility.LINK_ATTS,
          tags: {
            loc: XbrlUtility.LOC_STRUCTURE,
            calculationArc: {
              rename: 'arcs',
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
          transformFn: XbrlUtility.linksLocsArcsInterleaveTransform,
        },
      },
    };
  }

  public static get LAB_STRUCTURE(): XbrlStructureInterface {
    return {
      tags: {
        roleRef: XbrlUtility.ROLE_REF_STRUCTURE,
        label: XbrlUtility.LABEL_STRUCTURE,
        loc: XbrlUtility.LOC_STRUCTURE,
        labelArc: {
          rename: 'arcs',
          atts: [
            'order',
            'arcrole', // 'xlink:arcrole'
            'from', // 'xlink:from'
            'to', // 'xlink:to',
            'type', // 'xlink:type'
          ],
        },
      },
      transformFn: XbrlUtility.linkLocsArcsIndexedInterleaveTransform,
      // loc href maps to xsd; loc label maps to labelArc from; labelArc to maps to label label
      // roleRef dont seem to be come in in the lab files
    };
  }

  public static get INS_STRUCTURE(): XbrlStructureInterface {
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
                      transformFn: XbrlUtility.replaceDimensionTextContentColonTransform,
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
          },
          transformFn: XbrlUtility.objsArrayToObjObjsByIdTransform,
        },
        unit: { // xbrli:unit
          rename: 'units',
          atts: [
            'id',
          ],
          tags: {
            measure: { // xbrli:measure
              textContent: true,
              transformFn: XbrlUtility.justTextTransform,
            },
            divide: { // xbrli:divide
              textContent: false,
              tags: {
                unitNumerator: { // xbrli:unitNumerator
                  // textContent: true,
                  tags: {
                    measure: { // xbrli:measure
                      textContent: true,
                      transformFn: XbrlUtility.justTextTransform,
                    },
                  },
                  transformFn: XbrlUtility.firstArrayItemTransform,
                },
                unitDenominator: { // xbrli:unitDenominator
                  // textContent: true,
                  tags: {
                    measure: { // xbrli:measure
                      textContent: true,
                      transformFn: XbrlUtility.justTextTransform,
                    },
                  },
                  transformFn: XbrlUtility.firstArrayItemTransform,
                },
              },
              transformFn: XbrlUtility.firstArrayItemTransform,
            },
            transformFn: XbrlUtility.firstArrayItemTransform,
          },
          // transformFn: XbrlUtility.objsArrayToObjObjsByIdTransform,
          transformFn: XbrlUtility.handleUnitsTransform,
        },
        footnoteLink: {
          rename: 'footnoteLinks',
          atts: XbrlUtility.LINK_ATTS,
          tags: {
            loc: XbrlUtility.LOC_STRUCTURE,
            footnoteArc: {
              rename: 'arcs',
              atts: [
                'order',
                'arcrole', // 'xlink:arcrole'
                'from', // 'xlink:from'
                'to', // 'xlink:to',
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
              transformFn: XbrlUtility.objsArrayToObjObjsByLabelTransform,
            },
          },
          // transformFn: XbrlUtility.linksLocsArcsInterleaveTransform,
          transformFn: XbrlUtility.linksLocsArcsIndexedInterleaveTransform,
        },
  //     @ins["foot_arcs"].each do |i|
  //       foot = begin @ins["foots"].select {|foot| foot["label"] == i["to"] }.first rescue {} end
  //       footnote_h = {
  //         "href" => begin @ins["foot_locs"].select {|l| l["label"] == i["from"] }.first["href"] || "" rescue "" end,
      },
      attSelectors: {
        contextRef: {
          rename: 'instances',
          atts: [
            'contextRef',
            'decimals',
            'id',
            'unitRef',
            'nil',
            'lang', // 'xml:lang'
          ],
          textContent: true,
          // transformFn: XbrlUtility.objsArrayToObjObjsByNodeNameContextTransform,
          transformFn: XbrlUtility.objsArrayToObjObjsObjsByNodeNameContextTransform,
        },
      },
      transformFn: XbrlUtility.instanceFootnotesInterleaveTransform,
    };
    // #item names map to xsd elements, with first underscore changed to colon;
    // #item unitRefs map internally to unit id
    // #item contextRefs map interanlly to context ids
    // #xbrldi:explicitMember dimension under contexts maps to ?;
    // # explicitMember text (colon needs to be changed to underscore) maps to xsd element id where it is in the company's namespace
    // #entity is cik
  }

  public static get XBRL_TYPE_TO_STRUCTURE(): {xsd, pre, def, cal, lab, ins} {
    return {
      xsd: XbrlUtility.XSD_STRUCTURE,
      pre: XbrlUtility.PRE_STRUCTURE,
      def: XbrlUtility.DEF_STRUCTURE,
      cal: XbrlUtility.CAL_STRUCTURE,
      lab: XbrlUtility.LAB_STRUCTURE,
      ins: XbrlUtility.INS_STRUCTURE,
    };
  }

  public static justTextTransform(objs: any []) { return ((objs || [])[0] || {}).textContent; }

  public static replaceDimensionTextContentColonTransform(objs: any []) {
    return (objs || []).map((obj) => {
      if (obj.dimension) {
        obj.dimension = (obj.dimension || '').replace(':', '_');
      }
      if (obj.textContent) {
        obj.textContent = (obj.textContent || '').replace(':', '_');
      }
      return obj;
    });
  }

  public static arrayedTextTransform(objs: any[]) { return (objs || []).map((i) => (i || {}).textContent ); }

  public static firstArrayItemTransform(objs: any[]) { return (objs || [])[0]; }

  public static objsArrayToObjObjsTransform(objs: any[], keyOrFn: any) { let obj = {}; (objs || []).map((i) => obj[typeof keyOrFn === 'function' ? keyOrFn(i) : i[keyOrFn]] = i); return obj; }

  public static objsArrayToObjObjsObjsTransform(objs: any[], firstKeyOrFn: any, secondKeyOrFn: any) {
    let obj = {};
    (objs || []).map((i) => {
      let firstKey = typeof firstKeyOrFn === 'function' ? firstKeyOrFn(i) : i[firstKeyOrFn];
      let secondKey = typeof secondKeyOrFn === 'function' ? secondKeyOrFn(i) : i[secondKeyOrFn];
      let exitingObj = obj[firstKey] || {};
      exitingObj[secondKey] = i;
      obj[firstKey] = exitingObj;
    });
    return obj;
  }

  public static objsArrayToObjObjsMultipleIndexedTransform(objs: any[], keys: any[]) { let obj = {}; (objs || []).map((i) => { keys.map((key) => obj[i[key]] = i); }); return obj; }

  public static objsArrayToObjObjsByLabelTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'label'); }

  public static objsArrayToObjObjsObjsByLabelRoleTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsObjsTransform(objs, 'label',
    (nestedObj) => { XbrlUtility.getLastSlash((nestedObj || {}).role || ''); }
  ); }

  public static objsArrayToObjObjsByRoleURITransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'roleURI'); }

  public static objsArrayToObjObjsByIdTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'id'); }

  public static objsArrayToObjObjsByToHrefTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'toHref'); }

  public static objsArrayToObjObjsByFromTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'from'); }

  public static objsArrayToObjObjsByFromHrefTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, 'fromHref'); }

  public static objsArrayToObjObjsByNodeNameContextTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsTransform(objs, (i) =>
    (i.nodeName || '').replace(':', '_') + '__' + (i.contextRef || '')
  ); }
  // public static objsArrayToObjObjsObjsByNodeNameContextTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsObjsTransform(objs, 'nodeName', 'contextRef'); }
  public static objsArrayToObjObjsObjsByNodeNameContextTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsObjsTransform(objs, (i) =>
    (i.nodeName || '').replace(':', '_'), 'contextRef'); }

  public static objsArrayToObjObjsByLabelHrefTransform(objs: any []) { return XbrlUtility.objsArrayToObjObjsMultipleIndexedTransform(objs, ['label', 'href']); }

  public static linkLocsArcsInterleaveTransform(linkObj) {
    let locs = linkObj.locs || {};
    let arcs = linkObj.arcs || [];
    arcs.map((arc) => {
      arc.toHref = (locs[arc.to] || {}).href;
      arc.fromHref = (locs[arc.from] || {}).href;
    });
    // linkObj.arcs = arcs;
    return linkObj;
  }

  public static linkLocsArcsIndexedInterleaveTransform(linkObj) {
    // let labels = linkObj.locs || {};
    let locs = linkObj.locs || {};
    let arcs = linkObj.arcs || [];
    arcs.map((arc) => {
      arc.toHref = arc.to;
      arc.fromHref = (locs[arc.from] || {}).href;
    });
    // linkObj.arcs = XbrlUtility.objsArrayToObjObjsByFromTransform(arcs);
    linkObj.arcs = XbrlUtility.objsArrayToObjObjsByFromHrefTransform(linkObj.arcs);
    // linkObj.arcs = arcs;
    // console.log('linkObj: ', JSON.stringify(linkObj));
    // console.log('linkObj.arcs: ', JSON.stringify(linkObj.arcs));
    return linkObj;
  }

  public static linksLocsArcsInterleaveTransform(linkObjs) {
    return (linkObjs || []).map((linkObj) => XbrlUtility.linkLocsArcsInterleaveTransform(linkObj));
  }

  public static linksLocsArcsIndexedInterleaveTransform(linkObjs) {
    return (linkObjs || []).map((linkObj) => XbrlUtility.linkLocsArcsIndexedInterleaveTransform(linkObj));
  }

  public static instanceFootnotesInterleaveTransform(obj) {
    let instances = (obj || {}).instances;
    // console.log('(obj || {}).footnoteLinks: ', JSON.stringify((obj || {}).footnoteLinks));
    let footnoteLink = ((obj || {}).footnoteLinks || [])[0] || {};
    // console.log('footnoteLink: ', JSON.stringify(footnoteLink));
    let arcs = footnoteLink.arcs;
    // console.log('arcs: ', JSON.stringify(arcs));
    // console.log('typeof arcs: ', typeof arcs);
    let footnotes = footnoteLink.footnotes;
    // console.log('footnotes: ', JSON.stringify(footnotes));
    if (!XbrlUtility.isBlank(arcs)) {
      Object.keys(instances).map((contextRef) => {
        let contextRefInstances = instances[contextRef];
        Object.keys(contextRefInstances).map((instanceKey) => {
          let instance = contextRefInstances[instanceKey] || {};
          let arc = arcs['#' + instance.id];
          if (!XbrlUtility.isBlank(arc)) {
            let footnote = footnotes[arc.to];
            if (!XbrlUtility.isBlank(footnote)) {
              instance.footnotes = instance.footnotes || [];
              instance.footnotes.push(footnote);
              console.log('instance.footnotes: ', JSON.stringify(instance.footnotes));
            }
          }
        });
      });
    }
    return obj;
  }

  public static handleUnitsTransform(objs: any[]): any {
    let revisedObjs = objs.map((obj) => {
      if (!XbrlUtility.isBlank((obj || {}).measure)) {
        obj.display = obj.measure;
      } else if (!XbrlUtility.isBlank((obj || {}).divide)) {
        let numerator = ((obj.divide || {}).unitNumerator || {}).measure;
        let denominator = ((obj.divide || {}).unitDenominator || {}).measure;
        obj.display = (numerator || '--') + '/' + (denominator || '--');
      } else {
        // console.log('unhandled handleUnitsTransform: ', JSON.stringify(obj));
      }
      return obj;
    });
    // console.log('handleUnitsTransform: ', JSON.stringify(revisedObjs));
    return XbrlUtility.objsArrayToObjObjsByIdTransform(revisedObjs);
  }

  public static processDoc(doc: XMLDocument, verbose: boolean, fn: (doc: XMLDocument, nsHref: string, nsPrefix: string, nss: {}) => {}): any {
    let nsHref;
    let nsPrefix;
    let nss;
    ({nsHref, nsPrefix, nss} = XbrlUtility.getNamespace(doc));
    if (verbose) {
      console.log('doc', doc);
    }
    let returnObj = fn(doc, nsHref, nsPrefix, nss);
    return returnObj;
  }

  public static processTypeDoc(doc: XMLDocument, type, verbose?: boolean): any {
    return XbrlUtility.processDoc(doc, verbose, (returnedDoc, nsHref, nsPrefix, nss) => {
      let returnObj  =  {type, roleURIs: []};
      returnObj = XbrlUtility.processStructure(returnedDoc, nsHref, nsPrefix, nss, XbrlUtility.XBRL_TYPE_TO_STRUCTURE[type], returnObj);
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
    XbrlUtility.INS_NSPREFIXES.forEach((ns) => {
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
    return nsHref ? doc.getElementsByTagNameNS(nsHref, tag) : doc.getElementsByTagName(tag);
  }

  public static getNodeAtts(node, atts: any, nsHref, nsPrefix, nss, obj?: any): any {
    // console.log('atts: ', JSON.stringify(atts));
    if (node && atts) {
      // console.log('atts: ', JSON.stringify(atts));
      let returnObj = obj || {};
      // console.log('nsUris: ', nss);
      let nsUris = Object.keys(nss || {});
      (atts || []).forEach((att) => {
        // console.log('att: ', att);
        let attVal = node.getAttribute(att);
        if (attVal === null) {
          for (let i in nsUris) {
            if (i.length > 0) {
              attVal = XbrlUtility.getNodeAttNS(node, att, (nss || {})[nsUris[i]]);
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
    return nsHref ? node.getAttributeNS(nsHref, att) : node.getAttribute(att);
  }

  public static getNodeTagsAtts(
    node,
    tag: string,
    attSelector: string,
    atts: string[],
    textContent: boolean,
    transformFn: (untransformedObj: any) => any,
    nsHref,
    nsPrefix,
    nss,
    fn?: (node: any, nsHref: string, nsPrefix: string, nss: {}, obj: {}) => [any]
  ): any {
    if (node && (tag || attSelector)) {
      // console.log('tag: ', tag);
      // console.log('node: ', node);
      let parse = attSelector ?  node.querySelectorAll('[' + attSelector + ']') : XbrlUtility.parseTag(tag, nsHref, nsPrefix, nss, node, false);
      // console.log('parse: ', JSON.stringify(Object.keys(parse)));
      let objs = [];
      for (let i in Object.keys(parse)) {
        if (i.length > 0) {
          let parseI = parse[i];
          if (parseI) {
            // console.log('parseI: ', JSON.stringify(parseI));
            let nestedObj = <any> {};
            // nestedObj.tagName = ((parseI || {}).tagName || '').trim();
            nestedObj.nodeName = ((parseI || {}).nodeName || '').trim();
            nestedObj.localName = ((parseI || {}).localName || '').trim();
            if (textContent) {
              nestedObj.textContent = ((parseI || {}).textContent || '').trim();
            }
            // console.log('nestedObj: ', JSON.stringify(nestedObj));
            nestedObj = XbrlUtility.getNodeAtts(parseI, atts, nsHref, nsPrefix, nss, nestedObj);
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

  public static htmlToMDA(html: string): any[] {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    let node = (<Element> doc.lastChild);
    return XbrlUtility.selectionToMDA(node);
  }

  public static selectionToMDA(node, mda: any[] = []): any[] {
    node.childNodes.forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        if (!XbrlUtility.isBlank(childNode.textContent)) {
          mda.push(childNode.textContent);
        }
      } else {
        let childMDA = XbrlUtility.selectionToMDA(childNode, mda);
        // if (!XbrlUtility.isBlank(childMDA)) {
        //   mda.push(childMDA);
        // }
      }
    });
    return mda;
  }

  public static processStructure(doc: XMLDocument, nsHref: string, nsPrefix: string, nss: {}, structure: XbrlStructureInterface, obj: {}): any {
    let tags = Object.keys(structure.tags || {}) || [];
    let attSelectors = Object.keys(structure.attSelectors || {}) || [];

    // .tagName
    for (let i in Object.keys(tags)) {
      if (i.length > 0) {
        let tag = tags[i];
        let nodeStructure = structure.tags[tag];
        let name = nodeStructure.rename || tag;
        let nestedTagsObj = nodeStructure.tags;
        let nestedAttSelectorsObj = nodeStructure.attSelectors;
        let nodeTagResults = XbrlUtility.getNodeTagsAtts(doc, tag, null, nodeStructure.atts, nodeStructure.textContent, nodeStructure.transformFn, nsHref, nsPrefix, nss,
        nestedTagsObj ? (node, rNsHref, rNsPrefix, rNss, nestedObj): any => {
          return XbrlUtility.processStructure(node, rNsHref, rNsPrefix, rNss, {tags: nestedTagsObj, attSelectors: nestedAttSelectorsObj}, nestedObj);
        } : null);
        if (!XbrlUtility.isBlank(nodeTagResults)) { obj[name] = nodeTagResults; }
      }
    }
    for (let i in attSelectors) {
      if (i.length > 0) {
        let attSelector = attSelectors[i];
        let nodeStructure = structure.attSelectors[attSelector];
        let nestedTagsObj = nodeStructure.tags;
        let nestedAttSelectorsObj = nodeStructure.attSelectors;
        let nodeTagResults = XbrlUtility.getNodeTagsAtts(doc, null, attSelector, nodeStructure.atts, nodeStructure.textContent, nodeStructure.transformFn, nsHref, nsPrefix, nss,
        nestedTagsObj ? (node, rNsHref, rNsPrefix, rNss, nestedObj): any => {
          return XbrlUtility.processStructure(node, rNsHref, rNsPrefix, rNss, {tags: nestedTagsObj, attSelectors: nestedAttSelectorsObj}, nestedObj);
        } : null);
        let name = nodeStructure.rename || attSelector;
        if (!XbrlUtility.isBlank(nodeTagResults)) { obj[name] = nodeTagResults; }
      }
    }
    return structure.transformFn ? structure.transformFn(obj) : obj;
  }

  public static getXbrlRoleURIs(parsedXbrl): string[] {
    if (parsedXbrl.type === 'xsd') {
      // return parsedXbrl.roles.map((i) => i.roleURI);
      return Object.keys(parsedXbrl.roleTypes || {});
    } else if (parsedXbrl.type === 'pre') {
      return parsedXbrl.presentationLinks.map((i) => i.role);
    } else if (parsedXbrl.type === 'def') {
      return parsedXbrl.definitionLinks.map((i) => i.role);
    } else if (parsedXbrl.type === 'cal') {
      return parsedXbrl.calculationLinks.map((i) => i.role);
    }
  }

  public static getXbrlsRoleURIs(parsedXbrls): any {
    let roleURIs: string[] = [];
    parsedXbrls.forEach((parsedXbrl) => {
      roleURIs = roleURIs.concat(XbrlUtility.getXbrlRoleURIs(parsedXbrl));
    });
    return XbrlUtility.uniqueCompact(roleURIs);
  }

  public static getRoleURIDefinition(xbrlVReport, roleURI): string {
    return (((((xbrlVReport || {}).xbrls || {}).xsd || {}).roleTypes || {})[roleURI] || {}).definition;
  }

  public static unique(array?: any[]): any[] {
    return (array || []).filter((v, i, a) => a.indexOf(v) === i);
  }

  public static uniqueCompact(array?: any[]): any {
    return (array || []).filter((v, i, a) => a.indexOf(v) === i && v !== null && v !== undefined);
  }

  public static isBlank(obj: any): boolean {
    return obj === null || obj === undefined || (typeof obj === 'object' && Object.keys(obj).length === 0) || (typeof obj !== 'object' && obj.length === 0);
  }

  public static isNumber(obj: any): boolean {
    if (XbrlUtility.isBlank(obj)) {
      return false;
    }
    if (typeof obj === 'number' && !isNaN(obj) && isFinite(obj)) {
      return true;
    }
    obj = obj.toString().trim();
    if (XbrlUtility.isBlank(obj)) {
      return false;
    }
    return !!obj.match(/^[+-]?(\d+)?(\.\d+(e(\+|\-)\d+)?)?$/);
  }

  public static isArray(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  public static splitXbrlHref(href): string { return (href || '').replace(/(.*?_)/, ''); }

  public static getHrefAnchor(href): string { let pieces = (href || '').split('#'); return pieces[pieces.length - 1]; }

  public static getLastSlash(href): string { let pieces = (href || '').split('/'); return pieces[pieces.length - 1]; }

  public static manageLabelBreaks(str): string {
    return (XbrlUtility.isBlank(str) ? '' : str).toString().replace(/[ -]/g, (m, i) => (i % 80 > 60) ? m : (m.match(/ /) ? '\u00a0' : '\u2011'));
  }

  public static growTree(from: string, arcs: any[] = [], instances: any): any {
    let tree: any = {};
    let arcsPool = arcs.slice(0);
    arcs.forEach((arc) => {
      if (from === (arc || {}).from) {
        let newArc = JSON.parse(JSON.stringify(arc));
        let index = arcsPool.indexOf(arc);
        if (index > -1) { arcsPool.splice(index, 1); }
        let to = arc.to;
        let instanceTo = (arc.toHref || '').split('#')[1];
        let itemInstances = (instances || {})[instanceTo];
        if (!XbrlUtility.isBlank(itemInstances)) { newArc.instances = itemInstances; }
        let branch = XbrlUtility.growTree(to, arcsPool, instances);
        if (!XbrlUtility.isBlank(branch)) { newArc.branch = branch; }
        tree[to] = newArc;
        // console.log('branch: ', JSON.stringify(branch));
      }
    });
    // console.log('tree: ', JSON.stringify(tree));
    // return XbrlUtility.isBlank(tree) ? null : tree;
    return tree;
  }

  public static constructTrees(links: any[] = [], instances: any): any {
    let trees = [];
    links.forEach((link) => {
      // trees = trees.concat(XbrlUtility.constructTree(link));
      let arcs = link.arcs;
      trees.push(XbrlUtility.constructTree(arcs, instances));
    });
    return trees;
  }

  public static constructTree(arcs: any[] = [], instances: any): any {
    let trees = [];
    let froms = XbrlUtility.uniqueCompact(arcs.map((i) => (i || {}).from));
    let tos = XbrlUtility.uniqueCompact(arcs.map((i) => (i || {}).to));
    let rootFroms = froms.filter((i) => tos.indexOf(i) < 0);
    // let rootFrom = rootFroms[0];
    // if (rootFroms.length > 0) {
    //   console.log('rootFroms: ', JSON.stringify(rootFroms));
    // }
    let tree = {};
    (rootFroms || []).forEach((rootFrom) => {
      let arc = arcs.find((i) => (i || {}).from === rootFrom);
      let newArc = JSON.parse(JSON.stringify(arc));
      let instanceTo = (arc.fromHref || '').split('#')[1];
      let itemInstances = (instances || {})[instanceTo];
      if (!XbrlUtility.isBlank(itemInstances)) { newArc.instances = itemInstances; }
      let branch = XbrlUtility.growTree(rootFrom, arcs, instances);
      if (!XbrlUtility.isBlank(branch)) { newArc.branch = branch; }
      tree[rootFrom] = newArc;
      // trees.push(tree);
    });
    // return trees;
    return tree;
  }

  public static getContextRefs(tree: any, definitionTree?: any): string[] {
    let contextRefs = [];
    Object.keys(tree).forEach((rootKey) => {
      let root = tree[rootKey];
      contextRefs = contextRefs.concat(Object.keys(root.instances || {}));
      let branch = root.branch;
      if (branch) {
        contextRefs = contextRefs.concat(XbrlUtility.getContextRefs(branch, definitionTree));
      }
    });
    return XbrlUtility.uniqueCompact(contextRefs);
  }

  public static pareContextRefs(contextRefs: any = [], contexts: any = [], dimensions?: [any]): {paredContextRefs: string[], paredPeriodKeys: string[], paredPeriods: any} {
    // console.log('dimensions: ', JSON.stringify(dimensions));
    let paredContextRefs: string[] = [];
    let paredPeriods: any = {};
    let paredPeriodKeys: string[] = [];
    let anyDimensions = !XbrlUtility.isBlank(dimensions);
    contextRefs.forEach((contextRef) => {
      let includeContext = false;
      let context = contexts[contextRef] || {};
      let entities = (context.entity || []);
      let segments = [];
      entities.forEach((entity) => segments = segments.concat((entity || {}).segments || []));
      // console.log('segments: ', JSON.stringify(segments));
      if (anyDimensions) {
        let explicitMembers = [];
        segments.forEach((segment) => explicitMembers = explicitMembers.concat((segment || {}).explicitMember || []));
        // console.log('explicitMembers: ', JSON.stringify(explicitMembers));
        let foundDimension = explicitMembers.find((explicitMember: any = {}) => {
          return dimensions.find((dimension: any = {}) => explicitMember.dimension === dimension.dimension && explicitMember.textContent === dimension.member );
        });
        if (!XbrlUtility.isBlank(foundDimension)) {
          includeContext = true;
        }
      // } else if (XbrlUtility.isBlank(segments)) {
      }
      if (XbrlUtility.isBlank(segments)) {
        includeContext = true;
      }

      if (includeContext) {
        paredContextRefs.push(contextRef);
        let periodKey = XbrlUtility.periodToKey(context.period, ' to ');
        paredPeriodKeys.push(periodKey);
        let periodContextRefs = paredPeriods[periodKey] || [];
        periodContextRefs.push(contextRef);
        paredPeriods[periodKey] = periodContextRefs;
      }
      paredPeriodKeys = XbrlUtility.uniqueCompact(paredPeriodKeys).sort();
// Line  { "nodeName": "xbrli:context", "localName": "context", "id": "Context_FYE_01_Jan_2014T00_00_00_TO_31_Dec_2014T00_00_00_RangeAxis_MinimumMember",
  // "entity": [ { "nodeName": "xbrli:entity", "localName": "entity",
    // "identifier": [ { "nodeName": "xbrli:identifier", "localName": "identifier", "textContent": "0001371128", "scheme": "http://www.sec.gov/CIK" } ],
    // "segments": [ { "nodeName": "xbrli:segment", "localName": "segment", "textContent": "us-gaap:MinimumMember",
      // "explicitMember": [ { "nodeName": "xbrldi:explicitMember", "localName": "explicitMember", "textContent": "us-gaap:MinimumMember", "dimension": "us-gaap:RangeAxis" } ] } ] } ],
  // "period": { "nodeName": "xbrli:period", "localName": "period", "startDate": "2014-01-01", "endDate": "2014-12-31" } }
    });
    // return XbrlUtility.uniqueCompact(paredContextRefs);
    // console.log('paredContextRefs: ', JSON.stringify(paredContextRefs));
    return {paredContextRefs, paredPeriodKeys, paredPeriods};
  }

  public static getContextRefHeading(contextRef: string, contexts: any): string {
    let context = ((contexts || {})[contextRef] || {});
    let period = context.period || {};
    let date = XbrlUtility.periodToKey(period, ' to ');
    let entity = (context.entity || [])[0] || {};
    let identifierTextContent = ((entity.identifier || [])[0] || {}).textContent;
    let segmentTextContent = ((entity.segments || [])[0] || {}).textContent;
    let segmentExplicitMemberTextContent = (((((entity.segments || [])[0] || {}).explicitMember || [])[0]) || {}).textContent;
    let heading = XbrlUtility.uniqueCompact([date, identifierTextContent, segmentTextContent, segmentExplicitMemberTextContent]).join(', ');
    return heading;
    // return context;
  }

  public static periodToKey(period: {instant?: string, startDate?: string, endDate?: string}, separator: string = '-'): string {
    return !XbrlUtility.isBlank(period.instant) ? period.instant : ((period.startDate || 'NA') + separator + (period.endDate || 'NA'));
  }

  public static getLabel(lab: any = {}, toHref: string, role?: string): string {
    // console.log('lab.arcs: ', JSON.stringify(lab.arcs));
    let arc = (lab.arcs || {})[toHref] || {};
    // console.log('arc: ', JSON.stringify(arc));
    let to = arc.to;
    // console.log('toHref: ', toHref);
    // console.log('to: ', to);
    // console.log('role: ', role);
    let labels = lab.labels[to] || {};
    let label: any;
    if (!XbrlUtility.isBlank(role)) {
      let roleStub = XbrlUtility.getLastSlash(role);
      label = labels[roleStub];
    }
    if (XbrlUtility.isBlank(label)) {
      // let labelKeys = Object.keys(labels);
      let roleStubs = XbrlUtility.LABEL_ROLES;
      let roleStub = roleStubs.find((i) => !XbrlUtility.isBlank(labels[i]));
      label = labels[roleStub];
    }
    // console.log('label: ', JSON.stringify(label));
    return (label || {textContent: ''}).textContent;
  }

  public static getXbrlVReportDescription(xbrlVReport: XbrlVReportInterface): string {
    // DocumentDocumentAndEntityInformation
    // let documentAndEntityInformationRoleURI = (xbrlVReport || {roleURIs: []}).roleURIs.find((roleURI) => roleURI && roleURI.match(/DocumentAndEntityInformation/i));
    // let xbrlVStatement = ((xbrlVReport || {xbrlVStatements: {}}).xbrlVStatements || {})[documentAndEntityInformationRoleURI] || {};
    // let xbrlStatementKeys = xbrlVStatement.xbrlStatementKeys || [];
    // let periodEnd = xbrlStatementKeys.find((xbrlStatementKey) => xbrlStatementKey && xbrlStatementKey.match(/PeriodEnd/i));
    let instances = ((xbrlVReport.xbrls || {}).ins || {}).instances || {};
    // console.log('instances: ', JSON.stringify(instances));
    let values = [];
    [
      'dei_DocumentPeriodEndDate',
      'dei_DocumentType',
      'dei_AmendmentFlag',
      // 'dei_DocumentFiscalYearFocus',
      // 'dei_DocumentFiscalPeriodFocus',
      // 'dei_CurrentFiscalYearEndDate'
    ].forEach((insKey) => {
      let instance = instances[insKey] || {};
      // console.log('JSON.stringify(instance): ', JSON.stringify(instance));
      let textContent = ((instance || {})[Object.keys(instance)[0]] || {}).textContent;
      // console.log('JSON.stringify(Object.keys(instances)): ', JSON.stringify(Object.keys(instances)));
      // console.log('XbrlUtility.isBlank(instances): ', XbrlUtility.isBlank(instances));
      // console.log('textContent: ', textContent);
      if (!XbrlUtility.isBlank(textContent)) {
        if (insKey === 'dei_AmendmentFlag') {
          if (textContent.toString() === 'true') {
            values.push('(amended)');
          }
        } else {
          values.push(textContent);
        }
      }
    });
    return values.join(' ');
  }

  public static rectangularizeTree(tree: any, rectangle: any = {}, level: number = 0, hypercubeDimension?: string): any {
    let keys = Object.keys(tree || {}).sort((a, b) => parseFloat((tree[a] || {order: 0}).order || 0) - parseFloat((tree[b] || {order: 0}).order || 0));
    let lastIndex = keys.length - 1;
    keys.forEach((key, index) => {
      let treeItem = tree[key] || {};
      let arcroleStub = XbrlUtility.getLastSlash(treeItem.arcrole);
      // if (arcroleStub !== 'all') {
      // if (arcroleStub !== 'hypercube-dimension') {
      // if (arcroleStub !== 'dimension-domain') {
      let to = treeItem.to;
      let toHref = treeItem.toHref;
      let preferredLabel = treeItem.preferredLabel;
      let instances = treeItem.instances;
      let lastChild = index === lastIndex;
      let domainMember;
      if (arcroleStub === 'hypercube-dimension') {
        hypercubeDimension = XbrlUtility.getHrefAnchor(treeItem.toHref);
      } else if (arcroleStub === 'domain-member' && !XbrlUtility.isBlank(hypercubeDimension)) {
        domainMember = XbrlUtility.getHrefAnchor(treeItem.toHref);
      }
      if (!XbrlUtility.isBlank(instances) || !XbrlUtility.isBlank(domainMember)) {
        rectangle[key] = {to, toHref, preferredLabel, instances, level, lastChild, hypercubeDimension, domainMember};
      }
      let branch = (treeItem || {}).branch;
      if (!XbrlUtility.isBlank(branch)) {
        rectangle = XbrlUtility.rectangularizeTree(branch, rectangle, level + 1, hypercubeDimension);
      }
    });
    return rectangle;
  }

  public static rectangularizeXbrlStatement(xbrlStatement: XbrlStatementInterface, contexts) {
    let tree = (xbrlStatement || {definitionCompositeLinkTree: {}}).definitionCompositeLinkTree;
    if (XbrlUtility.isBlank(tree)) {
      tree = (xbrlStatement || {presentationCompositeLinkTree: {}}).presentationCompositeLinkTree || {};
    }
    // let tree = (xbrlStatement || {presentationCompositeLinkTree: {}}).presentationCompositeLinkTree || {};
    let dimensions = XbrlUtility.getXbrlStatementDimensions(xbrlStatement);
    let paredContextRefs: string[] = [];
    let paredPeriodKeys: string[] = [];
    let paredPeriods: any = {};
    ({paredContextRefs, paredPeriodKeys, paredPeriods} = XbrlUtility.pareContextRefs(xbrlStatement.contextRefs, contexts, dimensions));
    let paredContexts = {};
    paredContextRefs.forEach((paredContextRef) => paredContexts[paredContextRef] = contexts[paredContextRef]);
    let rectangle = XbrlUtility.rectangularizeTree(tree) || {};
    let rectangleKeys = Object.keys(rectangle);
    return {paredContextRefs, paredContexts, paredPeriodKeys, paredPeriods, rectangle, rectangleKeys, dimensions};
  }

  public static rectangularizeXbrlVStatement(xbrlVStatement: XbrlVStatementInterface, contexts) {
    let paredContextRefs: string[] = [];
    let paredContexts = {};
    let paredPeriodKeys: string[] = [];
    let paredPeriods: any = {};
    let rectangle;
    let rectangleKeys;
    let dimensions;
    ({paredContextRefs, paredContexts, paredPeriodKeys, paredPeriods, rectangle, rectangleKeys, dimensions} = XbrlUtility.rectangularizeXbrlStatement(xbrlVStatement.xbrlStatement, contexts));
    xbrlVStatement.paredContextRefs = paredContextRefs;
    xbrlVStatement.paredContexts = paredContexts;
    xbrlVStatement.paredPeriodKeys = paredPeriodKeys;
    xbrlVStatement.paredPeriods = paredPeriods;
    xbrlVStatement.rectangle = rectangle;
    xbrlVStatement.rectangleKeys = rectangleKeys;
    xbrlVStatement.dimensions = dimensions;
    return xbrlVStatement;
  }

  public static constructXbrlStatement(roleURI: string, xbrlReport: XbrlReportInterface = {}): XbrlStatementInterface {
    let xbrlStatement: XbrlStatementInterface = {
      roleURI,
      roleDefinition: null,
      items: null,
      contexts: null,
      units: null,
    };
    // console.log('((xbrlReport.xsd || {}).roleTypes || []): ', JSON.stringify(((xbrlReport.xsd || {}).roleTypes || [])));
    // let xsdRole = ((xbrlReport.xsd || {}).roleTypes || []).find((i) => (i || {}).roleURI === roleURI );
    let xsdRole = ((xbrlReport.xsd || {}).roleTypes || [])[roleURI];
    // let xsdElement = ((xbrlReport.xsd || {}).elements || []).find((i) => (i || {}).id === a.toHref.split('#').last );

    let presentationLinks: any[] = (((xbrlReport || {}).pre || {}).presentationLinks || []).filter((i) => (i || {}).role  === roleURI);
    xbrlStatement.preLinkTypes = presentationLinks.map((i) => i.type);

    // xbrlStatement.preLinkTypes = XbrlUtility.uniqueCompact(presentationLinks.map((i) => i.type));

    let definitionLinks: any[] = (((xbrlReport || {}).def || {}).definitionLinks || []).filter((i) => (i || {}).role  === roleURI);
    xbrlStatement.defLinkTypes = definitionLinks.map((i) => i.type);
    // xbrlStatement.defLinkTypes = XbrlUtility.uniqueCompact(definitionLinks.map((i) => i.type));

    let calculationLinks: any[] = (((xbrlReport || {}).cal || {}).calculationLinks || []).filter((i) => (i || {}).role  === roleURI);
    xbrlStatement.calLinkTypes = calculationLinks.map((i) => i.type);
    // xbrlStatement.calLinkTypes = XbrlUtility.uniqueCompact(calculationArcs.map((i) => i.type));

    xbrlStatement.roleDefinition = (xsdRole || {}).definition; // || presentationArcs.title || definitionArcs.title || calculationArcs.title;
    xbrlStatement.roleUse = (xsdRole || {}).usedOn;

    let items = {};
    let contextRefs = [];
    ([['presentation', presentationLinks], ['definition', definitionLinks], ['calculation', calculationLinks]]).forEach((pair) => {
      let str = pair[0];
      let links = pair[1];

      // if (str === 'definition') {
      //   let updatedLinks = [];
      //   links.map(
      //     (link) => {
      //       let updatedArcs = [];
      //       link.arcs.map(
      //         (arc) => {
      //           if (
      //             arc.from === 'loc_us-gaap_PropertyPlantAndEquipmentLineItems_0' &&
      //             arc.to === 'loc_us-gaap_ScheduleOfPropertyPlantAndEquipmentTable_1'
      //           ) {
      //             arc.to = 'loc_us-gaap_PropertyPlantAndEquipmentLineItems_0';
      //             arc.from = 'loc_us-gaap_ScheduleOfPropertyPlantAndEquipmentTable_1';
      //           }
      //           updatedArcs.push(arc);
      //         }
      //       );
      //       link.arcs = updatedArcs;
      //       updatedLinks.push(link);
      //     }
      //   );
      //   links = updatedLinks;
      // }
      let trees = XbrlUtility.constructTrees(links, xbrlReport.ins.instances);
      xbrlStatement[str + 'LinkTrees'] = trees;
      trees.forEach((tree) => contextRefs = contextRefs.concat(XbrlUtility.getContextRefs(tree)));
      contextRefs.push();
      let arcs = [];
      links.map((link) => arcs = arcs.concat(link.arcs));
      // if (trees.length > 1) {
      if (trees.length > 0) {
        let tree = XbrlUtility.constructTree(arcs, xbrlReport.ins.instances);
        xbrlStatement[str + 'CompositeLinkTree'] = tree;
      }
      links.forEach((link) => {
        ((link || {}).arcs || []).forEach((arc) => {
  //           if (a["to_href"] == to_href || EdgarItemSchema.split_href(a["to_href"]) == EdgarItemSchema.split_href(to_href)) && a["cal_from_href"].blank? // cal
          let item = items[arc.to] || {};
          let existingArcs = item[str + 'Arcs'] || [];
          existingArcs.push(arc);
          item[str + 'Arcs'] = existingArcs;
          items[arc.to] = item;
        });
      });
    });
    xbrlStatement.items = items;
    xbrlStatement.contextRefs = XbrlUtility.uniqueCompact(contextRefs);

    return xbrlStatement;
  }

  public static getXbrlStatementDimensions(xbrlStatement: XbrlStatementInterface = {}): any {
    let xbrlStatementDimensions = [];
    let xbrlStatementLines = [];
    let definitionCompositeLinkTree = xbrlStatement.definitionCompositeLinkTree;
    if (!XbrlUtility.isBlank(definitionCompositeLinkTree)) {
      let lines = XbrlUtility.traverseDefinitionCompositeLinkTree(definitionCompositeLinkTree);
      // console.log('lines: ', JSON.stringify(lines));
      return lines;
    }
  }

  public static traverseDefinitionCompositeLinkTree(definitionCompositeLinkTree: any, lines: any = [], line: any = {}): any {
    if (!XbrlUtility.isBlank(definitionCompositeLinkTree)) {
      Object.keys(definitionCompositeLinkTree).forEach((key) => {
        let branch = definitionCompositeLinkTree[key];
        let arcroleStub = XbrlUtility.getLastSlash(branch.arcrole);
        let scopedLine = JSON.parse(JSON.stringify(line));
        if (arcroleStub === 'hypercube-dimension') {
          scopedLine.dimension = XbrlUtility.getHrefAnchor(branch.toHref);
        } else if (arcroleStub === 'domain-member' && !XbrlUtility.isBlank(scopedLine)) {
          scopedLine.member = XbrlUtility.getHrefAnchor(branch.toHref);
          lines.push(scopedLine);
        }
        if (!XbrlUtility.isBlank(branch.branch)) {
          lines = XbrlUtility.traverseDefinitionCompositeLinkTree(branch.branch, lines, scopedLine);
        }
      });
    }
    return lines;
  }

  public static categorizeStatement(definition): any {
    let statementCategoryObj = {coreStatement: 0, statementCategory: 0};
    let lowerDefinition = definition.toLowerCase();
    let pieces = lowerDefinition.split('-');
    if (pieces[1] && pieces[1].toLowerCase().match(/statement/)) {
      statementCategoryObj.coreStatement = 1;
    }

  //   if (statementCategoryObj.coreStatement) {
  //     if (XbrlUtility.BALANCE_SHEET_TERMS.some((terms) => {
  //       return XbrlUtility.isArray(terms) ? terms.every((term) => lowerDefinition.match(new RegExp(term))) : lowerDefinition.match(new RegExp(terms));
  //     }) {
  //       statementCategoryObj.statementCategory = statementCategoryObj.statementCategory + 1001;
  //     }
  //         @match = 0
  //         income_statement_terms.each do |term|
  //           if term.class == Array 
  //             @match = 1 unless term.collect { |sub_term| /#{sub_term}/.match(item.downcase)}.include?(nil)
  //           else 
  //             @match = 1 unless (/#{term}/.match(item.downcase).nil? || (term == "income" && !/equity/.match(item.downcase).nil?) || 
  //               (term == "earning" && !/retained/.match(item.downcase).nil?))
  //           end
  //         end
  //         if @match == 1            
  //           if /comprehensive/.match(item.downcase).nil?
  //             @result["statement_category"] += 2001
  //           else
  //             @result["statement_category"] += 5001
  //           end
  //         end

  //         @match = 0
  //         cash_flow_terms.each do |term|
  //           if term.class == Array 
  //             @match = 1 unless term.collect { |sub_term| /#{sub_term}/.match(item.downcase)}.include?(nil)
  //           else 
  //             @match = 1 unless /#{term}/.match(item.downcase).nil?
  //           end
  //         end
  //         if @match == 1
  //           @result["statement_category"] += 3001
  //         end

  //         @match = 0
  //         change_in_equity_terms.each do |term|
  //           if term.class == Array 
  //             @match = 1 unless term.collect { |sub_term| /#{sub_term}/.match(item.downcase)}.include?(nil)
  //           else 
  //             @match = 1 unless /#{term}/.match(item.downcase).nil?
  //           end
  //         end
  //         if @match == 1
  //           @result["statement_category"] += 4001
  //         end
        
  //         @match = 0
  //         parenthetical_terms.each do |term|
  //           if term.class == Array 
  //             @match = 1 unless term.collect { |sub_term| /#{sub_term}/.match(item.downcase)}.include?(nil)
  //           else 
  //             @match = 1 unless /#{term}/.match(item.downcase).nil?
  //           end
  //         end
  //         if @match == 1
  //           @result["statement_category"] += 100
  //         end

  //         @match = 0
  //         calc2_terms.each do |term|
  //           if term.class == Array 
  //             @match = 1 unless term.collect { |sub_term| /#{sub_term}/.match(item.downcase)}.include?(nil)
  //           else 
  //             @match = 1 unless /#{term}/.match(item.downcase).nil?
  //           end
  //         end
  //         if @match == 1
  //           @result["statement_category"] += 10
  //         end

  //       end
  //     end
      
  //   return @result
  // end
  }

  // http://xbrl.org/int/dim/arcrole/all - table
  // http://xbrl.org/int/dim/arcrole/hypercube-dimension - axis RangeAxis
  // http://xbrl.org/int/dim/arcrole/dimension-domain - heirarchy domain RangeMember
  // http://xbrl.org/int/dim/arcrole/domain-member - member MinimumMember MaximumMember
  // http://xbrl.org/int/dim/arcrole/dimension-default - hierarchy domain - default RangeMember

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

}
