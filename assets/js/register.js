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

    $('#btnRegister').click(function () {
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
                success: function (response) {
                    // check that an account with the username does not exist 
                    if (response == null) {
                        // save credentials into db 
                        let userData = { "password": password };
                        $.ajax({
                            type: "PUT",
                            url: "https://moneytracker-dd7ff-default-rtdb.firebaseio.com/users/" + username + ".json",
                            data: JSON.stringify(userData),
                            success: function (data) {
                                alert("Registered successfully. Redirecting to login page.");
                                // redirect to login page
                                window.location.replace("./login.html");
                            },
                            error: function (error) {
                                let msgContainer = document.getElementById("msgContainer");
                                msgContainer.style.display = "flex";
                                document.getElementById("msg").innerHTML = "Something went wrong, please try again.";
                            }
                        });
                    } else {
                        let msgContainer = document.getElementById("msgContainer");
                        msgContainer.style.display = "flex";
                        document.getElementById("msg").innerHTML = "Username has been taken";
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
