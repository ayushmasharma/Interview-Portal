# Interview-Portal

This is a portal where admins can create interviews by selecting participants, interview start time and end time.

Deployment Link : https://interview-portal-2407.herokuapp.com/

## Functionalities

1. An interview creation page where the admin can create an interview by selecting participants, start time and end time. Backend throws error with proper error message if: 

  * Any of the participants is not available during the scheduled time (i.e, has another interview scheduled)
  * No of participants is less than 2

2. An interviews list page where admin can see all the upcoming interviews.

3. An interview edit page where admin can edit the created interview with the same validations as on the creation page.

4. Send emails to participants on interview creation, updation and deletion.

5. App’s frontend as a SPA


## Requirements

* NodeJS
* MySQL server on local machine

## Setup and Instructions

#### 1. Clone the Repo

On the terminal run the following commands

```sh

$ git clone https://github.com/ayushmasharma/Interview-Portal.git

$ cd server

$ npm install (to install all dependencies )

```
#### 2. Setup MySQL Database

* Create a database and name it as **interviewbit**
* Create two tables 

    1.  **users** (contains data of users) 
    2.  **interviews** (contains data of scheduled interviews)

* Insert some data in users. 
* Inserting data in **interviews** table is not required. It will get added itself when the user will schedule a new Interview.


### Sample SQL Queries

![img 4](https://user-images.githubusercontent.com/68046853/126888702-62ca3445-e8b7-4af2-a394-841c254b0ceb.jpeg)


#### 3. Run the server

```sh
cd server
nodemon app
```

This will start our server. Now, go to **/portal-frontend** and open **index.html**.


## Starting the mail services

Nodemailer is used to send the e-mails. Change the USER and PASS and set it to the credentials of the mail from which you want to send out the mails.


![img 1](https://user-images.githubusercontent.com/68046853/126888220-cb74572e-dc6c-4437-97b2-a0456e1d97c7.jpeg)

### Sample Mail 

![img 3](https://user-images.githubusercontent.com/68046853/126888334-110cde14-7bd4-454a-8932-77a688d92830.jpeg)

