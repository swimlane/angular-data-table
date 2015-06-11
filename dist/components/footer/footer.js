System.register(['angular'], function (_export) {
  'use strict';

  var angular, FooterController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  _export('FooterDirective', FooterDirective);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function FooterDirective() {
    return {
      restrict: 'E',
      controller: 'FooterController',
      controllerAs: 'footer',
      scope: {
        paging: '=',
        onPage: '&'
      },
      template: '<div class="dt-footer">\n        <div class="page-count">{{paging.count}} total</div>\n        <pagination direction-links="true"\n                    boundary-links="true"\n                    items-per-page="paging.size"\n                    total-items="paging.count"\n                    ng-show="paging.count > 1"\n                    ng-change="footer.pageChanged(this)"\n                    previous-text="&lsaquo;"\n                    next-text="&rsaquo;"\n                    first-text="&laquo;"\n                    last-text="&raquo;"\n                    rotate="false"\n                    max-size="5"\n                    ng-model="page">\n        </pagination>\n      </div>',
      replace: true
    };
  }

  return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }],
    execute: function () {
      FooterController = (function () {

        /**
         * Creates an instance of the Footer Controller
         * @param  {scope}
         * @return {[type]}
         */
        /*@ngInject*/

        function FooterController($scope) {
          _classCallCheck(this, FooterController);

          this.$scope = $scope;
          $scope.page = $scope.paging.offset + 1;
          $scope.$watch('paging.offset', this.offsetChanged.bind(this));
        }
        FooterController.$inject = ["$scope"];

        _createClass(FooterController, [{
          key: 'offsetChanged',

          /**
           * The offset ( page ) changed externally, update the page
           * @param  {new offset}
           */
          value: function offsetChanged(newVal) {
            this.$scope.page = newVal + 1;
          }
        }, {
          key: 'pageChanged',

          /**
           * The pager was invoked
           * @param  {scope}
           */
          value: function pageChanged(scope) {
            scope.paging.offset = scope.page - 1;
            scope.onPage({
              offset: scope.paging.offset,
              size: scope.paging.size
            });
          }
        }]);

        return FooterController;
      })();

      _export('FooterController', FooterController);

      ;

      ;
    }
  };
});