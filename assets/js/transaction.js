$(document).ready(function () {
    // checks if dark theme was enabled 
    let isEnabled = sessionStorage.getItem("darkTheme");
    if (isEnabled == "Y") {
        $('#nightModeSwitch').prop('checked', true);
        document.body.classList.toggle("dark-mode");
        document.getElementsByClassName("form-control")[0].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("form-control")[1].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("form-control")[2].classList.toggle("dark-mode-form-control");
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
        document.getElementsByClassName("form-control")[2].classList.toggle("dark-mode-form-control");
        document.getElementsByClassName("wrap-form")[0].classList.toggle("dark-mode-wrap-form");
        document.getElementsByClassName("alert-danger")[0].classList.toggle("dark-mode-msg");
    });

    // get current account's username from session & display username
    let username = sessionStorage.getItem("loginUser");
    if (username != null) {
        let profilePlaceholder = document.getElementById("profile");
        profilePlaceholder.innerText = username;
    } else {
        alert("Access denied as user has not login. Redirecting to login page.");
        window.location.replace("./login.html");
    }

    // prevent user from selecting future dates
    let now = new Date();
    let maxDate = now.toISOString().substring(0, 10);
    $('#tbDate').prop('max', maxDate);

    $('#btnSave').click(function () {
        let amount = document.getElementById("tbAmount").value;
        let category = document.getElementById("ddCategory").value;
        let transactionDate = document.getElementById("tbDate").value;

        // check that all fields are filled in
        if (amount != "" && category != 0 && transactionDate != "") {
            document.getElementsByClassName("required-msg")[0].style.display = "none";
            document.getElementsByClassName("required-msg")[1].style.display = "none";
            document.getElementsByClassName("required-msg")[2].style.display = "none";

            // save credentials into db 
            let transactionData = { "amount": amount, "category": category, "date": transactionDate, "username": username };
            $.ajax({
                type: "POST",
                url: "https://moneytracker-dd7ff-default-rtdb.firebaseio.com/transactions.json",
                data: JSON.stringify(transactionData),
                success: function (data) {
                    // redirect to login page
                    window.location.replace("./dashboard.html");
                },
                error: function (error) {
                    let msgContainer = document.getElementById("msgContainer");
                    msgContainer.style.display = "flex";
                    document.getElementById("msg").innerHTML = "Something went wrong, please try again.";
                }
            });

        } else { // if any of the field is not filled then display its respective error msg 
            if (amount == "") {
                document.getElementsByClassName("required-msg")[0].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[0].style.display = "none";
            }
            if (category == "0") {
                document.getElementsByClassName("required-msg")[1].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[1].style.display = "none";
            }
            if (transactionDate == "") {
                document.getElementsByClassName("required-msg")[2].style.display = "flex";
            } else {
                document.getElementsByClassName("required-msg")[2].style.display = "none";
            }
        }

    });

});

function logout() {
    sessionStorage.removeItem("loginUser");
    window.location.replace("./login.html");
}