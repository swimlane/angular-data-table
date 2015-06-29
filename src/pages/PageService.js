(function(){
  'use strict';

  angular.module('pages')
         .service('pageService', ['$q', PageService]);

  function PageService($q){
    var pages = [
      {
        name: 'Basic',
        codepen: 'eNGbxW',
        content: '',
        group: 'Basic'
      },{
        name: 'Loading / Clearing Data',
        codepen: 'GJMPba',
        content: '',
        group: 'Basic'
      },{
        name: 'Slow AJAX',
        codepen: 'OVxdNV',
        content: '',
        group: 'Basic'
      },{
        name: 'Sorting',
        codepen: 'MwELyv',
        content: '',
        group: 'Basic'
      },{
        name: 'Tall Rows',
        codepen: 'LVzqNX',
        content: '',
        group: 'Basic'
      },{
        name: 'Virtual Paging',
        codepen: 'vOebGw',
        content: '',
        group: 'Basic'
      },{
        name: 'Scrolling',
        codepen: 'bdozep',
        content: '',
        group: 'Basic'
      },{
        name: 'Column / Header Templates',
        codepen: 'KpZBNy',
        content: '',
        group: 'Templates'
      },{
        name: 'Expressive Columns',
        codepen: 'VLyBbw',
        content: '',
        group: 'Templates'
      },{
        name: 'Checkbox Selection',
        codepen: 'KpZBqZ',
        content: '',
        group: 'Selection'
      },{
        name: 'Click Selection',
        codepen: 'oXpMev',
        content: '',
        group: 'Selection'
      },{
        name: 'Greedy Column Widths',
        codepen: 'eNyjEL',
        content: '',
        group: 'Width Options'
      },{
        name: 'Force Fill Widths',
        codepen: 'VLyBMY',
        content: '',
        group: 'Width Options'
      },{
        name: 'Column Pinning',
        codepen: 'xGpJXe',
        content: '',
        group: 'Grouping'
      },{
        name: 'Tree',
        codepen: 'QbaBOO',
        content: '',
        group: 'Grouping'
      },{
        name: 'Row Grouping',
        codepen: 'JdMBMQ',
        content: '',
        group: 'Grouping'
      },{
        name: '100k Rows',
        codepen: 'JdMBeP',
        content: '',
        group: 'Performance'
      },{
        name: '10 Grids on One Page',
        codepen: 'NqXBEX',
        content: '',
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
