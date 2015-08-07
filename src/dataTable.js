import angular from 'angular';

import './utils/polyfill';
import { debounce, throttle } from './utils/throttle';

import { ResizableDirective } from './components/header/ResizableDirective';
import { SortableDirective } from './components/header/SortableDirective';

import { DataTableController } from './DataTableController';
import { DataTableDirective } from './DataTableDirective';

import { HeaderController } from './components/header/HeaderController';
import { HeaderDirective } from './components/header/HeaderDirective';

import { HeaderCellController } from './components/header/HeaderCellController';
import { HeaderCellDirective } from './components/header/HeaderCellDirective';

import { BodyController } from './components/body/BodyController';
import { BodyDirective } from './components/body/BodyDirective';

import { ScrollerDirective } from './components/body/ScrollerDirective';

import { RowController } from './components/body/RowController';
import { RowDirective } from './components/body/RowDirective';

import { GroupRowController  } from './components/body/GroupRowController';
import { GroupRowDirective } from './components/body/GroupRowDirective';

import { CellController } from './components/body/CellController';
import { CellDirective } from './components/body/CellDirective';

import { FooterController,  } from './components/footer/FooterController';
import { FooterDirective } from './components/footer/FooterDirective';

import { PagerController } from './components/footer/PagerController';
import { PagerDirective } from './components/footer/PagerDirective';

export default angular
  .module('data-table', [])

  .controller('DataTableController', DataTableController)
  .directive('dtable', DataTableDirective)

  .directive('resizable', ResizableDirective)
  .directive('sortable', SortableDirective)
  
  .constant('debounce', debounce)
  .constant('throttle', throttle)

  .controller('HeaderController', HeaderController)
  .directive('dtHeader', HeaderDirective)

  .controller('HeaderCellController', HeaderCellController)
  .directive('dtHeaderCell', HeaderCellDirective)

  .controller('BodyController', BodyController)
  .directive('dtBody', BodyDirective)

  .directive('dtScroller', ScrollerDirective)

  .controller('RowController', RowController)
  .directive('dtRow', RowDirective)

  .controller('GroupRowController', GroupRowController)
  .directive('dtGroupRow', GroupRowDirective)

  .controller('CellController', CellController)
  .directive('dtCell', CellDirective)

  .controller('FooterController', FooterController)
  .directive('dtFooter', FooterDirective)

  .controller('PagerController', PagerController)
  .directive('dtPager', PagerDirective)

