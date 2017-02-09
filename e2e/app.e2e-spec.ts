import { AngularUniversalDotnetStarterPage } from './app.po';

describe('angular-universal-dotnet-starter App', function() {
  let page: AngularUniversalDotnetStarterPage;

  beforeEach(() => {
    page = new AngularUniversalDotnetStarterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
