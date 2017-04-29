/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
      <nav class="navbar fixed-top navbar-toggleable-md  navbar-inverse bg-primary bg-faded">
        <button
          class="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          (click)="isCollapsed = !isCollapsed"
          [attr.aria-expanded]="!isCollapsed"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand"
          [routerLink]=" ['./'] "
          routerLinkActive="active"
          [routerLinkActiveOptions]= "{exact: true}">
          <img [src]="valcuLogo" height="30" class="d-inline-block align-top" alt="valcu-edgar-ng2 Logo">
          <span>valcu-edgar-ng2</span>
        </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" [ngbCollapse]="isCollapsed">
          <ul class="navbar-nav mr-auto">
            <li [ngClass]="{'nav-item': true}">
              <a class="nav-link" [routerLink]=" ['./home'] "
                routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
                Home
              </a>
            </li>
            <li [ngClass]="{'nav-item': true}">
              <a class="nav-link" [routerLink]=" ['./detail'] "
                routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
                Detail
              </a>
            </li>
            <li [ngClass]="{'nav-item': true}">
              <a class="nav-link" [routerLink]=" ['./barrel'] "
                routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
                Barrel
              </a>
            </li>
            <li [ngClass]="{'nav-item': true}">
              <a class="nav-link" [routerLink]=" ['./about'] "
                routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
                About
              </a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>

      </nav>
      <br />

    <div class="container-fluid">

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  public valcuLogo = 'assets/img/valcu_v.png';
  public name = 'valcu-edgar-ng2';
  // public url = 'https://twitter.com/valcuco';
  public url = '/';
  public isCollapsed = true;

  constructor(
    public appState: AppState
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
