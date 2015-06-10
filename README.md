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
- Virtual scroll paging with traditional pager for relativity
- Tree Grids
- Row Selection ( multi / single / keyboard / touch )
- Light codebase / No external deps
- Server Pagination / Sorting
- Client-side Sorting
- Rich header / column templates
- Fixed AND Fluid height
- Decoupled themeing with included Google Material theme

## Download it

- NPM `npm install angular-data-table`
- JSPM `jspm install npm:angular-data-table`

## Run it

- `npm install`
- `gulp watch serve`
- Open your browser to `http://localhost:9000`

## Build it

Build to ES5 via Babel ( excludes helpers ) and compile/concat run: `gulp release`

## Alternatives

- http://handsontable.github.io/ngHandsontable/
- http://www.angulargrid.com/
- https://facebook.github.io/fixed-data-table/
- https://github.com/zippyui/react-datagrid
- http://demos.telerik.com/kendo-ui/grid/index
- http://ui-grid.info
- http://demo.vaadin.com/sampler/#ui/grids-and-trees/grid

## Design Inspirations

- http://codepen.io/zavoloklom/pen/IGkDz
- http://www.google.com/design/spec/components/data-tables.html#data-tables-tables-within-cards

## Demo Data

- https://github.com/angular-ui/ng-grid/blob/master/misc/site/data/100.json
- http://jsfiddle.net/api/post/library/pure/

## Interesting Reads

- https://github.com/bahmutov/web-worker-digest-demo
- http://bahmutov.calepin.co/improving-angular-web-app-performance-example.html
- http://glebbahmutov.com/blog/angular-plus-react-equals-speed-revisited/
- https://github.com/kamilkp/angular-vs-repeat
- https://github.com/teropa/angular-virtual-dom
- [Simple virtual repeat](http://codepen.io/2fdevs/pen/pvvXoO)
