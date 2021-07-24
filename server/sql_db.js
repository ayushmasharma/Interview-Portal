const mysql = require('mysql');
let instance = null;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'InterviewBit',
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

// converting the date and time to required form
convertDateTime = (datetime) => {
    datetime = datetime.split(' ');
    date = datetime[0].split('/');
    time = datetime[1].split(':');
    mer = datetime[2];
    if (mer == 'PM') {
        if(time[0] !== '12') {
            hh = parseInt(time[0]);
            hh+=12;
            time[0] = hh.toString();
        } 
    }
    else {
        if(time[0]==='12') {
            time[0]='00';
        }
    }
    sqlDate = "";
    sqlDate += date[2] + '-' + date[0] + '-' + date[1] + ' ' + time[0] + ':' + time[1];
    return sqlDate;
}


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // dropdown list with users information from the database
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    
    // scheduled interviews table load
    async getAllInterviewData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM interviews;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    //Check for availability of the participant
    async checkAvailability(email, start, end, id = -1) {
        try {
            const check1 = await new Promise((resolve, reject) => {
                const query = "SELECT (SELECT COUNT(*) FROM interviews WHERE email1 = ? and id != ?) - \
                                      (SELECT COUNT(*) FROM interviews WHERE email1 = ? and id != ? and (startTime > ? or endTime < ?)) \
                                      as CNT";
                connection.query(query, [email, id, email, id, end, start] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result[0].CNT);
                })
            });
            const check2 = await new Promise((resolve, reject) => {
                const query = "SELECT (SELECT COUNT(*) FROM interviews WHERE email2 = ? and id != ?) - \
                                      (SELECT COUNT(*) FROM interviews WHERE email2 = ? and id != ? and (startTime > ? or endTime < ?)) \
                                      as CNT";
                connection.query(query, [email, id, email, id, end, start] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result[0].CNT);
                })
            });
            return (check1>0 || check2>0);
        } catch(error) {
            console.log(error);
        }
    }

    // Inserting a new interview
    async insertInterview(email1, email2, startTime, endTime) {
        try {
            const start = convertDateTime(startTime);
            const end = convertDateTime(endTime);
            const check1 = await this.checkAvailability(email1,start,end);
            const check2 = await this.checkAvailability(email2,start, end);
            if(check1 > 0) {
                console.log("Interviewer is not available at that time");
                return {
                    id: -1
                };
            }
            else if(check2 > 0) {
                console.log("Interviewee is not available at that time");
                return {
                    id: -2
                };
            }
            else {

                const insertId = await new Promise((resolve, reject) => {
                    const query = "INSERT INTO interviews (email1, email2, startTime, endTime) VALUES (?,?,?,?);";

                    connection.query(query, [email1, email2, start, end] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId);
                    })
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;