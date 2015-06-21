(function(){
  "use strict";

  angular.module('pages')
   .controller('PageController', [
      'pageService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
      PageController
   ]);

  function PageController(pageService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.selected     = null;
    self.pages        = [ ];
    self.selectPage   = selectPage;
    self.toggleList   = togglePagesList;

    // Load all registered users

    pageService
          .loadAllPages()
          .then( function( pages ) {
            self.pages    = [].concat(pages);
            self.selected = pages[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function togglePagesList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current pages
     * @param menuId
     */
    function selectPage ( page ) {
      console.log(page);
      self.selected = angular.isNumber(page) ? $scope.pages[page] : page;
      self.toggleList();
    }

  }

})();
