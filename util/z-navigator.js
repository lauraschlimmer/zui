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
var zNavigator = function(win) {
  var on_navigation_change = [];
  var current_path = win.location.pathname + win.location.search;

  var apply = function(path) {
    if (path == current_path) {
      return;
    }

    current_path = path;
    for (var i = 0; i < on_navigation_change.length; ++i) {
      on_navigation_change[i](path);
    }
  };

  setTimeout(function() {
    win.addEventListener('popstate', function(e) {
      e.preventDefault();
      if (e.state && e.state.path) {
        apply(e.state.path);
      } else {
        apply(win.location.pathname + win.location.search);
      }
    }, false);
  }, 0);

  this.getPath = function() {
    return current_path;
  }

  this.navigateTo = function(path) {
    history.pushState({path: path}, "", path);
    apply(path);
  };

  this.onNavigationChange = function(fn) {
    on_navigation_change.push(fn);
  };

};
