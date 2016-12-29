describe('PagerDirective', function () {
  browser.get('http://localhost:9000/demos/paging.html');

  it('should have active class on first pager', () => {
    element.all(by.css('ul.pager li')).then(function(items) {
      expect(items.length).toBe(9);
      expect(items[2].getAttribute('class')).toContain('active');
    });
  });

  it('should display 10 rows', () => {
    element.all(by.css('.dt-row')).then(function(items) {
      expect(items.length).toBe(10);
    });
  });
});
