/**
    This file is part of the "FnordMetric" project
    Copyright (c) 2014 Laura Schlimmer
    Copyright (c) 2014 Paul Asmuth, Google Inc.

  FnordMetric is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License v3.0. You should have received a
  copy of the GNU General Public License along with this program. If not, see
  <http://www.gnu.org/licenses/>.
**/

var TooltipComponent = function() {
  this.init = function(elem) {
    var _this = this;
    elem.addEventListener('mouseover', function() {
        _this.show(this);
    }, false);

    elem.addEventListener('mouseout', function() {
      _this.hide();
    }, false);
  };

  this.initShowIf = function(elem, condition) {
    var _this = this;
    elem.addEventListener('mouseover', function() {
      if (condition()) {
        _this.show(this);
      }
    }, false);

    elem.addEventListener('mouseout', function() {
      _this.hide();
    }, false);
  };

  this.show = function(elem) {
    this.setAttribute('data-active', 'active');

    this.style.left = this.getLeftValue(elem) + "px";
    this.style.top = this.getTopValue(elem) + "px";
  };

  this.hide = function() {
    this.removeAttribute('data-active');
  };

  this.getLeftValue = function(target) {
    var width = this.offsetWidth;
    var target_width = target.offsetWidth;
    var target_middle = Math.round(target_width / 2);
    var pos = target.getBoundingClientRect();
    var scroll_x = window.scrollX;
    var position = this.getAttribute('data-position');
    var pointer_pos = this.getAttribute('data-pointer');

    if (position == "right") {
      return pos.left + target_width + 7;
    }

    if (position == "left") {
      return pos.left - width - 7
    }

    if (pointer_pos == "right") {
      return (pos.left - width + target_middle + 15);
    }

    if (pointer_pos == "center") {
      return pos.left - ((width - target_width) / 2);
    }

    //tooltip bigger than remaining window space
    if (window.innerWidth - (pos.left + target_middle - 15) < width) {
      this.setAttribute('data-pointer', 'right');
      return (pos.left - width + target_middle + 16);
    }

    return (pos.left + target_middle - 15);
  };

  this.getTopValue = function(target) {
    var position = this.getAttribute('data-position');
    var pos = target.getBoundingClientRect();
    var relative = this.hasAttribute('data-relative');
    var scroll_x = window.scrollX;

    if (position == "bottom") {
      return pos.top + pos.height + scroll_x + 8;
    }

    if (position == "left" || position == "right") {
      return pos.top + scroll_x;
    }

    return (pos.top - this.offsetHeight + scroll_x - 8);
  };
};

var proto = Object.create(HTMLElement.prototype);
TooltipComponent.apply(proto);
document.registerElement("z-tooltip", { prototype: proto });
