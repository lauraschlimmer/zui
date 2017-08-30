
class zMenu extends HTMLElement {
  constructor() {
    super();

    let items = this.querySelectorAll("[data-link]");
    for (let i = 0; i < items.length; ++i) {
      items[i].addEventListener("click", this.onChange.bind(this, items[i]), false);
    }
  }

  onChange(item, ev) {
    ev.preventDefault();

    let active_elem = this.querySelector(".active");
    if (active_elem) {
      active_elem.classList.remove("active");
    }

    item.classList.add("active");

    var change_ev = new CustomEvent("change", {
      bubbles: true,
      cancelable: true
    });
    item.dispatchEvent(change_ev);
  }
}

customElements.define("z-menu", zMenu);
