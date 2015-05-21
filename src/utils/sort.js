// FROM: http://www.html5rocks.com/en/tutorials/dnd/basics/#disqus_thread

var id_ = 'columns-full';
var cols_ = document.querySelectorAll('#' + id_ + ' .column');
var dragSrcEl_ = null;

this.handleDragStart = function(e) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);

  dragSrcEl_ = this;

  // this/e.target is the source node.
  this.addClassName('moving');
};

this.handleDragOver = function(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
};

this.handleDragEnter = function(e) {
  this.addClassName('over');
};

this.handleDragLeave = function(e) {
  // this/e.target is previous target element.
  this.removeClassName('over');
};

this.handleDrop = function(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // Don't do anything if we're dropping on the same column we're dragging.
  if (dragSrcEl_ != this) {
    dragSrcEl_.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');

    // Set number of times the column has been moved.
    var count = this.querySelector('.count');
    var newCount = parseInt(count.getAttribute('data-col-moves')) + 1;
    count.setAttribute('data-col-moves', newCount);
    count.textContent = 'moves: ' + newCount;
  }

  return false;
};

this.handleDragEnd = function(e) {
  // this/e.target is the source node.
  [].forEach.call(cols_, function (col) {
    col.removeClassName('over');
    col.removeClassName('moving');
  });
};

[].forEach.call(cols_, function (col) {
  col.setAttribute('draggable', 'true');  // Enable columns to be draggable.
  col.addEventListener('dragstart', this.handleDragStart, false);
  col.addEventListener('dragenter', this.handleDragEnter, false);
  col.addEventListener('dragover', this.handleDragOver, false);
  col.addEventListener('dragleave', this.handleDragLeave, false);
  col.addEventListener('drop', this.handleDrop, false);
  col.addEventListener('dragend', this.handleDragEnd, false);
});
