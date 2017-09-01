
class zTabbable extends HTMLElement {
  constructor() {
    super();
  }

  init() {
    let tabs = this.querySelectorAll("z-tab[data-tab]");
    for (let i = 0; i < tabs.length; ++i) {
      tabs[i].addEventListener(
          "click",
          this.setActiveTab.bind(this, tabs[i].getAttribute("data-tab")),
          false);
    }
  }

  setActiveTab(tab) {
    let active_elems = this.querySelectorAll("[data-tab].active");
    for (let i = 0; i < active_elems.length; ++i) {
      active_elems[i].classList.remove("active");
    }

    let tab_elems = this.querySelectorAll("[data-tab='" + tab + "']");
    for (let i = 0; i < tab_elems.length; ++i) {
      tab_elems[i].classList.add("active");
    }
  }
}

customElements.define("z-tabbable", zTabbable);
