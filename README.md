# angular-data-table [![Join the chat at https://gitter.im/Swimlane/angular-data-table](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/swimlane/angular-data-table?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Dependency Status](https://david-dm.org/swimlane/angular-data-table.svg)](https://david-dm.org/swimlane/angular-data-table) [![devDependency Status](https://david-dm.org/swimlane/angular-data-table/dev-status.svg)](https://david-dm.org/swimlane/angular-data-table#info=devDependencies)

`angular-data-table` is a AngularJS directive for presenting large and complex data.  It has all the features you would expect from any other table but in a light package with _no external depedencies_. The table was designed to be extremely flexible and light; it doesn't make any assumptions about your data or how you: filter, sort or page it.

It was engineered from its conception to handle thousands of rows without sacrificing performance.  It was built for modern browsers using _ES6, CSS3 and HTML5_ and only supports [Evergreen Browsers](http://eisenbergeffect.bluespire.com/evergreen-browsers/) and >= 1.4.x Angular.

Sadly, this project is **not Angular2 upgrade compatible**...but we are in the progress of building a [angular2-data-table](https://github.com/swimlane/angular2-data-table) successor. Stay tuned for more info!

See live demos [here]( http://swimlane.github.io/angular-data-table/).

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
- JSPM `jspm install github:swimlane/angular-data-table`
- BOWER `bower install angular-data-table`

or Github download or clone of course!

#### Run Demos

Ensure you have the latest NPM and JSPM installed globally.  If you don't already have JSPM installed run: `npm install jspm -g`.

- `npm install`
- `jspm install`
- `gulp watch serve`
- Open your browser to `http://localhost:9000`

docs coming soon, in the meantime, 'View Source' is your friend ;)!

#### Build

`gulp release` to build Modules, ES* via Babel and compile.

#### Include

You've got 5 different options to include this in your build depending on your setup.

- `./release/dataTable.js` - A standalone file that was compiled with Babel (UMD)
- `./release/dataTable.min.js` - A minified standalone file that was compiled with Babel (UMD)
- `./release/dataTable.cjs.js` - A standalone file that was compiled with Babel (CommonJS)
- `./release/dataTable.es6.js` - Raw ES6 Version.
 
All distributions include babel helpers, so they do not have to be included separately.

There is also the CSS too:

- `./release/dataTable.css` - The base CSS, pretty much required
- `./release/material.css` - Material theme

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
        <strong>{{$row.name}}</strong>: {{$cell}}
      </column>
    </dtable>

and your off to the races! See live demos [here](http://swimlane.github.io/angular-data-table/).

## Research

#### Alternatives

I looked over all the alternatives out there agnostic to any particular platform to find the best solution.  Heres what I came up with:

- [Handsome Table](http://handsontable.github.io/ngHandsontable/) - A great execl-like but lacked the ability to handle 100s of thousands of rows.

- [Angular Grid](http://www.angulargrid.com/) - A great project by a talented developer, however, lacked many of the core features I needed.  Implementing the ones I needed was huge undertaking as some of the core would need to be re-worked.

- [React Fixed Data Table](https://facebook.github.io/fixed-data-table/) - This is probably the BEST table alternative out there.  Its extremely smooth, handles millions of rows flawlessly, has a great API but lacked a few features I needed ( nor am I a react'er ).

- [React Data Grid](https://github.com/zippyui/react-datagrid) - Another great alternative out there for react.

- [Kendo UI Grid](http://demos.telerik.com/kendo-ui/grid/index) - Extremely full featured but EXTREMELY HEAVY( 600kb )!

- [UI Grid](http://ui-grid.info) - By far the most popular grid for Angular and has a LOT of features. Problem was I found several bugs ( I'm on a mac, the main devs are windows users ), it supports a ton of browsers ( hacky code and bloat ) and it has a ton of features ( bloat ).

- [Vaadin Poylmer Grid](http://demo.vaadin.com/sampler/#ui/grids-and-trees/grid) - A nice poylmer project but beta-ish.

- [Ember Table](http://addepar.github.io/ember-table/) - A very nice table for Ember but doesn't handle large data sets very nicely and scrolling can be a bit 'janky' sometimes.

#### Design

The core CSS for the table has no assumptions about the styling of your application and therefore you can easily style it.  I provided a out-of-the-box style based on Google Material design.  Here is where I got some of the ideas:

- [Angular Material Github Issue](https://github.com/angular/material/issues/796)
- [Material Table](https://github.com/daniel-nagy/md-data-table)
- [Material Table 2](http://danielnagy.me/md-data-table/)
- [Material Table 3](http://codepen.io/zavoloklom/pen/IGkDz)
- [Material Design Spec](http://www.google.com/design/spec/components/data-tables.html#data-tables-tables-within-cards)

## Credits

`angular-data-table` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
