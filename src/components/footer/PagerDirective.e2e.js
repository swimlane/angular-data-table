describe('PagerDirective', function () {
  browser.get('http://localhost:9000/demos/paging.html');

  it('should have active class on first pager', () => {
    expect(element.all(by.css('ul.pager li')).count()).toBe(9);

    expect(element.all(by.css('ul.pager li'))[2].getAttribute('class')).toMatch('active');
  });

  it('should display 10 rows', () => {
    expect(element.all(by.css('div.dt-row')).count()).toBe(10);
  });
});
