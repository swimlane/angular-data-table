# angular-data-table [![Join the chat at https://gitter.im/Swimlane/angular-data-table](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/swimlane/angular-data-table?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Dependency Status](https://david-dm.org/swimlane/angular-data-table.svg)](https://david-dm.org/swimlane/angular-data-table) [![devDependency Status](https://david-dm.org/swimlane/angular-data-table/dev-status.svg)](https://david-dm.org/swimlane/angular-data-table#info=devDependencies)

`angular-data-table` is a AngularJS directive for presenting large and complex data.  It has all the features you would expect from any other table but in a light package with _no external depedencies_. The table was designed to be extremely flexible and light; it doesn't make any assumptions about your data or how you: filter, sort or page it.

It was engineered from its conception to handle thousands of rows without sacrificing performance.  It was built for modern browsers using _ES6, CSS3 and HTML5_ and only supports [Evergreen Browsers](http://eisenbergeffect.bluespire.com/evergreen-browsers/) and >= 1.4.x Angular.

Sadly, this project is **not Angular2 upgrade compatible**. Fortunately, we have authored [angular2-data-table](https://github.com/swimlane/angular2-data-table) which is the successor to this project. **We are going to slowly be transitioning this project maintenance mode**. We will continue to provide feedback to the community and accept PRs but we won't be doing any major new development.

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

## Credits

`angular-data-table` is a [Swimlane](http://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
