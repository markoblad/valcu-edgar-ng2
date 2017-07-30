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

    <main>
      <div class="container-fluid">
        <router-outlet></router-outlet>
      </div>
    </main>

    <footer class="footer bg-primary text-white mt-3">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-1">
          </div>
          <div class="col">
            <br />
            <img [src]="valcuLogo" height="30" class="d-inline-block align-top" alt="Valcu Viewer Logo">
          </div>
          <div class="col">
            <br />
            <small>
              <p>LEGAL</p>
              <p><a>Privacy</a></p>
              <p><a>Terms</a></p>
           </small>
          </div>
          <div class="col">
            <br />
            <small>
              <p class="">&copy;&nbsp;2017, Valcu Inc.</p>
              <p class="text-justify">DISCLAIMER: All trademarks are the property of their respective owners. 
              Valcu Inc. and Valcu<sup>TM</sup> provide information and software at your specific direction only. 
              Valcu is not an attorney, law firm, "lawyer referral service", broker, dealer, 
              accounting firm or tax advisor and does not provide, 
              or participate in the provision of, any legal, tax, business, or financial advice. 
              All financial information is provided "as is" with no warranty of any kind 
              and solely for informational purposes, not for trading purposes or advice, 
              and may be delayed.</p>
           </small>
          </div>
          <div class="col-sm-1">
          </div>
        </div>
      </div>
    </footer>
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
