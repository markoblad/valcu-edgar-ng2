import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { XbrlUtility } from '../edgar';
import { EdgarArchiveService } from '../edgar';
import { XbrlVReportInterface, XbrlVStatementInterface, XbrlReportInterface, XbrlStatementInterface } from '../edgar';
// import * as NlpCompromise from 'compromise';
import { XbrlService } from '../edgar';
import { VChartComponent } from '../v-chart';
import * as nlp from 'compromise/builds/compromise.es6.js';
import * as ml from 'machine_learning';
import * as JsDiff from 'diff/dist/diff.min.js';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home', // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public valcuLogo = 'assets/img/valcu_v.png';
  public name = 'valcu-edgar-ng2';
  // public url = 'https://twitter.com/valcuco';
  public url = '/';
  public isCollapsed = true;

  public localState = { value: '1371128' };
  public edgarContents: any = [];
  // TypeScript public modifiers

  public singleDatas: any[] = [];
  public multiDatas: any[] = [];

  constructor(
    public appState: AppState,
    public title: Title,
    public edgarArchiveService: EdgarArchiveService,
    public xbrlService: XbrlService
  ) {
    this.xbrlService.xbrlVReports = {
      '000121390016011346': {
        edgarArchiveFiles: [
          {
            type: 'xsd',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xsd',
          },
          {
            type: 'pre',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_pre.xml',
          },
          {
            type: 'def',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_def.xml',
          },
          {
            type: 'cal',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_cal.xml',
          },
          {
            type: 'lab',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231_lab.xml',
          },
          {
            type: 'ins',
            url: 'Archives/edgar/data/1371128/000121390016011346/bsrc-20151231.xml',
          },
        ],
      },
      '000121390017002526': {
        edgarArchiveFiles: [
          {
            type: 'xsd',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xsd',
          },
          {
            type: 'pre',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_pre.xml',
          },
          {
            type: 'def',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_def.xml',
          },
          {
            type: 'cal',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_cal.xml',
          },
          {
            type: 'lab',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231_lab.xml',
          },
          {
            type: 'ins',
            url: 'Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml',
          },
        ],
      },
    };
  }

