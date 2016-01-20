/**
 * This file is part of the "zui" project
 *   Copyright (c) 2016, zScale Technologies GmbH - All rights reserved.
 *
 * Authors:
 *   Laura Schlimmer <laura@zscale.io>
 *   Paul Asmuth <paul@zscale.io>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the zScale Technologies GmbH nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ZSCALE TECHNOLOGIES GMBH BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
zTable = function(table) {
  table.rows = table.rows || [];

  var on_sort = [];
  var on_click = [];

  this.getColumns = function() {
    return table.columns;
  }

  this.getColumn = function(column_name) {
    for (var i = 0; i < table.columns.length; ++i) {
      if (table.columns[i].key == column_name) {
        return table.columns[i];
      }
    }

    return null;
  }

  this.getRows = function() {
    return table.rows;
  }

  this.setRows = function(rows) {
    table.rows = rows;
  }

  this.addRow = function(row) {
    table.rows.push(row);
  }

  this.updateRows = function(key_column, updates) {
    for (var i = 0; i < table.rows.length; ++i) {
      var key_cell = table.rows[i].cells[key_column];
      if (key_cell && updates.hasOwnProperty(key_cell.value)) {
        var update = updates[key_cell.value];
        for (k in update) {
          table.rows[i].cells[k] = (table.rows[i].cells[k] || {});
          table.rows[i].cells[k].value = update[k];
        }
      }
    }
  }

  this.getColumnValues = function(column_names) {
    var result = [];
    for (var i = 0; i < column_names.length; ++i) {
      result.push([]);
    }

    table.rows.forEach(function(row) {
      for (var i = 0; i < column_names.length; ++i) {
        var cell = row.cells[column_names[i]];
        result[i].push(cell ? cell.value : null);
      }
    });

    return result;
  }

  this.onClick = function(fn) {
    on_click.push(fn);
  }

  this.onSort = function(fn) {
    on_sort.push(fn);
  }

  this.sortByColumn = function(column_name, direction) {
    var comparator;
    if (table.columns) {
      for (var i = 0; i < table.columns.length; ++i) {
        if (table.columns[i].key == column_name) {
          table.columns[i].sorted = direction;
          comparator = table.columns[i].comparator;
        } else {
          delete table.columns[i].sorted;
        }
      }
    }

    if (!comparator) {
      comparator = function(a, b) {
        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
      }
    }

    var reverse = direction == "desc";
    table.rows.sort(function(a, b) {
      var a_cell = a.cells[column_name];
      var a_value = a_cell ? a_cell.value : null;
      var b_cell = b.cells[column_name];
      var b_value = b_cell ? b_cell.value : null;

      if (reverse) {
        return comparator(b_value, a_value);
      } else {
        return comparator(a_value, b_value);
      }
    });
  }

  this.setVisibleColumns = function(visible_columns) {
    if (table.columns) {
      table.columns.forEach(function(col) {
        if (visible_columns.indexOf(col.key) < 0) {
          col.hidden = true;
        } else {
          delete col.hidden;
        }
      });
    }
  };

  this.render = function(elem) {
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");

    /* render columns header */
    var head_tr = document.createElement("tr");
    thead.appendChild(head_tr);

    table.columns.forEach(function(c) {
      if (c.hidden) {
        return;
      }

      var th = document.createElement("th");
      th.setAttribute("align", c.align || "left");
      th.innerHTML = c.title;

      if (c.sortable) {
        var sort_asc = document.createElement("i");
        sort_asc.classList.add("sort_asc");
        th.appendChild(sort_asc);

        var sort_desc = document.createElement("i");
        sort_desc.classList.add("sort_desc");
        th.appendChild(sort_desc);

        switch (c.sorted) {
          case "asc":
            sort_asc.classList.add("active");
            break;
          case "desc":
            sort_desc.classList.add("active");
            break;
        }

        var sort_fn = function(dir) {
          on_sort.forEach(function(f) {
            f(c, dir);
          });
        };

        zDomUtil.onClick(sort_asc, function() {
          sort_fn("asc");
        });

        zDomUtil.onClick(sort_desc, function() {
          sort_fn("desc");
        });
      }

      head_tr.appendChild(th)
    });

    /* render rows */
    table.rows.forEach(function(row) {
      var tr = document.createElement("tr");

      table.columns.forEach(function(col) {
        if (col.hidden) {
          return;
        }

        var cell = {};
        if (row.cells.hasOwnProperty(col.key)) {
          cell = row.cells[col.key];
        }

        var td = document.createElement("td");
        td.setAttribute("align", cell.align || col.align || "left");
        if (cell.class) {
          td.setAttribute("class", cell.class);
        }

        var td_a = document.createElement("a");
        if (cell.href) {
          td_a.setAttribute("href", cell.href);
        }

        var cell_value = cell.value;
        if (cell.value_html) {
          cell_value = cell.value_html;
        } else {
          if (cell_value && col.formatter) {
            cell_value = col.formatter(cell_value);
          }

          if (!cell_value) {
            cell_value = table.empty_cell_value || "—";
          }

          cell_value = $.escapeHTML(cell_value);
        }

        td_a.innerHTML = cell_value;
        td.appendChild(td_a)
        tr.appendChild(td)
      });

      tr.addEventListener("click", function(e) {
        on_click.forEach(function(f) {
          f(row);
        });
        return false;
      });

      tbody.appendChild(tr)
    });

    /* commit changes to DOM */
    elem.innerHTML = "";
    elem.appendChild(thead);
    elem.appendChild(tbody);
  };

  this.toCSV = function(opts) {
    opts = opts || {};
    opts.row_separator = opts.row_separator || "\n";
    opts.column_separator = opts.column_separator || ",";
    opts.quote_char = opts.quote_char || "\"";

    var csv = "";
    var add_row = function(row) {
      var r = row.map(function(s) {
        s = (s || "").toString();

        while (s.indexOf(opts.quote_char) >= 0) {
          s = s.replace(opts.quote_char, "\\" + opts.quote_char);
        }

        return opts.quote_char + s + opts.quote_char;
      })

      csv += r.join(opts.column_separator) + opts.row_separator;
    }

    var column_names = table.columns.map(function(c) { return c.key; });
    add_row(column_names);

    table.rows.forEach(function(row) {
      var r = [];
      for (var i = 0; i < column_names.length; ++i) {
        var cell = row.cells[column_names[i]];
        r.push(cell ? cell.value : null);
      }
      add_row(r);
    });

    return csv;
  }

}
