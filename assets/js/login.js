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

    $('#btnLogin').click(function () {
        let username = document.getElementById("tbUsername").value;
        let password = document.getElementById("tbPassword").value;

        // check that both username and password is filled in
        if (username != "" && password != "") {
            document.getElementsByClassName("required-msg")[0].style.display = "none";
            document.getElementsByClassName("required-msg")[1].style.display = "none";
            $.ajax({
                type: "GET",
                dataType: 'json',
                contentType: "text/plain",
                url: "https://moneytracker-dd7ff-default-rtdb.firebaseio.com/users/" + username + ".json",
                success: function (data) {
                    // user not found
                    if (data == null) {
                        let msgContainer = document.getElementById("msgContainer");
                        msgContainer.style.display = "flex";
                        document.getElementById("msg").innerHTML = "Invalid account";
                    } else {
                        // check for correct password
                        if (data.password == password) {
                            // store username and redirect to dashboard
                            sessionStorage.setItem("loginUser", username);
                            window.location.replace("./dashboard.html");
                        } else {
                            let msgContainer = document.getElementById("msgContainer");
                            msgContainer.style.display = "flex";
                            document.getElementById("msg").innerHTML = "Incorrect password";
                        }
                    }
                },
                error: function (error) {
                    let msgContainer = document.getElementById("msgContainer");
                    msgContainer.style.display = "flex";
                    document.getElementById("msg").innerHTML = "Something went wrong, please try again.";
                }
            });
        } else { // if either one or both is not filled then display its respective error msg 
            if (username == "") {
                document.getElementsByClassName("required-msg")[0].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[0].style.display = "none";
            }
            if (password == "") {
                document.getElementsByClassName("required-msg")[1].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[1].style.display = "none";
            }
        }

    });

});
