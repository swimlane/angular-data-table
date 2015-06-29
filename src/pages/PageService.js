(function(){
  'use strict';

  angular.module('pages')
         .service('pageService', ['$q', PageService]);

  function PageService($q){
    var pages = [
      {
        name: 'Basic',
        codepen: 'eNGbxW',
        content: 'basic',
        group: 'Basic'
      },{
        name: 'Loading / Clearing Data',
        codepen: 'GJMPba',
        content: 'loading-clearing-data',
        group: 'Basic'
      },{
        name: 'Slow AJAX',
        codepen: 'OVxdNV',
        content: 'slow-ajax',
        group: 'Basic'
      },{
        name: 'Sorting',
        codepen: 'MwELyv',
        content: 'sorting',
        group: 'Basic'
      },{
        name: 'Tall Rows',
        codepen: 'LVzqNX',
        content: 'tall-rows',
        group: 'Basic'
      },{
        name: 'Virtual Paging',
        codepen: 'vOebGw',
        content: 'virtual-paging',
        group: 'Basic'
      },{
        name: 'Scrolling',
        codepen: 'bdozep',
        content: 'scrolling',
        group: 'Basic'
      },{
        name: 'Column / Header Templates',
        codepen: 'KpZBNy',
        content: 'column-header-templates',
        group: 'Templates'
      },{
        name: 'Expressive Columns',
        codepen: 'VLyBbw',
        content: 'expressive-columns',
        group: 'Templates'
      },{
        name: 'Checkbox Selection',
        codepen: 'KpZBqZ',
        content: 'checkbox-selection',
        group: 'Selection'
      },{
        name: 'Click Selection',
        codepen: 'oXpMev',
        content: 'click-selection',
        group: 'Selection'
      },{
        name: 'Greedy Column Widths',
        codepen: 'eNyjEL',
        content: 'greedy-column-widths',
        group: 'Width Options'
      },{
        name: 'Force Fill Widths',
        codepen: 'VLyBMY',
        content: 'force-fill-widths',
        group: 'Width Options'
      },{
        name: 'Column Pinning',
        codepen: 'xGpJXe',
        content: 'column-pinning',
        group: 'Grouping'
      },{
        name: 'Tree',
        codepen: 'QbaBOO',
        content: 'tree',
        group: 'Grouping'
      },{
        name: 'Row Grouping',
        codepen: 'JdMBMQ',
        content: 'row-grouping',
        group: 'Grouping'
      },{
        name: '100k Rows',
        codepen: 'JdMBeP',
        content: '100k-rows',
        group: 'Performance'
      },{
        name: '10 Grids on One Page',
        codepen: 'NqXBEX',
        content: '10-grids',
        group: 'Performance'
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
