"use strict";

class zDropdownExample {
  constructor(elem) {
    var dropdown_items = [
      { title: "English", value: "en" },
      { title: "French", value: "fr" },
      { title: "Spanish", value: "es" }
    ]

    var dropdown = elem.querySelector("z-dropdown");
    dropdown.setMenuItems(dropdown_items);
    dropdown.addEventListener("change", (e) => {
      console.log(e.detail);
    });
    dropdown.setValue(dropdown_items[0].value);
  }
}

class zSearchExample {
  constructor(elem) {
    let countries = [
      { value: "en", title: "England" },
      { value: "fr", title: "France" },
      { value: "be", title: "Belgium" },
      { value: "nl", title: "Netherlands" },
      { value: "pl", title: "Poland" },
      { value: "ger", title: "Germany" },
      { value: "es", title: "Spain" },
      { value: "it", title: "Italy" },
      { value: "grc", title: "Greece" },
      { value: "prt", title: "Portugal" },
      { value: "es", title: "Spain" },
      { value: "uk", title: "United Kingdom" },
      { value: "dk", title: "Denmark" },
      { value: "swe", title: "Sweden" },
      { value: "fin", title: "Finland" }
    ];

    let search = elem.querySelector("z-search");
    search.init({autocomplete: {min_length: 1}});
    search.setPlaceholder("Search countries...");

    search.addEventListener("autocomplete", (e) => {
      let value = e.detail.value.toLowerCase();
      let c = countries.filter(function(country) {
        return (country.title.toLowerCase().indexOf(value) >= 0)
      });
      search.autocomplete(e.detail.value, c);
    });

    search.addEventListener("change", (e) => {
      console.log("detail", e.detail);
    });
  }
}

class zTabbableExample {
  constructor(elem) {
    let tabbable = elem.querySelector("z-tabbable");
    tabbable.init();
    tabbable.setActiveTab(1);
  }
}

class zExamples {
  constructor(vport) {
    this.examples = [
        new zDropdownExample(vport),
        new zSearchExample(vport),
        new zTabbableExample(vport)
    ];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let examples = new zExamples(document.getElementById("viewport"));
});
