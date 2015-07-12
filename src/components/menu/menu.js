import angular from 'angular';
import { MenuController } from './MenuController';
import { MenuDirective } from './MenuDirective';
import dropdown from './dropdown/dropdown';

export default angular
  .module('dt.menu', [ dropdown.name ])
  .controller('MenuController', MenuController)
  .directive('dtm', MenuDirective);
