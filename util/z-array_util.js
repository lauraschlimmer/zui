zArrayUtil = this.zArrayUtil || {};

zArrayUtil.setDifference = function(b, a) {
  var diff = [];

  b.forEach(function(e) {
    if (a.indexOf(e) == -1) {
      diff.push(e);
    }
  });

  return diff;
}

zArrayUtil.setIntersection = function(a, b) {
  var intersect = [];

  a.forEach(function(e) {
    if (b.indexOf(e) >= 0) {
      intersect.push(e);
    }
  });

  return intersect;
}
