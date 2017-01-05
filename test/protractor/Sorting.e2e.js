describe('When Sorting:', function () {
    var hasClass = function (element, cls) {
      return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
      });
    }

      var colHeaderList,
          colHeader1,
          colHeader1Icon,
          colHeader2,
          colHeader2Icon,
          row1Column1;

      beforeEach(function () {
           browser.get('/demos/sort.html');

           colHeaderList = by.repeater('column in header.columns[\'center\'] track by column.$id');
           colHeader1 = element(colHeaderList.row(0));
           colHeader1Icon = colHeader1.element(by.css('.sort-btn'));
           colHeader2 = element(colHeaderList.row(1));
           colHeader2Icon = colHeader2.element(by.css('.sort-btn'));
           row1Column1 = element.all(by.css('.dt-cell')).first();
      });

      describe('multi column', function () {
          it('should be able to sort by multiple columns', function() {
              colHeader1.click();

              expect(hasClass(colHeader1Icon, 'icon-up')).toBe(true);
              expect(hasClass(colHeader2Icon, 'icon-down')).toBe(true);
              expect(row1Column1.getText()).toBe('Valarie Atkinson');
          });
      });

      describe('single column', function () {
          beforeEach(function () {
              element(by.model('multiple')).click();
          });

          it('should only sort by one column at a time', function () {
              colHeader2.click();

              setTimeout(function () {
                  colHeader1.click();
              }, 10);

              setTimeout(function () {
                  expect(hasClass(colHeader1Icon, 'icon-up')).toBe(true);
                  expect(hasClass(colHeader2Icon, 'icon-down')).toBe(false);
                  expect(row1Column1.getText()).toBe('Wilder Gonzales');
              }, 10);
          });
      });
});
