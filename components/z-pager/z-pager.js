var PagerComponent = function() {
  var offset;
  var limit;

  this.createdCallback = function() {
    var _this = this;

    this.querySelector("z-pager-tooltip[data-type='for']")
        .addEventListener("click", function(e) {
          if (this.classList.contains("disabled")) {
            return;
          }

          _this.pageEvent(offset + limit);
        }, false);

    this.querySelector("z-pager-tooltip[data-type='back']")
        .addEventListener("click", function(e) {
          if (this.classList.contains("disabled")) {
            return;
          }

          _this.pageEvent(offset - limit);
        }, false);
  };

  this.render = function(num_items, new_offset, new_limit) {
    if (typeof num_items !== "number" ||
        typeof new_offset !== "number" ||
        typeof new_limit !== "number") {
      console.log("z-pager ERROR: argument error");
      return;
    }

    offset = new_offset;
    limit = new_limit;

    this.querySelector("z-pager-title").innerHTML =
        (offset + 1) + " &mdash; " + (offset + num_items);

    var tooltip_for = this.querySelector("z-pager-tooltip[data-type='for']");
    // last page
    if (num_items < limit) {
      tooltip_for.classList.add("disabled");
    } else {
      tooltip_for.classList.remove("disabled");
    }

    var tooltip_back = this.querySelector("z-pager-tooltip[data-type='back']");
    // first page
    if (offset < limit) {
      tooltip_back.classList.add("disabled");
    } else {
      tooltip_back.classList.remove("disabled");
    }
  }

  this.pageEvent = function(new_offset) {
    var page_event = new CustomEvent(
        "z-pager-turn",
        {detail: {offset: new_offset}});

    this.dispatchEvent(page_event);
  };

  //this.forElement = function(elem) {
  //  var callback = elem.paginationEvent;

  //  this.init();
  //  this.renderTitle();
  //  this.observeTooltips(callback, elem);
  //};

  //this.disable = function(tooltip) {
  //  var _this = this;
  //  tooltip.forEach(function(t) {
  //    _this.querySelector(".tooltip." + t).classList.add("disabled");
  //  });
  //};


  //this.enable = function(tooltip) {
  //  var _this = this;
  //  tooltip.forEach(function(t) {
  //    _this.querySelector(".tooltip." + t).classList.remove("disabled");
  //  });
  //};


  //this.init = function() {
  //  this.initCurrentPage();
  //  this.initLastItem();
  //  this.initNumPerPage();
  //  this.initNumPages();
  //};

  //this.initCurrentPage = function() {
  //  var curr_page = parseInt(this.getAttribute('data-current-page'), 10);

  //  if (isNaN(curr_page)) {
  //    curr_page = 0;
  //  }

  //  this.current_page = curr_page;
  //};

  //this.initLastItem = function() {
  //  var end = parseInt(this.getAttribute('data-last-item'), 10);

  //  if (isNaN(end)) {
  //    end = 0;
  //  }

  //  this.end = end;
  //};

  //this.initNumPerPage = function() {
  //  var per_page = parseInt(this.getAttribute('data-per-page'), 10);

  //  if (isNaN(per_page)) {
  //    per_page = 1;
  //  }

  //  this.per_page = per_page;
  //};

  //this.initNumPages = function() {
  //  this.pages = Math.ceil((this.end - 1) / this.per_page);
  //};


  //this.renderTitle = function() {
  //  var current_page = this.current_page;
  //  var per_page = this.per_page;
  //  var end = this.end;
  //  var title = this.querySelector(".title");

  //  var start = (current_page) * per_page + 1;
  //  var current_end = start + per_page - 1;

  //  if (current_end > end) {
  //    current_end = end;
  //  }


  //  title.innerHTML =
  //    "<b>" + start + "</b> - <b>" + current_end;

  //  if (this.getAttribute('data-title') == 'semi') {
  //    return;
  //  }

  //  title.innerHTML +=  "</b> of <b>" + end + "</b>";
  //};


  //this.observeTooltips = function(cb, caller) {
  //  var backward_tooltip = this.querySelector(".backward");
  //  var forward_tooltip = this.querySelector(".forward");
  //  var base = this;

  //  backward_tooltip.onclick = function() {
  //    if (this.classList.contains('disabled')) {
  //      return;
  //    }

  //    var pages = base.pages;
  //    var current_page = base.current_page;

  //    if (current_page > 0 || base.hasAttribute('data-circling')) {
  //      var new_page = (current_page + pages - 1) % pages;
  //      cb(new_page, caller);
  //      base.current_page = new_page;
  //      base.renderTitle();
  //    }
  //  };

  //  forward_tooltip.onclick = function() {
  //    if (this.classList.contains('disabled')) {
  //      return;
  //    }

  //    var pages = base.pages;
  //    var current_page = base.current_page;

  //    if (current_page < pages - 1) {
  //      base.current_page =  current_page + 1;
  //      base.renderTitle();
  //      cb(current_page + 1, caller);
  //    } else {
  //      if (base.hasAttribute('data-circling')) {
  //        base.current_page = 0;
  //        base.renderTitle();
  //        cb(0, caller);
  //      }
  //    }
  //  };
  //};


};

var proto = Object.create(HTMLElement.prototype);
PagerComponent.apply(proto);
document.registerElement("z-pager", { prototype: proto });
