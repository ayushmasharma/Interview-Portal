document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadDropdownList(data['data']));

    fetch('http://localhost:5000/getAllInterviews')
    .then(response => response.json())
    .then(data => loadInterviewTable(data['data']));
    
});

function loadInterviewTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, email1, email2, startTime, endTime}) {
        
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${email1}</td>`;
        tableHtml += `<td>${email2}</td>`;
        tableHtml += `<td>${new Date(startTime).toLocaleString()}</td>`;
        tableHtml += `<td>${new Date(endTime).toLocaleString()}</td>`;
        const dataToStore = `${id},${email1},${email2}`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${dataToStore}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function loadDropdownList(data) {
    const drop1 = document.querySelector('#interviewer-name');
    const drop2 = document.querySelector('#interviewee-name');

    let dropdownHtml = "";

    data.forEach(function ({name, email_id}) {
        const dataToStore = name + '(' + email_id + ')';
        dropdownHtml += `<option value="${dataToStore}">${dataToStore}</option>`
    });

    drop1.innerHTML = dropdownHtml;
    drop2.innerHTML = dropdownHtml;
}

const submitButton = document.querySelector('#submit-btn');

submitButton.onclick = function () {
    const email1 = document.querySelector("#interviewer-name").value;
    const email2 = document.querySelector("#interviewee-name").value;
    const startTime = document.querySelector("#start-time").value;
    const endTime = document.querySelector("#end-time").value;

    if(email1 === email2) {
        alert("Interviewer and Interviewee cannot be the same person.");
        return;
    }
    if(startTime === "" || endTime === "") {
        alert("Select Date and Time");
        return;
    }
    fetch('http://localhost:5000/insertInterview', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email1: email1,
                               email2 : email2,
                               startTime : startTime,
                               endTime : endTime})
    })
    .then(response => response.json())
    .then(data => insertRowIntoInterviewTable(data['data']));
}

function insertRowIntoInterviewTable(data) {

    if(data.id === -1) {
        alert("Interviewer is not available at that time");
        return;
    }
    if(data.id === -2) {
        alert("Interviewee is not available at that time");
        return;
    }
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'startTime' || key==='endTime') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    const dataToStore = `${data.id},${data.email1},${data.email2}`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${dataToStore}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}
