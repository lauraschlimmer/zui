/**
 * This file is part of the "FnordMetric" project
 *   Copyright (c) 2016 Laura Schlimmer
 *   Copyright (c) 2016 Paul Asmuth
 *
 * FnordMetric is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License v3.0. You should have received a
 * copy of the GNU General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */

var WeekPickerComponent = function() {
  this.createdCallback = function() {
    var tpl = $.getTemplate(
        "widgets/z-weekpicker",
        "z-weekpicker-base-tpl");

    this.appendChild(tpl);
    this.setFieldValue();

    var _this = this;
    this.querySelector("z-weekpicker-field").addEventListener(
      "click", function(e) {
        _this.toggleVisibility();
      });

    this.querySelector("button.apply").addEventListener("click", function(e) {
      _this.onSelect();
    });
  };


  this.setValue = function(year, week) {
    if (!year || !week) {
      this.year = null;
      this.week = null;
    } else {
      this.year = year;
      this.week = week;
    }

    this.setFieldValue();
  };

  this.setStart = function(from) {
    var date = new Date(parseInt(from, 10));

    this.year = date.getFullYear();
    this.week = DateUtil.getWeekNumber(date);

    this.setFieldValue();
  };

  this.getStart = function() {
    var year_input = this.querySelector("input.year");
    var week_input = this.querySelector("input.week");

    if (!year_input || !week_input) {
      return null;
    }

    var from = DateUtil.fromWeekNo(year_input.value, week_input.value);
    return from;
  };

  this.getValue = function() {
    if (!this.year || !this.week) {
      return null;
    }

    return {
      year: this.year,
      week: this.week
    }
  };

  this.getTimerange = function() {
    var from = this.getStart();
    if (!from) {
      return null;
    }

    return {
      from: from,
      until: from + DateUtil.millisPerWeek - 100
    };
  }

  this.setFieldValue = function() {
    var value_field = this.querySelector("z-weekpicker-field .weekpicker_value");

    if (!(this.year && this.week)) {
      value_field.innerHTML = "Select";
    } else {
      value_field.innerHTML = this.year + "/" + this.week;
    }
  };

  this.toggleVisibility = function() {
    if (this.classList.contains("active")) {
      this.hide();
    } else {
      this.show();
    }
  };

  this.hide = function() {
    this.classList.remove("active");
  };

  this.show = function() {
    var selection_inner = $.getTemplate(
        "widgets/z-weekpicker",
        "z-weekpicker-selection-base-tpl");

    var selection_container = this.querySelector(
        "z-weekpicker-flyout .weekpicker_selection");
    selection_container.innerHTML = "";
    selection_container.appendChild(selection_inner);

    var year_input = this.querySelector("input.year");
    var week_input = this.querySelector("input.week");

    year_input.addEventListener("select", function(e) {
      e.stopPropagation();
    });
    week_input.addEventListener("select", function(e) {
      e.stopPropagation();
    });

    if (!this.year || !this.week) {
      var now = new Date();
      year_input.placeholder = now.getFullYear();
      week_input.placeholder = DateUtil.getWeekNumber(now);
    } else {
      year_input.value = this.year;
      week_input.value = this.week;
    }

    this.classList.add("active");
    year_input.focus();
  };

  this.onSelect = function() {
    var year_input = this.querySelector("input.year");
    var week_input = this.querySelector("input.week");
    var year = parseInt(year_input.value, 10);
    var week = parseInt(week_input.value, 10);

    if (isNaN(year)) {
      year_input.classList.add("error");
      return;
    }

    if (isNaN(week)) {
      week_input.classList.add("error");
      return;
    }

    this.year = year;
    this.week = week;

    var ev = new CustomEvent('select', {
      'bubbles' : true,
      'cancelable' : true
    });

    this.dispatchEvent(ev);
    this.toggleVisibility();
  };

};

var proto = Object.create(HTMLElement.prototype);
WeekPickerComponent.apply(proto);
document.registerElement("z-weekpicker", { prototype: proto });
