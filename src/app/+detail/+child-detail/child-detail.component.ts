import {
  Component,
  OnInit,
} from '@angular/core';

console.log('`ChildDetail` component loaded asynchronously');

@Component({
  selector: 'child-detail',
  template: `
    <p>Hi child</p>
  `,
})
export class ChildDetailComponent implements OnInit {

  constructor() {
    // Object.assign(this, {single, multi})
  }

  public onSelect(event) {
    console.log(event);
  }

  public ngOnInit() {
    console.log('hello `ChildDetail` component');
  }

}
