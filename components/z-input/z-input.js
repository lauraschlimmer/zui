/**
 * This file is part of the "FnordMetric" project
 *   Copyright (c) 2014 Laura Schlimmer
 *   Copyright (c) 2014 Paul Asmuth, Google Inc.
 *
 * FnordMetric is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License v3.0. You should have received a
 * copy of the GNU General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */
var InputComponent = function() {
  this.createdCallback = function() {

    var input = this.querySelector("input");
    var base = this;
    var type;

    if (!input) {
      //input should be inserted before icon etc. element
      input = document.createElement("input");
      input.type = 'text';
      this.insertBefore(input, this.firstChild);
    }


    // input options
    if (this.hasAttribute('data-placeholder')) {this.setPlaceholder();}
    if (this.hasAttribute('data-value')) {this.setValue();}
    if (type = this.getAttribute('data-type')) {this.setInputType(type);}
    if (this.hasAttribute('data-readonly') || this.hasAttribute('data-disabled')) {
      this.setReadonly();
    }

    this.querySelector('input').addEventListener('keyup',
      function(e) {
      //Enter
      if (e.keyCode == 13) {
        var ev = new CustomEvent("z-input-submit", {
          bubbles: true,
          cancelable: true,
          detail: {'value' : this.value}
        });
        base.setAttribute('data-value', this.value);
        this.dispatchEvent(ev);
      }
    }, false);
  }

  this.attributeChangedCallback = function(attr, old_val, new_val) {
    switch (attr) {
      case 'data-value':
        this.setValue();
        break;
      case 'data-placeholder':
        this.setPlaceholder();
        break;
      case 'data-type':
        if (new_val) {
          this.setType(new_val);
        }
        break;
      case 'data-readonly':
      case 'data-disabled':
        this.setReadonly();
        break;
      default:
        break;
    }
  };

  this.setValue = function(value) {
    if (value != null && value != undefined) {
      if (value.constructor === Array) {
        value = value.join(",");
      }

      this.querySelector("input").value = value;
    } else {
      var value = this.getAttribute('data-value');
      var value_elems = this.querySelectorAll("z-input-value");
      for (var i = 0; i < value_elems.length; i++) {
        this.removeChild(value_elems[i]);
      }

      if (this.classList.contains('csv')) {
        var values = value.split(",");
        var _this = this;
        var i = 0;

        values.forEach(function(v) {
          var elem = document.createElement("z-input-value");
          if (i == 0) {
            elem.style.marginLeft = "0.8em";
            i++;
          }
          elem.innerHTML = v;
          var icon = document.createElement("i");
          icon.className = "fa fa-close";
          elem.appendChild(icon);
          _this.appendChild(elem);

          icon.addEventListener('click', function() {
            values.splice(values.indexOf(v), 1);
            _this.removeCSVValue(v, values);
          });
        });
      } else {
        this.querySelector("input").value = value;
      }
    }
  };

  this.getValue = function() {
    return (this.querySelector("input").value);
  };

  this.setPlaceholder = function() {
    this.querySelector('input').setAttribute(
      'placeholder', this.getAttribute('data-placeholder'));
  };

  this.setInputType = function(type) {
    this.querySelector('input').type = type;
  }

  this.setReadonly = function() {
    this.querySelector("input").readOnly = true;
  };

  this.removeCSVValue = function(value, values) {
    this.setAttribute('data-value', values.join(","));

    var ev = new CustomEvent('z-input-remove-csv-value', {
      detail: {value: value},
      bubbles: true,
      cancealable: true
    });

    this.dispatchEvent(ev);
  }
};

var proto = Object.create(HTMLElement.prototype);
InputComponent.apply(proto);
document.registerElement("z-input", { prototype: proto });
