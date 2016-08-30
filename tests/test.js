var assert = require('assert');

var obj_util = require('../util/z-object_util.js');

describe('zObjectUtil', function() {
  describe('isObject', function() {
    it("should return true if it is an object and false otherwise", function() {
      assert.equal(zObjectUtil.isObject({a: "b"}), true);
      assert.equal(zObjectUtil.isObject(["a", "b"]), false);

      var fn = function() {}
      assert.equal(zObjectUtil.isObject(fn), false);
    });
  });

  describe('merge', function() {
    it("should merge two objects recursively", function() {
      var a = {
        age: 20,
        room: 2,
        name: {
          first: "Ann",
          last: "Johnson"
        }
      };

      var b = {
        name: {
          second: "Sophie"
        },
        room: null,
        room_type: "single"
      };

      var c = zObjectUtil.merge(a, b);
      assert.equal(c.age, 20);
      assert.equal(c.room, 2);
      assert.equal(c.room_type, "single");
      assert.equal(c.name.first, "Ann");
      assert.equal(c.name.second, "Sophie");
      assert.equal(c.name.last, "Johnson");

      assert.equal(a.age, 20);
      assert.equal(a.room, 2);
      assert.equal(a.room_type, undefined);
      assert.equal(a.name.first, "Ann");
      assert.equal(a.name.second, undefined);
      assert.equal(a.name.last, "Johnson");

      assert.equal(b.age, undefined);
      assert.equal(b.room, null);
      assert.equal(b.room_type, "single");
      assert.equal(b.name.first, undefined);
      assert.equal(b.name.second, "Sophie");
      assert.equal(b.name.last, undefined);
    });
  });
});
