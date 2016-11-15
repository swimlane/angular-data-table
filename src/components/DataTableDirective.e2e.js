describe('DataTableDirective', function () {
  it('should compile e2e tests', function () {
    browser.get('http://localhost:9000/demos/basic.html');

    expect(element.all(by.css('dt-body')).count()).toBe(1);
  });
});
