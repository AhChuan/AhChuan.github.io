$(document).ready(function () {
    // checks if dark theme was enabled 
    let isEnabled = sessionStorage.getItem("darkTheme");
    if (isEnabled == "Y") {
        $('#nightModeSwitch').prop('checked', true);
        document.body.classList.toggle("dark-mode");
        document.getElementsByClassName("form-control")[0].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("form-control")[1].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("wrap-form")[0].classList.toggle("dark-mode-wrap-form");
        document.getElementsByClassName("alert-danger")[0].classList.toggle("dark-mode-msg");

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
        document.getElementsByClassName("form-control")[0].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("form-control")[1].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("wrap-form")[0].classList.toggle("dark-mode-wrap-form");
        document.getElementsByClassName("alert-danger")[0].classList.toggle("dark-mode-msg");
    });

    // get current account's username from session & display username
    let username = sessionStorage.getItem("loginUser");
    if (username != null) {
        let profilePlaceholder = document.getElementById("profile");
        profilePlaceholder.innerText = username;
        let tbUsername = document.getElementById("tbUsername");
        tbUsername.value = username;
    } else {
        alert("Access denied as user has not login. Redirecting to login page.");
        window.location.replace("./login.html");
    }

    $('#btnSave').click(function () {
        let password = document.getElementById("tbPassword").value;

        // check that password is filled in
        if (password != "") {
            document.getElementsByClassName("required-msg")[0].style.display = "none";
            let userData = { "password": password };
            $.ajax({
                type: "PUT",
                url: "https://moneytracker-dd7ff-default-rtdb.firebaseio.com/users/" + username + ".json",
                data: JSON.stringify(userData),
                success: function (response) {
                    // refresh current page
                    window.location.replace("./profile.html");
                },
                error: function (error) {
                    let msgContainer = document.getElementById("msgContainer");
                    msgContainer.style.display = "flex";
                    document.getElementById("msg").innerHTML = "Something went wrong, please try again.";
                }
            });
        } else { // if password is not filled then display its error msg 
            if (password == "") {
                document.getElementsByClassName("required-msg")[0].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[0].style.display = "none";
            }
        }

    });

});

function logout() {
    sessionStorage.removeItem("loginUser");
    window.location.replace("./login.html");
}

// display the input field to allow user to change the password
function changePassword() {
    document.getElementById("tbPassword").style.display = "flex";
    document.getElementById("btnSave").style.display = "initial";
}