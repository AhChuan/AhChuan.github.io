$(document).ready(function () {
    // checks if dark theme was enabled 
    let isEnabled = sessionStorage.getItem("darkTheme");
    if (isEnabled == "Y") {
        document.body.classList.toggle("dark-mode");
        let wrapForms = document.getElementsByClassName("wrap-form");
        for (let i = 0; i < wrapForms.length; i++) {
            wrapForms[i].classList.toggle("dark-mode-wrap-form");
        }
        let dividers = document.getElementsByClassName("divider");
        for (let i = 0; i < dividers.length; i++) {
            dividers[i].classList.toggle("dark-mode-divider");
        }
        document.getElementsByClassName("table")[0].classList.toggle("dark-mode-table");
        document.getElementsByClassName("form-control")[0].classList.toggle("dark-mode-form-control");
        $('#nightModeSwitch').prop('checked', true);
    }

    // get current account's username from session & display username
    let username = sessionStorage.getItem("loginUser");
    if (username != null) {
        let profilePlaceholder = document.getElementById("profile");
        profilePlaceholder.innerText = username;
    } else {
        alert("Access denied as user has not login. Redirecting to login page.");
        window.location.replace("./login.html");
    }

    let currentDate = new Date;
    let transactions = [];
    // group by category then by month
    let groupedtransactions = {};
    let groupedDataForExpenditure = { "spending": [0], "income": [0] };
    // retrieve all transactions by the current user & display it 
    $.ajax({
        type: "GET",
        dataType: 'json',
        contentType: "text/plain",
        url: `https://moneytracker-dd7ff-default-rtdb.firebaseio.com//transactions.json?orderBy="username"&equalTo="` + username + `"`,
        success: function (data) {
            // check that there is data returned
            if (!jQuery.isEmptyObject(data)) {
                // convert all "date" value from string to actual date and store as another key "actualdate"
                for (key in data) {
                    let parts = data[key].date.split("-");
                    data[key]["actualdate"] = new Date(parts[0], parts[1] - 1, parts[2]);
                    transactions.push(data[key]);
                    if (data[key]["actualdate"].getFullYear() == currentDate.getFullYear()) {
                        if (groupedtransactions[data[key]["category"]] != null && groupedtransactions[data[key]["category"]][data[key]["actualdate"].getMonth().toString()] != null) {
                            groupedtransactions[data[key]["category"]][data[key]["actualdate"].getMonth().toString()]["data"].push(data[key]);
                            groupedtransactions[data[key]["category"]][data[key]["actualdate"].getMonth().toString()]["total"] += parseFloat(data[key]["amount"]);
                        } else if (groupedtransactions[data[key]["category"]] != null) {
                            groupedtransactions[data[key]["category"]][data[key]["actualdate"].getMonth().toString()] = {
                                "data": [data[key]],
                                "total": parseFloat(data[key]["amount"])
                            };
                        } else {
                            groupedtransactions[data[key]["category"]] = {}
                            groupedtransactions[data[key]["category"]][data[key]["actualdate"].getMonth().toString()] = {
                                "data": [data[key]],
                                "total": parseFloat(data[key]["amount"])
                            };
                        }
                    }
                }

                // sort transactions by its date in which its compare function returns a number 
                transactions.sort((a, b) => a.actualdate > b.actualdate ? -1 : 1);

                // display latest 5 transactions 
                // remove all the table body rows first
                $("#recentTransactionsTable tbody > tr").remove();
                let tbodyRef = document.getElementById("recentTransactionsTable").getElementsByTagName("tbody")[0];
                // Create our number formatter for amount
                var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });
                // then populate the new rows and add into the table
                for (let i = 0; i < 5; i++) {
                    let transaction = transactions[i];
                    // Insert a row at the end of table
                    var newRow = tbodyRef.insertRow(-1);

                    // Insert a cell at the end of the row
                    var categoryCell = newRow.insertCell();
                    // Append a text node to the cell
                    categoryCell.appendChild(document.createTextNode(transaction.category));

                    // Insert a cell at the end of the row
                    var dateCell = newRow.insertCell();
                    // Append a text node to the cell
                    dateCell.appendChild(document.createTextNode(transaction.date));

                    // Insert a cell at the end of the row
                    var amountCell = newRow.insertCell();

                    // Append a text node to the cell
                    amountCell.appendChild(document.createTextNode(formatter.format(transaction.amount)));
                }

                for (category in groupedtransactions) {
                    if (category != "Income") {
                        for (let i = 0; i < 11; i++) {
                            if (groupedtransactions[category][i] != null) {
                                groupedDataForExpenditure["spending"][i] += groupedtransactions[category][i]["total"];
                            } else {
                                groupedDataForExpenditure["spending"][i] = 0;
                            }
                        }
                    } else {
                        for (let i = 0; i < 11; i++) {
                            if (groupedtransactions[category][i] != null) {
                                groupedDataForExpenditure["income"][i] += groupedtransactions[category][i]["total"];
                            } else {
                                groupedDataForExpenditure["income"][i] = 0;
                            }
                        }
                    }
                }

                let balance = groupedDataForExpenditure["income"][currentDate.getMonth()] - groupedDataForExpenditure["spending"][currentDate.getMonth()];
                document.getElementById("lblBalance").innerText = formatter.format(balance);
                document.getElementById("lblSpending").innerText = formatter.format(groupedDataForExpenditure["spending"][currentDate.getMonth()]);
                document.getElementById("lblIncome").innerText = formatter.format(groupedDataForExpenditure["income"][currentDate.getMonth()]);

                if (isEnabled == "Y") {
                    populateSpendingChart(groupedtransactions, true, true);
                    populateExpenditureChart(groupedDataForExpenditure, true);
                } else {
                    populateSpendingChart(groupedtransactions, true, false);
                    populateExpenditureChart(groupedDataForExpenditure, false);
                }
            } else {
                if (isEnabled == "Y") {
                    populateSpendingChart(groupedtransactions, true, true);
                    populateExpenditureChart(groupedtransactions, true);
                } else {
                    populateSpendingChart(groupedDataForExpenditure, true, false);
                    populateExpenditureChart(groupedDataForExpenditure, false);
                }
            }
        },
        error: function (error) {
            alert("Something went wrong, please try refreshing this page.");
        }
    });

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
        let wrapForms = document.getElementsByClassName("wrap-form");
        for (let i = 0; i < wrapForms.length; i++) {
            wrapForms[i].classList.toggle("dark-mode-wrap-form");
        }
        let dividers = document.getElementsByClassName("divider");
        for (let i = 0; i < dividers.length; i++) {
            dividers[i].classList.toggle("dark-mode-divider");
        }
        document.getElementsByClassName("table")[0].classList.toggle("dark-mode-table");
        document.getElementsByClassName("form-control")[0].classList.toggle("dark-mode-form-control");

        // repopulate the chart to change the label color
        let spendingAnalyticsType = document.getElementById("ddType").value;
        if (spendingAnalyticsType == "M" && action) {
            populateSpendingChart(groupedtransactions, true, true);
        } else if (spendingAnalyticsType == "M" && !action) {
            populateSpendingChart(groupedtransactions, true, false);
        } else if (spendingAnalyticsType == "Y" && action) {
            populateSpendingChart(groupedtransactions, false, true);
        } else {
            populateSpendingChart(groupedtransactions, false, false);
        }

        if (action) {
            populateExpenditureChart(groupedDataForExpenditure, true);
        } else {
            populateExpenditureChart(groupedDataForExpenditure, false);
        }
    });

    $('#ddType').change(function () {
        // repopulate the chart to change the label color & its display values
        let spendingAnalyticsType = document.getElementById("ddType").value;
        let isDarkTheme = sessionStorage.getItem("darkTheme");
        if (spendingAnalyticsType == "M" && isDarkTheme == "Y") {
            populateSpendingChart(groupedtransactions, true, true);
        } else if (spendingAnalyticsType == "M" && isDarkTheme != "Y") {
            populateSpendingChart(groupedtransactions, true, false);
        } else if (spendingAnalyticsType == "Y" && isDarkTheme == "Y") {
            populateSpendingChart(groupedtransactions, false, true);
        } else {
            populateSpendingChart(groupedtransactions, false, false);
        }
    });
});

