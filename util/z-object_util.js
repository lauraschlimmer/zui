zObjectUtil = this.zObjectUtil || {};

zObjectUtil.isObject = function(o) {
  return (
      typeof o === "object" &&
      o instanceof Object &&
      (!(o instanceof Array)));
}

zObjectUtil.merge = function(a, b) {
  var c = {};

  //copy a into c
  for (var k in a) {
    c[k] = a[k];
  }

  for (var k in b) {
    //property that is in b but not in a
    if (!c.hasOwnProperty(k)) {
      c[k] = b[k];
      continue;
    }

    //merge recursively
    if (zObjectUtil.isObject(c[k]) && zObjectUtil.isObject(b[k])) {
      c[k] = zObjectUtil.merge(c[k], b[k]);
    }
  }

  return c;
}

