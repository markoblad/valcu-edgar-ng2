import {
  Component,
  OnInit,
} from '@angular/core';

console.log('`Barrel` component loaded asynchronously');

@Component({
  selector: 'barrel',
  template: `
    <h1>Hello from Barrel</h1>
    <span>
      <a [routerLink]=" ['./child-barrel'] ">
        Child Barrel
      </a>
    </span>
    <router-outlet></router-outlet>
  `,
})
export class BarrelComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `Barrel` component');
  }

}
