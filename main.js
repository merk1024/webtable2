window.onload = function() {
    loadTable();
    addSubjectColorChange();
}

document.getElementById('addRowBtn').onclick = function() {
    addRow();
}

document.getElementById('saveBtn').onclick = function() {
    saveData();
}

document.getElementById('loadBtn').onclick = function() {
    loadTable();
}

document.getElementById('clearBtn').onclick = function() {
    clearData();
}

function addRow() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    for (var i = 0; i < 4; i++) {
        var newCell = newRow.insertCell();
        newCell.contentEditable = 'true';
        if (i == 1) {
            newCell.addEventListener('input', changeColorBasedOnSubject);
        }
    }
    var actionCell = newRow.insertCell();
    actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveData() {
    var table = document.getElementById('examTable');
    var data = [];
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var rowData = [];
        for (var j = 0; j < row.cells.length - 1; j++) { // exclude action cell
            rowData.push(row.cells[j].innerText);
        }
        data.push(rowData);
    }
    localStorage.setItem('tableData', JSON.stringify(data));
}

function loadTable() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var data = JSON.parse(localStorage.getItem('tableData'));
    if (data) {
        table.innerHTML = ''; // clear existing table data
        for (var i = 0; i < data.length; i++) {
            var newRow = table.insertRow();
            for (var j = 0; j < data[i].length; j++) {
                var newCell = newRow.insertCell();
                newCell.contentEditable = 'true';
                newCell.innerText = data[i][j];
                if (j == 1) {
                    newCell.addEventListener('input', changeColorBasedOnSubject);
                    changeColorBasedOnSubject({ target: newCell });
                }
            }
            var actionCell = newRow.insertCell();
            actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';
        }
    }
}

function clearData() {
    localStorage.removeItem('tableData');
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
}

function addSubjectColorChange() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
        var subjectCell = rows[i].cells[1];
        subjectCell.addEventListener('input', changeColorBasedOnSubject);
        changeColorBasedOnSubject({ target: subjectCell });
    }
}

function changeColorBasedOnSubject(event) {
    var subject = event.target.innerText.toLowerCase();
    switch (subject) {
        case 'математика':
        case 'mathematics':
            event.target.style.backgroundColor = '#A8D1FF'; // light blue
            break;
        case 'физкультура':
        case 'physical education':
            event.target.style.backgroundColor = '#FFF5BA'; // light yellow
            break;
        case 'химия':
        case 'chemistry':
            event.target.style.backgroundColor = '#FFC2C2'; // light red
            break;
        case 'биология':
        case 'biology':
            event.target.style.backgroundColor = '#C2FFD2'; // light green
            break;
        default:
            event.target.style.backgroundColor = '#eaf6ff'; // default background
            break;
    }
}
