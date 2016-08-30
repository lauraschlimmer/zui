/**
 * This file is part of the "FnordMetric" project
 *   Copyright (c) 2015 Laura Schlimmer
 *   Copyright (c) 2015 Paul Asmuth
 *
 * FnordMetric is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License v3.0. You should have received a
 * copy of the GNU General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */
var DateRangePickerComponent = function() {
  var default_opts = {
    /* the timestamp of the first day of the month to render */
    begin: null
  };

  var opts = {
    selection: {},
    i18n: {}
  };

  var this_;
  var calendar;

  this.createdCallback = function() {
    this_ = this;

    var tpl = zTemplateUtil.getTemplate("z-daterangepicker-base-tpl");
    calendar = tpl.querySelector("z-calendar");
    this.appendChild(tpl);

    this.querySelector("z-daterangepicker-field").addEventListener(
        "click",
        function(e) {
          e.stopPropagation();
          toggleVisibility();
        },
        false);

    this.querySelector("z-daterangepicker-widget").addEventListener(
        "click",
        function(e) {
            e.stopPropagation();
        },
        false);

    //cancel
    this.querySelector("button.cancel").addEventListener(
        "click",
        hideWidget,
        false);

    //apply
    this.querySelector("button.submit").addEventListener("click", function() {
      console.log("apply selection");
     // _this.applied.from = _this.editing.from;
     // _this.applied.until = _this.editing.until;
     // _this.toggleWidgetVisibility();
     // _this.fireSelectEvent();
     // _this.renderPreview();
    }, false);

    if (this.hasAttribute("data-from") && this.hasAttribute("data-until")) {
     // this.setWidget();
      renderPreview();
    }
  };

  /**
    * set the begin of the selected date range
    * @new_begin is a milliseconds timestamp (UTC)
    */
  this.setRangeBegin = function(begin) {
    opts.selection.begin = begin;
  }

  /**
    * get the begin of the selected date range
    */
  this.getRangeBegin = function() {
    return opts.selection.begin;
  }

  /**
    * set the end of the selected date range
    * @new_end is a milliseconds timestamp (UTC)
    */
  this.setRangeEnd = function(end) {
    opts.selection.end = end;
  }

  /**
    * get the end of the selected date range
    */
  this.getRangeEnd = function() {
    return opts.selection.end;
  }


/******************************** private ******************************/

  var toggleVisibility = function() {
    if (isVisible()) {
      hideWidget();
    } else {
      displayWidget();
    }
  }

  var isVisible = function() {
    return this_.hasAttribute("data-active");
  }

  var displayWidget = function() {
    this_.setAttribute("data-active", true);

    renderCalendar();
  }

  var hideWidget = function() {
    this_.removeAttribute("data-active");
  }

  var renderPreview = function() {

  }

  var render = function() {

  }

  var renderCalendar = function() {
    calendar.render(zObjectUtil.merge(opts, default_opts));
  }

  this.fireSelectEvent = function() {
    var ev = new CustomEvent('select', {
      'detail' : {'from' : this.applied.from, 'until' : this.applied.until},
      'bubbles' : true,
      'cancelable' : true
    });

    this.dispatchEvent(ev);
  };
};

var proto = Object.create(HTMLElement.prototype);
DateRangePickerComponent.apply(proto);
document.registerElement("z-daterangepicker", { prototype: proto });
