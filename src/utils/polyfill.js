/**
 * Array.prototype.find()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
(function() {
  function polyfill(fnName) {
    if (!Array.prototype[fnName]) {
      Array.prototype[fnName] = function(predicate /*, thisArg */ ) {
        var i, len, test, thisArg = arguments[1];

        if (typeof predicate !== "function") {
          throw new TypeError();
        }

        test = !thisArg ? predicate : function() {
          return predicate.apply(thisArg, arguments);
        };

        for (i = 0, len = this.length; i < len; i++) {
          if (test(this[i], i, this) === true) {
            return fnName === "find" ? this[i] : i;
          }
        }

        if (fnName !== "find") {
          return -1;
        }
      };
    }
  }

  for (var i in {
      find: 1,
      findIndex: 1
    }) {
    polyfill(i);
  }
}());
