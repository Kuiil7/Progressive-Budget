const total = document.querySelector("#total");
const submit = document.querySelector("#submit");
const name = document.querySelector("#name");
const amount = document.querySelector("#amount");
const button = document.querySelectorAll(".button");
const tbody = document.querySelector("#tbody");
let transactions = [];
let myChart;
let totalCurrentAmount = 0;

window.addEventListener("load", function () {
    fetch("/transactions", {
        method: "GET"
    })
        .then(data => data.json())
        .then(response => {
            transactions = response;

            transactions.forEach(element => {
                totalCurrentAmount += parseInt(element.value)
                const tr = document.createElement("tr");
                tr.innerHTML = `
                  <td>${element.name}</td>
                  <td>${element.value}</td>
                `;

                tbody.appendChild(tr);
            })
            total.innerHTML = totalCurrentAmount;
            populateChart();
        })
})

function populateChart() {
    // copy array and reverse it
    const reversed = transactions.slice().reverse();
    let sum = 0;

    // create date labels for chart
    const labels = reversed.map(t => {
        const date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    // create incremental values for chart
    const data = reversed.map(t => {
        sum += parseInt(t.value);
        return sum;
    });

    // remove old chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById("my-chart").getContext("2d");

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Total Over Time",
                    fill: true,
                    backgroundColor: "#6666ff",
                    data
                }
            ]
        }
    });
}

function fetchInsert(name, amount) {
    const data = {
        name: name,
        value: amount,
        date: new Date().toLocaleString("en-US")
    }
    transactions.unshift(data)
    fetch("/insertTransaction", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    }).then(response => {

    }).catch(err => {
        saveRecord(data)
    })
}
button.forEach(element => {
    element.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const currentTotal = parseInt(total.innerHTML);
        const currentName = name.value;
        let currentAmount = parseInt(amount.value);
        if (currentAmount === "" || currentName === "") {
            alert("Please fill out all the fields");
            return
        }
        if (id === "add") {
            fetchInsert(currentName, currentAmount);
            total.innerHTML = currentTotal + currentAmount;
        } else {
            fetchInsert(currentName, (currentAmount * -1));
            currentAmount = currentAmount * -1;
            total.innerHTML = currentTotal - currentAmount;
        }

        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const td2 = document.createElement("td");
        td.append(currentName);
        td2.append(currentAmount);
        tr.append(td);
        tr.append(td2);
        tbody.prepend(tr);

        name.value = "";
        amount.value = "";

        populateChart();
    })
})
