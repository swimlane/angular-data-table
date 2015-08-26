import { SelectionController } from './SelectionController';

export function SelectionDirective(){
  return {
    controller: SelectionController,
    restrict: 'A',
    require:'^dtBody',
    controllerAs: 'selCtrl'
  };
};
