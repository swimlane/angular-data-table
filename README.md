# angular-data-table

A data-table for AngularJS that doesn't suck.  Its ES6/CSS3/HTML5, fast, light and awesome!  Only supports [Evergreen Browsers](http://eisenbergeffect.bluespire.com/evergreen-browsers/) and 1.4.x Angular.

## Features

- Handle large data sets ( Virtual DOM )
- Left and Right Column Pinning
- Column Reordering
- Column Resizing
- Intelligent Column Width Algorithms ( Force fill / Flex-grow )
- Horizontal/Vertical Scrolling
- Virtual Paging WITH linked traditional pager
- Tree Grids
- Row Grouping
- Checkbox and Row Selection ( multi / single / keyboard / touch )
- Light codebase / No external deps
- Client-side AND Server Pagination / Sorting
- Rich header / column templates
- Fixed AND Fluid height
- Decoupled themeing with included Google Material theme
- Decoupled Cell tooltips on overflow
- Decoupled Column Add/Removing Menu
- Expressive Syntax

## Using It

#### Download

- NPM `npm install angular-data-table`
- JSPM `jspm install github:Swimlane/data-table`

or Github download or clone of course!

#### Run Demos

Ensure you have the latest NPM and JSPM installed globally.  If you don't already have JSPM installed run: `npm install jspm -g`.

- `npm install`
- `gulp watch serve`
- Open your browser to `http://localhost:9000`

Website and docs coming soon, in the meantime, 'View Source' is your friend ;)!

#### Build

Build to ES5 via Babel ( excludes helpers ) and compile/concat run: `gulp release`

#### Include

You've got 5 different options to include this in your build depending on your setup.

- `./release/data-table.js` - A standalone file that was compiled with Babel and EXCLUDES the Babel runtime.
- `./release/data-table.helpers.js` - A standalone file that was compiled with Babel and INCLUDES the Babel runtime.
- `./release/data-table.helpers.min.js` - A standalone file that was compiled with Babel, INCLUDES the Babel runtime and is MINIFIED.
- `./release/data-table.es6.js` - Raw ES6 Version.

There is also the CSS too:

- `./release/data-table.css` - The base CSS, pretty much required
- `./release/material.css` - Material theme

If none of the above makes any sense just include `./release/data-table.min.js` and include the css files referenced above.

#### Usage

Include the module in your angular app module like:

    var myApp = angular.module('myApp', [ 'data-table' ]);

    module.controller('HomeController', function($scope){
      $scope.options = {
        columns: [
          { name: "Name", prop: "name" }
        ]
      };

      $scope.data = [ { name: 'Austin' } ];
    });

then in your markup:

    <dt options="options" values="data"></dt>

and your off to the races!  For more information, reference the demo pages until docs are completed.  You can see them live by running the demo.

## Research

#### Alternatives

- [Handsome Table](http://handsontable.github.io/ngHandsontable/)
- [Angular Grid](http://www.angulargrid.com/)
- [React Fixed Data Table](https://facebook.github.io/fixed-data-table/)
- [React Data Grid](https://github.com/zippyui/react-datagrid)
- [Kendo UI Grid](http://demos.telerik.com/kendo-ui/grid/index)
- [UI Grid](http://ui-grid.info)
- [Vaadin](http://demo.vaadin.com/sampler/#ui/grids-and-trees/grid)

#### Design

- [Angular Material Github Issue](https://github.com/angular/material/issues/796)
- [Material Table](https://github.com/daniel-nagy/md-data-table)
- [Material Table 2](http://danielnagy.me/md-data-table/)
- [Material Table 3](http://codepen.io/zavoloklom/pen/IGkDz)
- [Material Design Spec](http://www.google.com/design/spec/components/data-tables.html#data-tables-tables-within-cards)

#### Interesting Reads

- [Angular Webworker digest](https://github.com/bahmutov/web-worker-digest-demo)
- [Angular Performance](http://bahmutov.calepin.co/improving-angular-web-app-performance-example.html)
- [Angular Plus React](http://glebbahmutov.com/blog/angular-plus-react-equals-speed-revisited/)
- [angular-vs-repeat](https://github.com/kamilkp/angular-vs-repeat)
- [angular-virtual-dom](https://github.com/teropa/angular-virtual-dom)
- [Simple virtual repeat](http://codepen.io/2fdevs/pen/pvvXoO)
