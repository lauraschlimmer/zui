
class zProgressBar extends HTMLElement {
  constructor() {
    super();
  }

  render() {
    let tpl = zTemplateUtil.getTemplate("z-progressbar-tpl");
    this.appendChild(tpl);
    

  }

  update(progress) {
    let progress_value = (progress * 100).toFixed() + "%"
    let bar_elem = this.querySelector(".bar");
    bar_elem.style.width = progress_value;

    var progress_elem = this.querySelector(".progress");
    progress_elem.innerHTML = progress_value;
  }

  setLabel(text) {
    let label_elem = this.querySelector(".label");
    label_elem.innerHTML = zDomUtil.escapeHTML(text);
  }
}

customElements.define("z-progressbar", zProgressBar);
