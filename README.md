# zui

zui is a small HTML5 web components library that helps building websites fast.
It consits of components that are reusable UI elements.

## Example

    <z-dropdown>
      <z-dropdown-items>
        <z-dropdown-item data-value='en'>EN</z-dropdown-item>
        <z-dropdown-item data-value='de'>DE</z-dropdown-item>
        <z-dropdown-item data-value='nl'>NL</z-dropdown-item>
      </z-dropdown-items>
    </z-dropdown>


    var dropdown = document.querySelector('z-dropdown');
    dropdown.addEventListener('change', function(e) {
      var new_value = this.getValue();
    });

