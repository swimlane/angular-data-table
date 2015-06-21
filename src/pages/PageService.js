(function(){
  'use strict';

  angular.module('pages')
         .service('pageService', ['$q', PageService]);

  function PageService($q){
    var pages = [
      {
        name: 'Basic',
        codepen: 'eNGbxW',
        content: ''
      },{
        name: 'Loading / Clearing Data',
        codepen: 'GJMPba',
        content: ''
      },{
        name: 'Slow AJAX',
        codepen: 'OVxdNV',
        content: ''
      },{
        name: 'Sorting',
        codepen: 'MwELyv',
        content: ''
      },{
        name: 'Tall Rows',
        codepen: 'LVzqNX',
        content: ''
      },{
        name: 'Virtual Paging',
        codepen: 'vOebGw',
        content: ''
      },{
        name: 'Scrolling',
        codepen: 'bdozep',
        content: ''
      }

    ];

    // Promise-based API
    return {
      loadAllPages : function() {
        // Simulate async nature of real remote calls
        return $q.when(pages);
      }
    };
  }

})();