function logout() {
    sessionStorage.removeItem("loginUser");
    window.location.replace("./login.html");
}

function redirectToTransactionPage() {
    window.location.replace("./transaction.html");
}

function populateSpendingChart(groupedtransactions, isThisMonth, isDarkTheme) {
    let currentDate = new Date;
    let groupedData = { "data": [], "labels": [] };
    // either group by current month or by current year 
    if (isThisMonth) {
        for (category in groupedtransactions) {
            if (category != "Income" && groupedtransactions[category][currentDate.getMonth()] != null) {
                groupedData["data"].push(groupedtransactions[category][currentDate.getMonth()]["total"]);
                groupedData["labels"].push(category);
            }
        }
    } else {
        for (category in groupedtransactions) {
            if (category != "Income") {
                let totalAmount = 0;
                for (month in groupedtransactions[category]) {
                    totalAmount += groupedtransactions[category][month]["total"];
                }
                groupedData["data"].push(totalAmount);
                groupedData["labels"].push(category);
            }
        }
    }

    let spendingChartCtx = document.getElementById('spendingChart');
    let spendingChartData = {
        datasets: [{
            label: 'Amount $',
            backgroundColor: ["#202040", "#543864", "#ff6363", "#ffbd69", "#a07676", "#825959", "#8ad7c1", "#c6fced"],
            data: groupedData["data"],
            borderWidth: 0
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: groupedData["labels"]
    };
    let spendingChartOptions = {
        legend: {
            labels: {
                fontColor: "#000"
            }
        },
        maintainAspectRatio: false
    }
    if (isDarkTheme) {
        spendingChartOptions = {
            legend: {
                labels: {
                    fontColor: "#eee"
                }
            },
            maintainAspectRatio: false
        }
    }

    let spendingChart = new Chart(spendingChartCtx, {
        type: 'doughnut',
        data: spendingChartData,
        options: spendingChartOptions
    });
}

function populateExpenditureChart(groupedDataForExpenditure, isDarkTheme) {
    let expenditureChartCtx = document.getElementById('expenditureChart');
    let expenditureChartData = {
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Spending",
                backgroundColor: "#dc3546",
                data: groupedDataForExpenditure["spending"]
            }, {
                label: "Income",
                backgroundColor: "#28a745",
                data: groupedDataForExpenditure["income"]
            }
        ]
    };
    let expenditureChartOptions = {
        legend: {
            labels: {
                fontColor: "#000"
            }
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    fontColor: "#000"
                },
                ticks: {
                    fontColor: "#000"
                }
            }],
            xAxes: [{
                scaleLabel: {
                    fontColor: "#000"
                },
                ticks: {
                    fontColor: "#000"
                }
            }]
        },
        maintainAspectRatio: false
    }
    if (isDarkTheme) {
        expenditureChartOptions = {
            legend: {
                labels: {
                    fontColor: "#eee"
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        fontColor: "#eee"
                    },
                    ticks: {
                        fontColor: "#eee"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        fontColor: "#eee"
                    },
                    ticks: {
                        fontColor: "#eee"
                    }
                }]
            },
            maintainAspectRatio: false
        }
    }

    let expenditureChart = new Chart(expenditureChartCtx, {
        type: 'bar',
        data: expenditureChartData,
        options: expenditureChartOptions
    });
}