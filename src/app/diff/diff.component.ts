import { Component, OnInit, Input } from '@angular/core';
import * as JsDiff from 'diff/dist/diff.min.js';

@Component({
  // moduleId: module.id,
  selector: 'diff',
  providers: [
  ],
  templateUrl: './diff.component.html',
  styles: [`
    span.diff {
      color: grey;
    }
    span.diff.added {
      color: green;
      text-decoration: underline;
    }
    span.diff.removed {
      color: red;
      text-decoration: line-through;
    }
  `]
})
export class DiffComponent implements OnInit {

  @Input()
  public priorContent?: string;

  @Input()
  public postContent: string;

  @Input()
  public diffType: string;

  public diffResults: any[] = [];

  // constructor() {}

  public ngOnInit() {
    this.diffResults = JsDiff[this.diffType || 'diffWords'](this.priorContent || '', this.postContent || '');
  }

}
