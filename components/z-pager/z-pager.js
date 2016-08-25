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

          offset += limit;
          _this.pageEvent();
        }, false);

    this.querySelector("z-pager-tooltip[data-type='back']")
        .addEventListener("click", function(e) {
          if (this.classList.contains("disabled")) {
            return;
          }

          offset -= limit;
          _this.pageEvent();
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

  this.getOffset = function() {
    return offset;
  }

  this.pageEvent = function() {
    var page_event = new CustomEvent(
        "z-pager-turn",
        {detail: {offset: offset}});

    this.dispatchEvent(page_event);
  };
};

var proto = Object.create(HTMLElement.prototype);
PagerComponent.apply(proto);
document.registerElement("z-pager", { prototype: proto });
