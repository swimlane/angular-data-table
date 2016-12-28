describe('DataTable: Basic', function () {
  browser.get('http://localhost:9000/demos/basic.html');

  it('should display table body', () => {
    expect(element.all(by.css('dt-body')).count()).toBe(1);
  });

  it('should display 100 rows', () => {
    expect(element.all(by.css('dt-row')).count()).toBe(100);
  });
});
