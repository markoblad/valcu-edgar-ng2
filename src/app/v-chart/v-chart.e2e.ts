import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    // change hash depending on router LocationStrategy
    browser.get('/#/v-chart');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'valcu-edgar-ng2 from @valcuco';
    expect(subject).toEqual(result);
  });

  it('should have `your content here` x-large', () => {
    let subject = element(by.css('[x-large]')).getText();
    let result  = 'Your Content Here';
    expect(subject).toEqual(result);
  });

});
