const myNumber = 5;

document.addEventListener("DOMContentLoaded", function () {
    const myOptionText = document.getElementById("myOption");
    myOptionText.textContent = myOptionText.textContent + myNumber;

    const table = document.getElementById("myTable");
    const tbody = document.createElement("tbody");

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement("td");
            cell.textContent = i * 6 + j + 1;
            cell.className = "cell";
            cell.id = "cell" + (i * 6 + j + 1);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    const colorPicker = document.getElementById("colorPicker");

    const cells = document.querySelectorAll(".cell");
    const specialCell = document.getElementById("cell" + myNumber);

    specialCell.addEventListener("mouseover", function () {
        specialCell.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    });

    specialCell.addEventListener("click", function () {
        specialCell.style.backgroundColor = colorPicker.value;
    });

    specialCell.addEventListener("dblclick", function () {
        cells.forEach(function (cell) {
            if (cell !== specialCell) {
                cell.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            }
        });
    });

    const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", function () {
        cells.forEach(function (cell) {
            cell.style.backgroundColor = "#ffffff";
        });
    });
});
