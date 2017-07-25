import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'loading',
  styleUrls: [ './loading.component.scss' ],
  template: `
    <div class="showbox">
      <div class="loader">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
        </svg>
      </div>
    </div>
  `
})
export class LoadingComponent {
}
