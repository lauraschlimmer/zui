
class zDropdown extends HTMLElement {
  constructor() {
    super();

    this.menu_items = [];
  }

  setMenuItems(items) {
    this.menu_items = items;

    let tpl = zTemplateUtil.getTemplate("z-dropdown-tpl");
    this.appendChild(tpl);
    this._observe();

    var menu_elem = this.querySelector("[data-content='menu']");
    let _this = this;
    items.forEach((item) => {
      let li_elem = document.createElement("li");
      li_elem.setAttribute("data-value", item.value);
      li_elem.innerHTML = zDomUtil.escapeHTML(item.title);
      menu_elem.appendChild(li_elem);

      li_elem.addEventListener("click", _this._select.bind(_this, item.value), false);
    });
  }

  setValue(value) {
    /* set title */
    var item = this.menu_items.find((i) => {
      return i.value == value;
    });

    if (!item) {
      throw new Error("item doesn't exist: ", value);
    }

    this.querySelector("[data-value='title']").innerHTML = item.title;

    /* set active menu item */
    let active_item = this.querySelector("[data-content='menu'] .active");
    if (active_item) {
      active_item.classList.remove("active");
    }

    let selected_item = this.querySelector(
        "[data-content='menu'] [data-value='" + value + "']");
    selected_item.classList.add("active");
  }

  _select(value) {
    this.setValue(value);
    this._hide();

    var change_ev = new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
      detail: {value: value}
    });

    this.dispatchEvent(change_ev);
  }

  _observe() {
    var ctrl = this.querySelector("[data-control='toggle']");
    ctrl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.classList.toggle("open");
    });
  }

  _hide() {
    this.classList.remove("open");
  }
}

customElements.define("z-dropdown", zDropdown);
