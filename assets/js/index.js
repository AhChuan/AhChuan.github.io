$(document).ready(function () {
    // checks if dark theme was enabled 
    let isEnabled = sessionStorage.getItem("darkTheme");
    if (isEnabled == "Y") {
        document.body.classList.toggle("dark-mode");
        $('#nightModeSwitch').prop('checked', true);
    }

    // listen to the on change events of the switch for night mode 
    // if checked is true then toggle to dark theme 
    // else toggle back to default theme
    $('#nightModeSwitch').change(function () {
        let action = $(this).prop('checked');
        if (action) {
            sessionStorage.setItem("darkTheme", "Y");
        } else {
            sessionStorage.setItem("darkTheme", "N");
        }
        document.body.classList.toggle("dark-mode");
    });

});
