# data-table

A data-table for AngularJS that doesn't suck.  Its ES6, fast, light and awesome!

Only supports [Evergreen Browsers](http://eisenbergeffect.bluespire.com/evergreen-browsers/) and 1.4.x Angular.

## Features

- Handle large data sets ( Virtual DOM )
- Left and Right Column Pinning
- Column Reordering
- Column Resizing
- Column Width Flex-grow 
- Column Add/Removing
- Horizontal/Vertical Scrolling
- Virtual Paging with linked traditional pager
- Tree Grids
- Cell tooltips for overflow
- Row Grouping
- Row Selection ( multi / single / keyboard / touch )
- Light codebase / No external deps
- Server Pagination / Sorting
- Client-side Sorting
- Rich header / column templates
- Fixed AND Fluid height
- Decoupled themeing with included Google Material theme

## Using It

#### Download

- NPM `npm install angular-data-table`
- JSPM `jspm install npm:angular-data-table`

#### Run Demo

Ensure you have the latest npm and jspm installed globally.

- `npm install`
- `gulp watch serve`
- Open your browser to `http://localhost:9000`

#### Build

Build to ES5 via Babel ( excludes helpers ) and compile/concat run: `gulp release`

#### Include

Include `./release/data-table.js` file in your project and register `data-table` with your angular module.  You will need to include the [Babel Runtime](https://babeljs.io/docs/usage/runtime/) if you are not already using Babel.  Alternatively, you can reference the `./src/data-table.js` directly and use your own transpiler.

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

- [Material Table Codepen](http://codepen.io/zavoloklom/pen/IGkDz)
- [Material Design Spec](http://www.google.com/design/spec/components/data-tables.html#data-tables-tables-within-cards)

#### Interesting Reads

- [Angular Webworker digest](https://github.com/bahmutov/web-worker-digest-demo)
- [Angular Performance](http://bahmutov.calepin.co/improving-angular-web-app-performance-example.html)
- [Angular Plus React](http://glebbahmutov.com/blog/angular-plus-react-equals-speed-revisited/)
- [angular-vs-repeat](https://github.com/kamilkp/angular-vs-repeat)
- [angular-virtual-dom](https://github.com/teropa/angular-virtual-dom)
- [Simple virtual repeat](http://codepen.io/2fdevs/pen/pvvXoO)
