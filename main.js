window.onload = function() {
    loadTable();
    addSubjectColorChange();
    updateRowColors();
    generateRecommendations();
}

document.getElementById('addRowBtn').onclick = function() {
    addRow();
    generateRecommendations();
}

document.getElementById('saveBtn').onclick = function() {
    saveData();
}

document.getElementById('loadBtn').onclick = function() {
    loadTable();
}

document.getElementById('clearBtn').onclick = function() {
    clearData();
    generateRecommendations();
}

function addRow() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    
    var classCell = newRow.insertCell();
    classCell.contentEditable = 'true';
    
    var subjectCell = newRow.insertCell();
    var subjectSelect = document.createElement('select');
    subjectSelect.classList.add('subjectSelect');
    subjectSelect.innerHTML = `
        <option value="mathematics">Mathematics</option>
        <option value="physical education">Physical Education</option>
        <option value="chemistry">Chemistry</option>
        <option value="biology">Biology</option>
    `;
    subjectSelect.addEventListener('change', changeColorBasedOnSubject);
    subjectCell.appendChild(subjectSelect);

    var dateCell = newRow.insertCell();
    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.classList.add('dateInput');
    dateInput.addEventListener('input', updateRowColors);
    dateCell.appendChild(dateInput);

    var timeCell = newRow.insertCell();
    var timeSelect = document.createElement('select');
    timeSelect.classList.add('timeSelect');
    timeSelect.innerHTML = `
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="12:00">12:00</option>
        <option value="13:00">13:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
    `;
    timeCell.appendChild(timeSelect);

    var roomCell = newRow.insertCell();
    roomCell.contentEditable = 'true';

    var actionCell = newRow.insertCell();
    actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    generateRecommendations();
}

function saveData() {
    var table = document.getElementById('examTable');
    var data = [];
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var rowData = [];
        rowData.push(row.cells[0].innerText);
        rowData.push(row.cells[1].querySelector('select').value);
        rowData.push(row.cells[2].querySelector('input').value);
        rowData.push(row.cells[3].querySelector('select').value);
        rowData.push(row.cells[4].innerText);
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

            var classCell = newRow.insertCell();
            classCell.contentEditable = 'true';
            classCell.innerText = data[i][0];
            
            var subjectCell = newRow.insertCell();
            var subjectSelect = document.createElement('select');
            subjectSelect.classList.add('subjectSelect');
            subjectSelect.innerHTML = `
                <option value="mathematics">Mathematics</option>
                <option value="physical education">Physical Education</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
            `;
            subjectSelect.value = data[i][1];
            subjectSelect.addEventListener('change', changeColorBasedOnSubject);
            subjectCell.appendChild(subjectSelect);

            var dateCell = newRow.insertCell();
            var dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.classList.add('dateInput');
            dateInput.value = data[i][2];
            dateInput.addEventListener('input', updateRowColors);
            dateCell.appendChild(dateInput);

            var timeCell = newRow.insertCell();
            var timeSelect = document.createElement('select');
            timeSelect.classList.add('timeSelect');
            timeSelect.innerHTML = `
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
            `;
            timeSelect.value = data[i][3];
            timeCell.appendChild(timeSelect);

            var roomCell = newRow.insertCell();
            roomCell.contentEditable = 'true';
            roomCell.innerText = data[i][4];

            var actionCell = newRow.insertCell();
            actionCell.innerHTML = '<button onclick="deleteRow(this)">Delete</button>';
        }
    }
    addSubjectColorChange();
    updateRowColors();
    generateRecommendations();
}

function clearData() {
    localStorage.removeItem('tableData');
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
}

function changeColorBasedOnSubject(event) {
    var subject = event.target.value.toLowerCase();
    var row = event.target.parentNode.parentNode;
    if (subject === 'mathematics') {
        row.style.backgroundColor = '#B0E0E6'; // Pale Blue
    } else if (subject === 'physical education') {
        row.style.backgroundColor = '#FFD700'; // Gold
    } else if (subject === 'chemistry') {
        row.style.backgroundColor = '#98FB98'; // Pale Green
    } else if (subject === 'biology') {
        row.style.backgroundColor = '#FFB6C1'; // Light Pink
    } else {
        row.style.backgroundColor = ''; // Default
    }
}

function addSubjectColorChange() {
    var selects = document.getElementsByClassName('subjectSelect');
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', changeColorBasedOnSubject);
        changeColorBasedOnSubject({target: selects[i]});
    }
}

function updateRowColors() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var rows = table.rows;
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    for (var i = 0; i < rows.length; i++) {
        var examDate = new Date(rows[i].cells[2].querySelector('input').value);
        var timeDiff = examDate.getTime() - today.getTime();
        var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (dayDiff === 0) {
            rows[i].style.backgroundColor = '#FFB3B3'; // Red for today
        } else if (dayDiff === 1) {
            rows[i].style.backgroundColor = '#FFF5BA'; // Yellow for tomorrow
        } else if (dayDiff === 2) {
            rows[i].style.backgroundColor = '#C2FFD2'; // Green for the day after tomorrow
        } else {
            rows[i].style.backgroundColor = ''; // Default background
        }
    }
}

function generateRecommendations() {
    var table = document.getElementById('examTable').getElementsByTagName('tbody')[0];
    var rows = table.rows;
    var subjectCount = {};

    for (var i = 0; i < rows.length; i++) {
        var subject = rows[i].cells[1].querySelector('select').value.toLowerCase();
        if (!subjectCount[subject]) {
            subjectCount[subject] = 0;
        }
        subjectCount[subject]++;
    }

    var recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = '';

    for (var subject in subjectCount) {
        var recommendation = document.createElement('p');
        recommendation.innerText = `You have scheduled ${subjectCount[subject]} exams for ${subject}.`;
        recommendations.appendChild(recommendation);
    }
}
