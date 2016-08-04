zCSVUtil = this.zCSVUtil || {};

zCSVUtil.toCSV = function(opts, columns, rows) {
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

  add_row(columns);

  rows.forEach(function(row) {
    var r = [];
    for (var i = 0; i < columns.length; ++i) {
      var cell = row[i];
      r.push(cell ? cell : null);
    }
    add_row(r);
    });

    return csv;
  }

