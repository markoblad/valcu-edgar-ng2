import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  inject,
  async,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// Load the implementations that should be tested
import { VChartComponent } from './v-chart.component';

describe(`VChart`, () => {
  let comp: VChartComponent;
  let fixture: ComponentFixture<VChartComponent>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
      ]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(VChartComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it('should log ngOnInit', () => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    comp.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  });

});
