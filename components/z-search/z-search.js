
class zSearch extends HTMLElement {
  constructor(config) {
    super();
  }

  init(config) {
    config = config || {};

    let tpl = zTemplateUtil.getTemplate("z-search-tpl");
    zDomUtil.replaceContent(this, tpl);

    let input = this.querySelector("input");

    input.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case 13: //enter
          let active_item = this.querySelector("[data-content='menu'] .active");
          if (active_item) {
            input.value = active_item.getAttribute("data-title");
            this._fireChange(active_item.getAttribute("data-value"));
          } else {
            this._fireChange(input.value);
          }
          this.classList.remove("open");

          break;
        case 38: //arrow up
          e.preventDefault();
          this._navigateUp();
          break;
        case 40: //arrow down
          e.preventDefault();
          this._navigateDown();
          break;

        default:
          if (config.autocomplete &&
              input.value.length >= config.autocomplete.min_length) {
            this._fireAutocomplete(input.value);
          } else {
            this.classList.remove("open");
            zDomUtil.clearChildren(this.querySelector("[data-content='menu']"));
          }
          break;
      }
    }, false);

    input.addEventListener("change", (e) => {
      e.stopPropagation();
    });
  }

  setPlaceholder(placeholder) {
    this.querySelector("input").setAttribute("placeholder", placeholder);
  }

  autocomplete(term, menu_items) {
    if (term != this.querySelector("input").value) {
      return;
    }

    var menu_elem = this.querySelector("[data-content='menu']");
    zDomUtil.clearChildren(menu_elem);

    menu_items.forEach(function(item) {
      var li_elem = document.createElement("li");
      li_elem.setAttribute("data-value", item.value);
      li_elem.setAttribute("data-title", zDomUtil.escapeHTML(item.title));
      li_elem.innerHTML = zDomUtil.escapeHTML(item.title);
      menu_elem.appendChild(li_elem);
    });

    this.classList.add("open");
  }

  _navigateDown() {
    let current_elem = this.querySelector("[data-content='menu'] .active");
    if (current_elem) {
      if (current_elem.nextSibling) {
        current_elem.classList.remove("active");
        current_elem.nextSibling.classList.add("active");
      }
    } else {
      let menu_items = this.querySelectorAll("[data-content='menu'] li");
      if (menu_items.length > 0) {
        menu_items[0].classList.add("active");
      }
    }
  }

  _navigateUp() {
    let current_elem = this.querySelector("[data-content='menu'] .active");
    if (current_elem) {
      if (current_elem.previousSibling) {
        current_elem.classList.remove("active");
        current_elem.previousSibling.classList.add("active");
      }
    }
  }

  _fireChange(value) {
    let change_ev = new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
      detail: {value: value}
    });

    this.dispatchEvent(change_ev);
  }

  _fireAutocomplete(value) {
    let ev = new CustomEvent("autocomplete", {
      bubbles: true,
      cancelable: true,
      detail: {value: value}
    });

    this.dispatchEvent(ev);
  }
}

customElements.define("z-search", zSearch);
