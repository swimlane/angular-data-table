import { SelectionController } from './SelectionController';

export default function SelectionDirective(){
  return {
    controller: SelectionController,
    restrict: 'A',
    require:'^dtBody',
    controllerAs: 'selCtrl'
  };
};
