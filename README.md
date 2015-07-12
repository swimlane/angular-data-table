# angular-data-table

`angular-data-table` is a AngularJS directive for presenting large and complex data.  It has all the features you would expect from any other table but in a light package with no external depedencies. The table was designed to be extremely flexible and light; it doesn't make any assumptions about your data or how you: filter, sort or page it. 

It was engineered from its conception to handle thousands of rows without sacrificing performance.  It was built for modern browsers using ES6, CSS3 and HTML5 and only supports [Evergreen Browsers](http://eisenbergeffect.bluespire.com/evergreen-browsers/) and >= 1.3.x Angular.

See live demos [here](http://swimlane.github.io/angular-data-table/).

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

docs coming soon, in the meantime, 'View Source' is your friend ;)!

#### Build

`gulp release` to build Modules, ES5 via Babel and compile.

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
        scrollbarV: false
      };

      $scope.data = [ 
        { name: 'Austin', gender: 'Male' },
        { name: 'Marjan', gender: 'Male' } 
      ];
    });

then using expressive markup in your template:

    <dtable options="options" rows="data" class="material dt">
      <column name="Name" width="300" flex-grow="2"></column>
      <column name="Gender">
        <strong>{{value}}</strong>
      </column>
    </dtable>

and your off to the races! See live demos [here](http://swimlane.github.io/angular-data-table/).

## Research

#### Alternatives

I looked over all the alternatives out there agnostic to any particular platform to find the best solution.  Heres what I came up with:

- [Handsome Table](http://handsontable.github.io/ngHandsontable/) - A great execl-like but lacked the ability to handle 100s of thousands of rows.

- [Angular Grid](http://www.angulargrid.com/) - A great project by a talented developer, however, lacked many of the core features I needed.  Implementing the ones I needed was huge undertaking as some of the core would need to be re-worked.

- [React Fixed Data Table](https://facebook.github.io/fixed-data-table/) - This is probably the BEST table alternative out there.  Its extremely smooth, handles millions of rows flawlessly, has a great API lacked a few features I needed ( nor am I a react'er ).

- [React Data Grid](https://github.com/zippyui/react-datagrid) - Another great alternative out there for react.

- [Kendo UI Grid](http://demos.telerik.com/kendo-ui/grid/index) - Extremely full featured but EXTREMELY HEAVY( 600kb )!

- [UI Grid](http://ui-grid.info) - By far the most popular grid for Angular and has a LOT of features. Problem was I found several bugs ( I'm on a mac, the main devs are windows users ), it supports a ton of browsers ( hacky code and bloat ) and it has a ton of features ( bloat ).

- [Vaadin](http://demo.vaadin.com/sampler/#ui/grids-and-trees/grid) - A nice poylmer project but beta-ish.

#### Design

The core CSS for the table has no assumptions about the styling of your application and therefore you can easily style it.  I provided a out-of-the-box style based on Google Material design.  Here is where I got some of the ideas:

- [Angular Material Github Issue](https://github.com/angular/material/issues/796)
- [Material Table](https://github.com/daniel-nagy/md-data-table)
- [Material Table 2](http://danielnagy.me/md-data-table/)
- [Material Table 3](http://codepen.io/zavoloklom/pen/IGkDz)
- [Material Design Spec](http://www.google.com/design/spec/components/data-tables.html#data-tables-tables-within-cards)
