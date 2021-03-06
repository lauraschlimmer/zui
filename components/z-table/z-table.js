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
var TableComponent = function() {
  this.createdCallback = function() {
    if (this.querySelector("table") == null) {
      this.appendChild(document.createElement("table"));
    }

    this.renderTable();
    this.setAttribute("data-resolved", "data-resolved");
  };

  this.renderTable = function() {
    var tpl = Fnord.getTemplate("z-table", "base");
    var tbl = tpl.querySelector("table");
    var header_row = tpl.querySelector("table > thead > tr");

    if (this.getAttribute("data-clickable") != null) {
      tbl.className += " clickable";
    }

    if (this.getAttribute("data-selectable") != null) {
      tbl.className += " selectable";
      header_row.appendChild(document.createElement("th"));
    }

    var base = this;
    var sort;

    this.forEachColumn(function(col, index) {
      var th_elem = document.createElement("th");

      if (col.hasAttribute("data-sortable")) {
        th_elem.setAttribute('data-column-index', index);
        th_elem.setAttribute('data-sortable', col.getAttribute('data-sortable'));
        th_elem.className += " sortable ";


        if (col.getAttribute("data-sort-state") != null) {
          th_elem.classList.add(col.getAttribute("data-sort-state"), "active");
        } else if (col.getAttribute("data-order") != null) {
          th_elem.classList.add(col.getAttribute("data-order"), "active");
        }


        if (col.hasAttribute('data-presort')) {
          col.removeAttribute('data-presort');
          sort = function() {
            base.resortRows(index,col.getAttribute('data-sortable'),col.getAttribute('data-presort'));
          }
        }

        base.observeSortableColumns(th_elem, col);
      }

      th_elem.innerHTML = col.innerHTML;
      header_row.appendChild(th_elem);
    });

    //this.shadowRoot.innerHTML = "";
    var old_tbl = this.querySelector("table[name='visible']");
    if (old_tbl) {
      this.removeChild(old_tbl);
    }

    this.appendChild(tpl);
    this.renderRows();
  };

  this.renderRows = function() {
    var tbody = this.querySelector("table[name='visible'] > tbody");
    var selectEvent = false;
    tbody.innerHTML = "";

    var onRowClick = (function(base) {
      return function() {
        if (selectEvent) {
          selectEvent = false;
          return;
        }
        var ev = new CustomEvent("z-table-row-click", {
          bubbles: true,
          cancelable: true
        });

        var row_index = parseInt(this.getAttribute("data-row-index"), 10);
        var all_rows = base.querySelectorAll("tr");
        all_rows[row_index].dispatchEvent(ev);
      }
    })(this);

    var onRowSelectClick = (function(base) {
      return function() {
        selectEvent = true;
        var row = this.parentNode.parentNode;
        var all_rows = base.querySelectorAll("tr");
        var row_index = parseInt(row.getAttribute("data-row-index"), 10);

        if (this.checked) {
          var ev = new CustomEvent("z-table-row-select", {
            bubbles: true,
            cancelable: true
          });

          row.setAttribute("data-selected", "true");
          all_rows[row_index].setAttribute("data-selected", true);
          all_rows[row_index].dispatchEvent(ev);
        } else {
          var ev = new CustomEvent("z-table-row-deselect", {
            bubbles: true,
            cancelable: true
          });

          row.removeAttribute("data-selected");
          all_rows[row_index].removeAttribute("data-selected");
          all_rows[row_index].dispatchEvent(ev);
        }
      };
    })(this);

    var is_selectable = this.getAttribute("data-selectable") != null;

    this.forEachRowWithPagination(function(row, index) {
      var tr_elem = document.createElement("tr");
      tr_elem.className = "row";
      tr_elem.innerHTML = row.innerHTML;

      if (is_selectable) {
        var select_input = document.createElement("input");
        select_input.setAttribute("type", "checkbox");
        select_input.className = "z-checkbox";
        select_input.addEventListener("click", onRowSelectClick, false);

        if (row.getAttribute("data-selected") != null) {
          select_input.setAttribute("checked", "checked");
          tr_elem.setAttribute("data-selected", true);
        }

        var select_td = document.createElement("td");
        select_td.appendChild(select_input);
        select_td.className = "select";
        tr_elem.insertBefore(select_td, tr_elem.querySelector("td:first-child"));
      }

      tr_elem.addEventListener("click", onRowClick, false);
      tr_elem.setAttribute("data-row-index", index);
      tbody.appendChild(tr_elem);
    });
  };

  this.rowsPerPage = function() {
    if (this.getAttribute("data-per-page") != null) {
      return parseInt(this.getAttribute("data-per-page"), 10);
    } else {
      return -1;
    }
  };

  this.currentPage = function() {
    if (this.getAttribute("data-page") != null) {
      return parseInt(this.getAttribute("data-page"), 10);
    } else {
      return 0;
    }
  };

  this.forEachRowWithPagination = function(cb) {
    var all_rows = this.querySelectorAll("tbody tr");
    var rows_per_page = this.rowsPerPage();
    var begin;
    var end;

    if (rows_per_page < 0) {
      begin = 0;
      end = all_rows.length;
    } else {
      begin = this.currentPage() * rows_per_page;
      end = begin + rows_per_page;

      if (end > all_rows.length) {
        end = all_rows.length;
      }
    }

    for (var i = begin; i < end; ++i) {
      cb(all_rows[i], i);
    }
  };

  this.forEachColumn = function(cb) {
    var col_elems = this.querySelectorAll("z-table-column");
    for (var i = 0; i < col_elems.length; ++i) {
      cb(col_elems[i], i);
    }
  };

  this.attributeChangedCallback = function(attr, old_val, new_val) {
    if (attr == "data-page" || attr == "data-per-page") {
      this.renderRows();
    }
  };

  this.inactivateSortedColumn = function(new_column) {
    var attr = ['data-sort-state', 'data-order'];

    for (var i = 0; i < attr.length; i++) {
      var column = this.querySelector('z-table-column[' + attr[i] + ']');
      if (column && column != new_column) {
        column.removeAttribute(attr[i]);
        return;
      }
    }
  };

  this.observeSortableColumns = function(th_elem, column) {
    var base = this;

    th_elem.onclick = function() {
      var index = this.getAttribute('data-column-index');
      base.inactivateSortedColumn(column);

      if (typeof base.customResortRows == 'function') {
        base.customResortRows(column, index);
      } else {
        base.resortRows(
          index,
          this.getAttribute('data-sortable'));
      }
    }
  };

  this.resortRows = function(column_index, type, sort_direction) {
    var col_elems = this.querySelectorAll("z-table-column");
    if (column_index >= col_elems.length) {
      return;
    }

    var column = col_elems[column_index];

    if (sort_direction == "asc") {
      column.setAttribute("data-sort-state", "asc");
      this.resortRowsWithOrder(column_index, "asc");
    } else if (sort_direction == "desc") {
      column.setAttribute("data-sort-state", "desc");
      this.resortRowsWithOrder(column_index, "desc");
    } else if (column.getAttribute("data-sort-state") == "asc") {
      column.setAttribute("data-sort-state", "desc");
      this.resortRowsWithOrder(column_index, "desc");
    } else {
      column.setAttribute("data-sort-state", "asc");
      this.resortRowsWithOrder(column_index, "asc");
    }

    this.setAttribute("data-page", "0");
    this.renderTable();
  };

  this.resortRowsWithOrder = function(column_index, order) {
    var tbody;
    if (this.querySelector("table tbody") != null) {
      tbody = this.querySelector("table tbody");
    } else {
      tbody = this.querySelector("table");
    }

    var sort_fn = this.rowSortFunction;
    if (!sort_fn) {
      if (order == "asc") {
        sort_fn = function(a, b) {
          return a.cells[column_index].innerHTML > b.cells[column_index].innerHTML;
        };
      } else {
        sort_fn = function(a, b) {
          return a.cells[column_index].innerHTML < b.cells[column_index].innerHTML;
        };
      }
    }


    /* naive bubble sort */
    var n = tbody.children.length;
    while (true) {
      var swapped = false;
      for (var i = 1; i < n; ++i) {
        if (sort_fn(tbody.children[i-1], tbody.children[i])) {
          tbody.insertBefore(tbody.children[i], tbody.children[i-1]);
          swapped = true;
        }
      }

      if (!swapped) {
        break;
      }
    }
  };

  this.appendRowFromArray = function(cols) {
    var tr = document.createElement("tr");

    for (var i = 0; i < cols.length; ++i) {
      var td = document.createElement("td");
      td.innerHTML = cols[i];
      tr.appendChild(td);
    }

    this.appendRow(tr);
    return tr;
  }

  this.appendRow = function(tr_elem) {
    this.querySelector("table").appendChild(tr_elem);
    this.renderTable();
  };

  /**
    * @height: table max height pixel value
    * Set data-per-page so that the table fits the max height
    */
  this.setDataPerPageForHeight = function(height) {
    var header = this.querySelector("table[name='visible'] thead th");
    var row_height = this.querySelector("table[name='visible'] tbody td").offsetHeight;
    var data_per_page;

    //rows haven't been rendered yet, return default
    if (row_height == 0) {
      return 25;
    }

    if (header) {
      height = height - header.offsetHeight;
    }

    data_per_page = Math.floor(height / row_height);

    this.setAttribute('data-per-page', data_per_page);
    return data_per_page;
  };

  /* pagination element functions */
  this.getNumberOfItems = function() {
    return this.querySelectorAll("tr").length;
  };

  this.paginationEvent = function(page, base) {
    base.setAttribute('data-page', page);
  };

};

var proto = Object.create(HTMLElement.prototype);
TableComponent.apply(proto);
document.registerElement("z-table", { prototype: proto });
