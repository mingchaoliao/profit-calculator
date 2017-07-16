import { ProfitCalculatorPage } from './app.po';

describe('profit-calculator App', () => {
  let page: ProfitCalculatorPage;

  beforeEach(() => {
    page = new ProfitCalculatorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
