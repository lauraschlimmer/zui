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
zDomUtil = this.zDomUtil || {};

zDomUtil.replaceContent = function(elem, new_content) {
  elem.innerHTML = "";
  elem.appendChild(new_content);
}

zDomUtil.clearChildren = function(elem) {
  elem.innerHTML = "";
}

zDomUtil.onClick = function(elem, fn) {
  elem.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    fn.call(this, e);
    return false;
  });
};

zDomUtil.onEnter = function(elem, fn) {
  elem.addEventListener("keydown", function(e) {
    if (e.keyCode == 13) { //ENTER
      e.preventDefault();
      e.stopPropagation();
      fn.call(this, e);
      return false;
    }
  });
}

zDomUtil.handleLinks = function(elem, fn) {
  var click_fn = (function() {
    return function(e) {
      fn(this.getAttribute("href"));
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  })();

  var elems = elem.querySelectorAll("a");
  for (var i = 0; i < elems.length; ++i) {
    if (elems[i].hasAttribute("href")) {
      elems[i].addEventListener("click", click_fn);
    }
  }
};

zDomUtil.escapeHTML = function(str) {
  if (str == undefined || str == null || str.length == 0) {
    return "";
  }
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

zDomUtil.nl2br = function(str) {
  return str.replace(/\n/g, "<br />");
};

zDomUtil.nl2p = function(str) {
  var lines = str.split("\n\n");

  return lines.map(function(s) {
    return "<p>" + s.replace(/\n/g, "<br />")  + "</p>";
  }).join("\n");
};

zDomUtil.textareaGetCursor = function(elem) {
  if ("selectionStart" in elem && document.activeElement == elem) {
    return elem.selectionStart;
  }

  if (elem.createTextRange) {
    var s = document.section.createRange();
    s.moveStart ("character", -elem.value.length);
    return s.text.split("\n").join("").length;
  }

  return -1;
}

zDomUtil.textareaSetCursor = function(elem, pos) {
  if ("selectionStart" in elem) {
    setTimeout(function() {
      elem.selectionStart = pos;
      elem.selectionEnd = pos;
    }, 1);
    return;
  }

  if (elem.createTextRange) {
    var rng = elem.createTextRange();
    rng.moveStart("character", pos);
    rng.collapse();
    rng.moveEnd("character", 0);
    rng.select();
    return;
  }
}
