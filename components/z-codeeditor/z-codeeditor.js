var CodeEditorComponent = function() {

  var initCodeMirror = function(textarea) {
    var codemirror_opts = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true
    };

    if (this.hasAttribute("data-readonly")) {
      codemirror_opts.readOnly = true;
      codemirror_opts.autofocus = false;
    }

    var codemirror = CodeMirror.fromTextArea(textarea, codemirror_opts);
    codemirror.setOption("mode", this.getAttribute("data-language"));

    // FIXME horrible horrible hack to work around a bug in codemirror where
    // the editor can't be rendered properly before the browser has actually
    // rendered the backing textarea. yield to the browser and poll for
    // completed rendering
    var poll = (function(base){
      return function() {
        if (base.querySelector(".CodeMirror-gutter").offsetWidth == 0) {
          codemirror.refresh();
          window.setTimeout(poll, 1);
        }
      };
    })(this);
    poll();

    return codemirror;
  }


  var setupKeyPressHandlers = function() {
    var base = this;
    this.addEventListener('keydown', function(e) {
      //metaKey is cmd key on mac and windows key on windows
      if (e.keyCode == 13 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        base.execute.call(base);
      }
    }, false);
  };

  var setupResizer = function() {
    var resizer = this.querySelector("z-codeeditor-resizer-tooltip")
    var gutters = this.querySelector(".CodeMirror-gutters");
    var codemirror = this.querySelector(".CodeMirror");
    var benchmark_y;

    //TODO handle horizontal resizing
    resizer.addEventListener('dragstart', function(e) {
      this.style.background = "transparent";
      this.style.border = "none";
      benchmark_y = e.clientY;
    }, false);

    resizer.addEventListener('drag', (function(elem) {
      return function(e) {
        e.preventDefault();
        this.style.background = "";
        this.style.border = "";
        var offset = benchmark_y - e.clientY;
        var height = elem.offsetHeight - offset;
        elem.style.height = height + "px";
        codemirror.style.height = height + "px";
        gutters.style.height = height + "px";
        benchmark_y = e.clientY;
      }
    })(this));
  };

  this.createdCallback = function() {
    var tpl = zTemplateUtil.getTemplate("z-codeeditor-base-tpl");
    this.appendChild(tpl);

    var codemirror = initCodeMirror.call(this, this.querySelector("textarea"));
    setupKeyPressHandlers.call(this);

    if (this.hasAttribute("data-resizable")) {
      window.setTimeout(setupResizer.bind(this));
    }

    this.getValue = function() {
      return codemirror.getValue();
    };

    this.setValue = function(value) {
      if (!value) {return;}
      codemirror.setValue(value);
    }

    this.execute = function() {
      var ev = new Event('execute');
      ev.value = this.getValue();
      this.dispatchEvent(ev);
    }

    this.setReadonly = function(readonly) {
      codemirror.options.readOnly= readonly;
      codemirror.options.autofocus = !readonly;
    };

    this.focus = function() {
      codemirror.focus();
    };
  };

  this.attributeChangedCallback = function(attr, old_value, new_value) {
    switch (attr) {
      case "data-readonly":
        this.setReadonly(new_value != null);
      break;

      default:
        break;
    }
  };
};

var proto = Object.create(HTMLElement.prototype);
CodeEditorComponent.apply(proto);
document.registerElement("z-codeeditor", { prototype: proto });
