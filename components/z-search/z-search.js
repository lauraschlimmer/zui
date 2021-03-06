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
var SearchComponent = function() {
  this.createdCallback = function() {
    var input = this.querySelector("z-input");
    var icon = this.querySelector("z-input-icon");
    var base = this;

    var value_length = 0;

    if (!input) {
      input = document.createElement("z-input");
      this.insertBefore(input, this.firstChild);
    }

    if (icon) {
      icon.addEventListener('click', function() {
        base.submitSearch(input.getValue());
      }, false);
    }


    input.addEventListener('keyup', function(e) {
      switch (e.keyCode) {
        //Enter
        case 13:
          base.onDropdownItemClick();
          break;
        //Up Arrow
        case 38:
          base.keyNavigation('up', base.visibleScrollbar());
          break;
        //Down Arrow
        case 40:
          base.keyNavigation('down', base.visibleScrollbar());
          break;
        //Shift
        case 16:
        case 20:
          break;

        default:
          var value = this.getValue();
          if (value.length >= base.getMinLength()) {
            base.fireAutocompleteEvent(value);
          } else {
            base.closeDropdown();
          }
          break;
      }
    }, false);

    window.addEventListener('click', function() {
      base.closeDropdown();
    }, false);

  };

  this.getMinLength = function() {
    if (this.minLength && !isNaN(this.minLength)) {
      return this.minLength;
    }

    return 1;
  }

  this.setValue = function(val) {
    var input = this.querySelector("z-input");
    return input.setValue(val);
  };

  this.getValue = function() {
    var input = this.querySelector("z-input");
    return input.getValue();
  };

  this.getActiveListElem = function() {
    var active_elem = this.querySelector("li.hover");

    if (!active_elem) {
      active_elem = this.querySelector("li[data-selected]");
    }

    return active_elem;
  };

  this.updateActiveElem = function(new_elem, old_elem) {
    new_elem.classList.add('hover');

    if (old_elem) {
      old_elem.classList.remove('hover');
    }
  };

  this.visibleScrollbar = function() {
    var ul = this.querySelector("ul");

    return ul.scrollHeight > ul.offsetHeight;
  }

  this.keyNavigation = function(direction, visibleScrollbar) {
    var active_elem = this.getActiveListElem();
    var new_elem;
    var elems = this.querySelectorAll("li");

    if (active_elem) {

      if (direction == 'down') {
        new_elem = active_elem.nextElementSibling;

        if (!new_elem) {
          //first elem
          new_elem = elems[0];

          if (visibleScrollbar) {
            var ul = this.querySelector("ul");
            ul.scrollTop = 0;
          }

        } else {

          if (visibleScrollbar) {
            var ul = this.querySelector("ul");
            ul.scrollTop = ul.scrollTop + (ul.offsetHeight / elems.length);
          }
        }

      } else {
        new_elem = active_elem.previousElementSibling;

        if (!new_elem) {
          //last elem
          new_elem = elems[elems.length - 1];

          if (visibleScrollbar) {
            var ul = this.querySelector("ul");
            ul.scrollTop = ul.scrollHeight;
          }

        } else {

          if (visibleScrollbar) {
            var ul = this.querySelector("ul");
            ul.scrollTop = ul.scrollTop - (ul.offsetHeight / elems.length);
          }
        }
      }

      if (!new_elem) {
        new_elem = active_elem;
      }

      active_elem.classList.remove('hover');

    } else {
      //first elem
      new_elem = elems[0];
    }

    new_elem.classList.add('hover');
  };

  this.submitSearch = function(value) {
    var active_elem = this.getActiveListElem();
    var input = this.querySelector("z-input");
    var updateInput = true;

    if (!value) {
      if (active_elem) {
        value = active_elem.textContent;
      } else {
        value = input.getValue();
        updateInput = false;
      }
    }

    if (updateInput) {
      input.setAttribute('data-value', value);
    }

    this.closeDropdown();
    this.fireSubmitEvent(value);
  };

  this.createDropdownItem = function(item) {
    var li = document.createElement("li");
    li.innerHTML = item.query;

    if (item.data_value) {
      li.setAttribute('data-value', item.data_value);
    }

    return li;
  };

  this.onDropdownItemClick = function(item) {
    if (item) {
      this.submitSearch(item.textContent);
    } else {
      this.submitSearch();
    }
  };

  this.renderDropdown = function(items) {
    var base = this;
    var list = this.querySelector("ul");
    if (!list) {
      list = document.createElement("ul");
      this.appendChild(list);
    }

    list.innerHTML = "";
    list.setAttribute('data-active', 'active');

    items.map(function(item) {
      var list_elem = base.createDropdownItem(item);
      list.appendChild(list_elem);

      list_elem.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        base.onDropdownItemClick(this);
      }

      list_elem.addEventListener('mouseover', function() {
        var active_elem = base.getActiveListElem();
        if (active_elem) {
          active_elem.removeAttribute('data-selected');
        }
      }, false);
    });
  };

  this.closeDropdown = function() {
    var list = this.querySelector("ul");
    if (list) {
      list.removeAttribute('data-active');
    }
  };

  this.autocomplete = function(term, items) {
    if (term.toLowerCase() == this.querySelector("z-input").getValue().toLowerCase() && items.length > 0) {
      this.renderDropdown(items);
    }
  };

  this.fireAutocompleteEvent = function(value) {
    var autocompleteEvent = new CustomEvent('z-search-autocomplete', {
      'detail' : {'value' : value},
      cancelable: true,
      bubbles: true
    });

    this.dispatchEvent(autocompleteEvent);
  };

  this.fireSubmitEvent = function(value) {
    var submitEvent = new CustomEvent('z-search-submit', {
      'detail' : {'value' : value},
      cancelable: true,
      bubbles: true
    });

    this.dispatchEvent(submitEvent);
  };
};

var proto = Object.create(HTMLElement.prototype);
SearchComponent.apply(proto);
document.registerElement("z-search", { prototype: proto });
