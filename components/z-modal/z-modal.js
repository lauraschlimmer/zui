
class zModal extends HTMLElement {
  constructor() {
    super();

    window.setTimeout(() => {
      this.addEventListener("click", this.hide, false);

      var window_elem = this.querySelector("z-modal-window");
      window_elem.addEventListener("click", (e) => {
        e.stopPropagation();
      }, false);
    });

  }

  show() {
    var on_escape = function(e) {
      if (e.keyCode == 27) {
        this.hide();
      }
    };

    this.escape_listener = on_escape.bind(this);

    this.classList.add("active");
    document.addEventListener("keyup", this.escape_listener, false);
  }

  hide() {
    this.classList.remove("active");
    document.removeEventListener("keyup", this.escape_listener, false);
  }
}

customElements.define("z-modal", zModal);
