
class zDropdownExample {
  constructor() {

  }

  init() {
    var dropdown_items = [
      { title: "English", value: "en" },
      { title: "French", value: "fr" },
      { title: "Spanish", value: "es" }
    ]

    var dropdown = viewport.querySelector("z-dropdown");
    dropdown.setMenuItems(dropdown_items);
    dropdown.addEventListener("change", (e) => {
      console.log(e.detail);
    });
    dropdown.setValue(dropdown_items[0].value);
  }
}

class zExamples {
  constructor(viewport) {
    this.examples = [new zDropdownExample()];

  }

  init() {
    this.examples.forEach(function(example) {
      example.init();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let examples = new zExamples(document.getElementById("viewport"));
  examples.init();
});
