export function MenuDirective(){
  return {
    restrict: 'E',
    controller: 'MenuController',
    controllerAs: 'dtm',
    scope: {
      current: '=',
      available: '='
    },
    template: 
      `<div class="dt-menu dropdown" close-on-click="false">
        <a href="#" class="dropdown-toggle icon-add">
          Configure Columns
        </a>
        <div class="dropdown-menu" role="menu" aria-labelledby="dropdown">
          <div class="keywords">
            <input type="text" 
                   click-select
                   placeholder="Filter columns..." 
                   ng-model="columnKeyword" 
                   autofocus />
          </div>
          <ul>
            <li ng-repeat="column in available | filter:columnKeyword">
              <label class="dt-checkbox">
                <input type="checkbox" 
                       ng-checked="dtm.isChecked(column)"
                       ng-click="dtm.onCheck(column)">
                {{column.name}}
              </label>
            </li>
          </ul>
        </div>
      </div>`
  };
};
