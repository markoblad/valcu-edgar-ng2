import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import { XbrlUtility } from '../edgar';
import { EdgarArchiveService } from '../edgar';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
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
  // Set our default values
  public localState = { value: '' };
  public edgarContent: any = null;
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title,
    public edgarArchiveService: EdgarArchiveService
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
    // this.edgarContent = this.edgarArchiveService.get(value)
    this.edgarArchiveService.getEdgarCompanyKeys(value).subscribe(
      res => {
        this.edgarContent = XbrlUtility.processXsdDoc(res);
        // this.edgarContent = XbrlUtility.processPreDoc(res);
        // this.edgarContent = XbrlUtility.processDefDoc(res);
        // this.edgarContent = XbrlUtility.processCalDoc(res);
        // this.edgarContent = XbrlUtility.processLabDoc(res);
      },
      error => console.log(error)
    );;
  }
}