// https://www.sec.gov/Archives/edgar/data/1371128/000121390017002526/bsrc-20161231.xml
  public ngOnInit() {
    console.log('hello `Home` component');
    // this.parsed = nlp('Now this is a story all about how..');
    // this.parsedOut = this.parsed.normalize().out('terms');
    // this.parsedOut = JsDiff.diffWords('Mark Edward Oblad', 'Henry Mark Oblad');
    // this.title.getData().subscribe(data => this.data = data);
    // this.tryLogisticRegression();
    // this.tryMultiLayerPerceptron();
    // this.trySupportVectorMachine();
    // this.tryKNN();
    // this.tryKMeansClustering();
    // this.tryHillClimbing();
    // this.trySimulatedAnnealing();
    // this.tryGeneticAlgorithm();
    // this.tryDecisionTree();
    this.tryNonNegativeMatrixFactorization();
  }

  public submitState(value: string) {
    console.log('submitState', value);
    if (!XbrlUtility.isBlank(value)) {
      this.clearXbrlReports();
      this.appState.set('searchTerm', value);
      this.localState.value = '';
      this.edgarArchiveService.getCikInfo(value).subscribe(
        (cikInfoObj) => {
          this.appState.set('companyName', (cikInfoObj || {}).companyName);
          this.appState.set('cik', (cikInfoObj || {}).cik);
          this.edgarArchiveService.getCikArchive(this.appState.get('cik')).subscribe(
            (cikObjs) => {
              // console.log('cikObjs: ', JSON.stringify(cikObjs || ''));
              cikObjs.forEach((cikObj) => {
                this.edgarArchiveService.getArchive(cikObj.href).subscribe(
                  (archiveObjs) => {
                    // console.log('archiveObjs: ', JSON.stringify(archiveObjs || ''));
                    let edgarArchiveFiles = this.edgarArchiveService.archiveUrlObjsToEdgarArchiveFiles(archiveObjs);
                    if (edgarArchiveFiles) {
                      let xbrlVReport = {edgarArchiveFiles};
                      // console.log('xbrlVReport: ', JSON.stringify(xbrlVReport));
                      let urlPieces = (edgarArchiveFiles[0].url || '').split('/');
                      let xbrlVReportKey = urlPieces[urlPieces.length - 2];
                      // console.log('xbrlVReportKey: ', xbrlVReportKey);
                      // this.getXbrlReport(xbrlVReportKey, xbrlVReport, this.verbose);
                      this.xbrlService.addParsedXbrls(xbrlVReportKey, [], xbrlVReport.edgarArchiveFiles);
                    }
                  },
                  (error) => console.log(error)
                );
              });
            },
            (error) => console.log(error)
          );
        },
        (error) => console.log(error)
      );
    } else {
      // console.log('this.xbrlService.xbrlVReports: ', JSON.stringify(this.xbrlService.xbrlVReports));
      Object.keys(this.xbrlService.xbrlVReports).forEach((xbrlVReportKey) => {
        // console.log('xbrlVReportKey: ', xbrlVReportKey);
        let xbrlVReport = this.xbrlService.xbrlVReports[xbrlVReportKey];
        this.xbrlService.getXbrlReport(xbrlVReportKey, xbrlVReport, this.verbose);
      });
    }
  }

  public clearXbrlReports() {
    this.xbrlService.clearXbrlReports();
    this.appState.set('companyName', null);
    this.appState.set('cik', null);
    this.appState.set('searchTerm', null);
  }

  public repeat(str: string, times: number = 1): string {
    return str.repeat(Math.max(times || 0, 0));
  }

  public tryLogisticRegression() {
    let x = [
      [1, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0]
    ];

    let y = [
      [1, 0],
      [1, 0],
      [1, 0],
      [0, 1],
      [0, 1],
      [0, 1]
    ];

    let classifier = new ml.LogisticRegression({
      input: x,
      label: y,
      n_in: 6,
      n_out: 2
    });

    classifier.set('log level', 1);

    let trainingEpochs = 800;
    let lr = 0.01;

    classifier.train({
      lr,
      epochs: trainingEpochs
    });

    x = [
      [1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 0]
    ];

    console.log('tryLogisticRegression Result: ', JSON.stringify(classifier.predict(x)));
  }

  public tryMultiLayerPerceptron() {
    let x = [
      [0.4, 0.5, 0.5, 0.0, 0.0, 0.0],
      [0.5, 0.3, 0.5, 0.0, 0.0, 0.0],
      [0.4, 0.5, 0.5, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.5, 0.3, 0.5, 0.0],
      [0.0, 0.0, 0.5, 0.4, 0.5, 0.0],
      [0.0, 0.0, 0.5, 0.5, 0.5, 0.0]
    ];

    let y = [
      [1, 0],
      [1, 0],
      [1, 0],
      [0, 1],
      [0, 1],
      [0, 1]
    ];

    let mlp = new ml.MLP({
      input: x,
      label: y,
      n_ins: 6,
      n_outs: 2,
      hidden_layer_sizes: [4, 4, 5]
    });

    mlp.set('log level', 1); // 0 : nothing, 1 : info, 2 : warning.

    mlp.train({
      lr: 0.6,
      epochs: 20000
    });

    let a = [
      [0.5, 0.5, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.5, 0.5, 0.0],
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.0]
    ];

    console.log('tryMultiLayerPerceptron: ', JSON.stringify(mlp.predict(a)));
   }

  public trySupportVectorMachine() {
    let x = [
      [0.4, 0.5, 0.5, 0.0, 0.0, 0.0],
      [0.5, 0.3, 0.5, 0.0, 0.0, 0.01],
      [0.4, 0.8, 0.5, 0.0, 0.1, 0.2],
      [1.4, 0.5, 0.5, 0.0, 0.0, 0.0],
      [1.5, 0.3, 0.5, 0.0, 0.0, 0.0],
      [0.0, 0.9, 1.5, 0.0, 0.0, 0.0],
      [0.0, 0.7, 1.5, 0.0, 0.0, 0.0],
      [0.5, 0.1, 0.9, 0.0, -1.8, 0.0],
      [0.8, 0.8, 0.5, 0.0, 0.0, 0.0],
      [0.0, 0.9, 0.5, 0.3, 0.5, 0.2],
      [0.0, 0.0, 0.5, 0.4, 0.5, 0.0],
      [0.0, 0.0, 0.5, 0.5, 0.5, 0.0],
      [0.3, 0.6, 0.7, 1.7, 1.3, -0.7],
      [0.0, 0.0, 0.5, 0.3, 0.5, 0.2],
      [0.0, 0.0, 0.5, 0.4, 0.5, 0.1],
      [0.0, 0.0, 0.5, 0.5, 0.5, 0.01],
      [0.2, 0.01, 0.5, 0.0, 0.0, 0.9],
      [0.0, 0.0, 0.5, 0.3, 0.5, -2.3],
      [0.0, 0.0, 0.5, 0.4, 0.5, 4],
      [0.0, 0.0, 0.5, 0.5, 0.5, -2]
    ];

    let y = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    let svm = new ml.SVM({
      x,
      y
    });

    svm.train({
      C: 1.1, // default : 1.0. C in SVM.
      tol: 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
      max_passes: 20, // default : 20. Higher max_passes --> Higher precision
      alpha_tol: 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision

      kernel: {type: 'polynomial', c: 1, d: 5}
      // default : {type : "gaussian", sigma : 1.0}
      // {type : "gaussian", sigma : 0.5}
      // {type : "linear"} // x*y
      // {type : "polynomial", c : 1, d : 8} // (x*y + c)^d
      // Or you can use your own kernel.
      // kernel : function(vecx,vecy) { return dot(vecx,vecy);}
    });
    console.log('trySupportVectorMachine Predict: ', JSON.stringify(svm.predict([1.3, 1.7, 0.5, 0.5, 1.5, 0.4])));
  }

  public tryKNN() {
    let data = [
      [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0]
    ];

    let result = [23, 12, 23, 23, 45, 70, 123, 73, 146, 158, 64];

    let knn = new ml.KNN({
      data,
      result
    });

    let y = knn.predict({
      x: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      k: 3,

      weightf: {type: 'gaussian', sigma: 10.0},
      // default : {type : 'gaussian', sigma : 10.0}
      // {type : 'none'}. weight == 1
      // Or you can use your own weight f
      // weightf : function(distance) {return 1./distance}

      distance: {type: 'euclidean'}
      // default : {type : 'euclidean'}
      // {type : 'pearson'}
      // Or you can use your own distance function
      // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
    });
    console.log('tryKNN: ', JSON.stringify(y));
  }

  public tryKMeansClustering() {
    let data = [
      [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0]
    ];

    let result = ml.kmeans.cluster({
      data,
      k: 4,
      epochs: 100,

      distance: {type: 'pearson'}
      // default : {type : 'euclidean'}
      // {type : 'pearson'}
      // Or you can use your own distance function
      // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
    });

    console.log('clusters: ', JSON.stringify(result.clusters));
    console.log('means: ', JSON.stringify(result.means));
  }

  public tryHillClimbing() {
    let costf = (vec) => {
      let cost = 0;
      for (let i = 0; i < 14; i++) { // 15-dimensional vector
        cost += (0.5 * i * vec[i] * Math.exp(-vec[i] + vec[i + 1]) / vec[i + 1]);
      }
      cost += (3.0 * vec[14] / vec[0]);
      return cost;
    };

    let domain = [];
    for (let i = 0; i < 15; i++) {
      domain.push([1, 70]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].
    }

    let vec = ml.optimize.hillclimb({
      domain,
      costf
    });

    console.log('vec: ', JSON.stringify(vec));
    console.log('cost: ', JSON.stringify(costf(vec)));
  }

  public trySimulatedAnnealing() {
    let costf = (vec) => {
      let cost = 0;
      for (let i = 0; i < 14; i++) { // 15-dimensional vector
        cost += (0.5 * i * vec[i] * Math.exp(-vec[i] + vec[i + 1]) / vec[i + 1]);
      }
      cost += (3.0 * vec[14] / vec[0]);
      return cost;
    };

    let domain = [];
    for (let i = 0; i < 15; i++) {
      domain.push([1, 70]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].
    }

    let vec = ml.optimize.anneal({
      domain,
      costf,
      temperature: 100000.0,
      cool: 0.999,
      step: 4
    });

    console.log('vec: ', JSON.stringify(vec));
    console.log('cost: ', JSON.stringify(costf(vec)));
  }

  public tryGeneticAlgorithm() {
    let costf = (vec) => {
      let cost = 0;
      for (let i = 0; i < 14; i++) { // 15-dimensional vector
        cost += (0.5 * i * vec[i] * Math.exp(-vec[i] + vec[i + 1]) / vec[i + 1]);
      }
      cost += (3.0 * vec[14] / vec[0]);
      return cost;
    };

    let domain = [];
    for (let i = 0; i < 15; i++) {
      domain.push([1, 70]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].
    }

    let vec = ml.optimize.genetic({
      domain,
      costf,
      population: 50,
      elite: 2, // elitism. number of elite chromosomes.
      epochs: 300,
      q: 0.3 // Rank-Based Fitness Assignment. fitness = q * (1-q)^(rank-1)
      // higher q --> higher selection pressure
    });

    console.log('vec: ', JSON.stringify(vec));
    console.log('cost: ', JSON.stringify(costf(vec)));
  }

  public tryDecisionTree() {
    let data = [
      ['slashdot', 'USA', 'yes', 18],
      ['google', 'France', 'yes', 23],
      ['digg', 'USA', 'yes', 24],
      ['kiwitobes', 'France', 'yes', 23],
      ['google', 'UK', 'no', 21],
      ['(direct)', 'New Zealand', 'no', 12],
      ['(direct)', 'UK', 'no', 21],
      ['google', 'USA', 'no', 24],
      ['slashdot', 'France', 'yes', 19],
      ['digg', 'USA', 'no', 18],
      ['google', 'UK', 'no', 18],
      ['kiwitobes', 'UK', 'no', 19],
      ['digg', 'New Zealand', 'yes', 12],
      ['slashdot', 'UK', 'no', 21],
      ['google', 'UK', 'yes', 18],
      ['kiwitobes', 'France', 'yes', 19]
    ];

    let result = ['None', 'Premium', 'Basic', 'Basic', 'Premium', 'None', 'Basic', 'Premium',
      'None', 'None', 'None', 'None', 'Basic', 'None', 'Basic', 'Basic'];

    let dt = new ml.DecisionTree({
      data,
      result
    });

    dt.build();
    // dt.print();

    console.log('Classify: ', JSON.stringify(dt.classify(['(direct)', 'USA', 'yes', 5])));

    dt.prune(1.0); // 1.0 : mingain.
    // dt.print();
  }

  public tryNonNegativeMatrixFactorization() {
    let matrix = [
      [22, 28],
      [49, 64]
    ];

    let result = ml.nmf.factorize({
      matrix,
      features: 3,
      epochs: 100
    });

    console.log('First Matrix: ', JSON.stringify(result[0]));
    console.log('Second Matrix: ', JSON.stringify(result[1]));
    console.log('Result: ', JSON.stringify(result));
  }
}
