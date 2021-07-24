const express = require('express');
const app = express();
const cors = require('cors');
const dbService = require('./sql_db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// Get data of the user 
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Get data of all the interviews
app.get('/getAllInterviews', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllInterviewData();    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

// Inserting information of new interview
app.post('/insertInterview', (request, response) => {
    const { email1, email2, endTime, startTime } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertInterview(email1, email2, startTime, endTime);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.listen(5000, () => console.log('portal is running'));