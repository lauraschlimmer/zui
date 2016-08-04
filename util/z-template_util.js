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
zTemplateUtil = this.zTemplateUtil || (function() {
  var enable_html5_import = false; // google only technology, not even properly documented :(
  var enable_html5_templates = ("content" in document.createElement("template"));
  var enable_html5_importnode = 'importNode' in document;

  try {
    document.importNode(document.createElement('div'));
  } catch (e) {
    enable_html5_importnode = false;
  }

  function importNodeFallback(node, deep) {
    var a, i, il, doc = document;

    switch (node.nodeType) {

      case document.DOCUMENT_FRAGMENT_NODE:
        var new_node = document.createDocumentFragment();
        while (child = node.firstChild) {
          new_node.appendChild(node);
        }
        return new_node;

      case document.ELEMENT_NODE:
        var new_node = doc.createElementNS(node.namespaceURI, node.nodeName);
        if (node.attributes && node.attributes.length > 0) {
          for (i = 0, il = node.attributes.length; i < il; i++) {
            a = node.attributes[i];
            try {
              new_node.setAttributeNS(
                  a.namespaceURI,
                  a.nodeName,
                  node.getAttribute(a.nodeName));
            } catch (err) {}
          }
        }
        if (deep && node.childNodes && node.childNodes.length > 0) {
          for (i = 0, il = node.childNodes.length; i < il; i++) {
            new_node.appendChild(
                importNodeFallback(node.childNodes[i],
                deep));
          }
        }
        return new_node;

      case document.TEXT_NODE:
      case document.CDATA_SECTION_NODE:
      case document.COMMENT_NODE:
        return doc.createTextNode(node.nodeValue);

    }
  }

  var getTemplate = function(template_id) {
    var template_selector = "#" + template_id;

    var template = document.querySelector(template_selector);

    if (!template && enable_html5_import) {
      var template_imports = document.querySelectorAll("link[rel='import']");

      for (var i = 0; !template && i < template_imports.length; ++i) {
        template = template_imports[i].import.querySelector(template_selector);
      }
    }

    if (!template) {
      return null;
    }

    var content;
    if (enable_html5_templates) {
      content = template.content;
    } else {
      content = document.createDocumentFragment();
      var children = template.children;

      for (var j = 0; j < children.length; j++) {
        content.appendChild(children[j].cloneNode(true));
      }
    }

    if (enable_html5_importnode) {
      return document.importNode(content, true);
    } else {
      return importNodeFallback(content, true);
    }
  };

  return {
    getTemplate: getTemplate
  };
})();
