System.register(['angular'], function (_export) {
  'use strict';

  var angular, DropdownController;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function DropdownDirective($document, $timeout) {
    return {
      restrict: 'C',
      controller: 'DropdownController',
      link: function link($scope, $elm, $attrs) {

        function closeDropdown(ev) {
          if ($elm[0].contains(ev.target)) {
            return;
          }

          $timeout(function () {
            $scope.open = false;
            off();
          });
        };

        function keydown(ev) {
          if (ev.which === 27) {
            $timeout(function () {
              $scope.open = false;
              off();
            });
          }
        };

        function off() {
          $document.unbind('click', closeDropdown);
          $document.unbind('keydown', keydown);
        };

        $scope.$watch('open', function (newVal) {
          if (newVal) {
            $document.bind('click', closeDropdown);
            $document.bind('keydown', keydown);
          }
        });
      }
    };
  }
  DropdownDirective.$inject = ["$document", "$timeout"];

  function DropdownMenuDirective($animate) {
    return {
      restrict: 'C',
      require: '?^dropdown',
      link: function link($scope, $elm, $attrs, ctrl) {
        $scope.$watch('open', function () {
          $animate[$scope.open ? 'addClass' : 'removeClass']($elm, 'ddm-open');
        });
      }
    };
  }
  DropdownMenuDirective.$inject = ["$animate"];

  function DropdownToggleDirective($timeout) {
    return {
      restrict: 'C',
      controller: 'DropdownController',
      require: '?^dropdown',
      link: function link($scope, $elm, $attrs, ctrl) {

        function toggleClick(event) {
          event.preventDefault();
          $timeout(function () {
            ctrl.toggle($scope);
          });
        };

        function toggleDestroy() {
          $elm.unbind('click', toggleClick);
        };

        $elm.bind('click', toggleClick);
        $scope.$on('$destroy', toggleDestroy);
      }
    };
  }
  DropdownToggleDirective.$inject = ["$timeout"];return {
    setters: [function (_angular) {
      angular = _angular['default'];
    }],
    execute: function () {
      DropdownController = (function () {
        /*@ngInject*/

        function DropdownController($scope) {
          _classCallCheck(this, DropdownController);

          $scope.open = false;
        }
        DropdownController.$inject = ["$scope"];

        _createClass(DropdownController, [{
          key: 'toggle',
          value: function toggle(scope) {
            scope.open = !scope.open;
          }
        }]);

        return DropdownController;
      })();

      ;;;

      _export('default', angular.module('dt.dropdown', []).controller('DropdownController', DropdownController).directive('dropdown', DropdownDirective).directive('dropdownToggle', DropdownToggleDirective).directive('dropdownMenu', DropdownMenuDirective));
    }
  };
});