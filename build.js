"use strict";

let fs = require("fs");
let readline = require("readline");
let path = require("path");
let process = require("process");
let util = require("util");

let bundle_file = "./index.html";
fs.writeFile(bundle_file, "", function() {});

let line_reader = readline.createInterface({
  input: fs.createReadStream("./assets.lst")
});

line_reader.on("line", function(line) {
  fs.readFile(path.join("./", line), {encoding: "utf-8"}, function(err, data) {
    if (err) {
      process.stderr.write("ERROR: ", err);
      return;
    }

    let asset_data;
    let ext = path.extname(line);
    switch (ext) {
      case ".html":
        asset_data = data;
        break;

      case ".css":
        asset_data = "<style type='text/css'>" + data + "</style>\n";
        break;

      case ".js":
        asset_data = "<script>" + data + "</script>\n";
        break;

      default:
        throw new Error("unknown file ending: ", line);
    }

    fs.appendFile(bundle_file, asset_data, function(err) {
      if (err) {
        process.stderr.write("ERROR: ", err);
      }
    });
  });
});

