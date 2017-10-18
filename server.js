var mysql = require('mysql');
var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.listen(3030, function () {
  console.log('Express server is online on port 3030!')
})

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tvattApp'
});

connection.connect(function(err) {
  console.log(err);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/GetUsers', function(req,res){
  connection.query('SELECT * FROM Users', 
  function(error,result)
  {
    res.send({users: result});
  });
});

app.post('/LogInUser', function(req, res) {
  var user = {username: req.body.username, password: req.body.password};
  
  connection.query('SELECT Id,Email FROM Users WHERE Email = ' + "'" + user.username + "' AND Password = '" + user.password + "'", 
  function(error, result){
    if (result == 0)
    {
      res.send({userId: 0});
    }
    else
    {
      res.send({userId: result[0].Id, email: result[0].Email});
    }
  }); 
});

app.post('/ChangePassword', function(req, res) {
  var user = {userId: req.body.userId, password: req.body.password};
  
  connection.query('UPDATE Users SET Password = ' + "'" + user.password + "' WHERE id = " + user.userId, 
  function(error, result){
    if (result == 0)
    {
      res.send({satus: false});    
    }
    else
    {
      res.send({status: true});
    }
  }); 
});


app.post('/ChangeEmail', function(req, res) {
  var user = {userId: req.body.userId, email: req.body.email};
  
  connection.query('UPDATE Users SET Email = ' + "'" + user.email + "' WHERE id = " + user.userId, 
  function(error, result){
    if (result == 0)
    {
      res.send({satus: false});
    }
    else
    {
      res.send({status: true});
    }
  }); 
});

app.post('/GetWashTimesForSpecificUser', function(req, res) {
  var user = {userId: req.body.userId};
  
  connection.query('SELECT Id,Starttime,Endtime,Description FROM WashTime WHERE UserId = ' + "'" + user.userId +  "'", 
  function(error, result){
    if (result == 0)
    {
      res.send({result: false});
    }
    else
    {
      res.send({result: result});
    }
  }); 
});

app.post('/DeleteWashTime', function(req, res) {
  var user = {washId: req.body.washId};
  
  connection.query('DELETE FROM WashTime WHERE Id = ' + user.washId,
  function(error, result){
    if (result == 0)
    {
      res.send({result: false});
    }
    else
    {
      res.send({result: true});
    }
  }); 
});

/*

app.post('/logInUser', function(req, res) {
  var user = {username: req.body.username, password: req.body.password};
  
  connection.query('SELECT id,Email,TypeOfUser FROM Användare WHERE Email = ' + "'" + user.username + "' AND Password = '" + user.password + "'", 
  function(error, result){
    if (result == 0)
    {
      res.send({userId: 0});
    }
    else
    {
      res.send({userId: result[0].id, userName: result[0].Username, email: result[0].Email, typeOfUser: result[0].TypeOfUser});
    }
  }); 
});

app.post('/removeJob', function(req, res){
  var jobToRemove = {jobId: req.body.jobId}
  connection.query('DELETE FROM JobbLista WHERE id = ' + jobToRemove.jobId,
  function(error,result){
    res.send({});
  });
});

app.post('/saveJobChanges', function(req,res){
  var jobToChange = {jobId: req.body.jobId, newJobNumber: req.body.newJobNumber, newJobName: req.body.newJobName, newJobStatus: req.body.newJobStatus}
  connection.query('UPDATE JobbLista SET butikId = ' + "'" + jobToChange.newJobNumber + "', butiksNamn = '" + jobToChange.newJobName + "', jobStatus = " + jobToChange.newJobStatus + " WHERE id = " + jobToChange.jobId,
  function(error,result){
    res.send({});
  });
});

app.post('/newJob', function(req,res){
  var jobToAdd = {userId: req.body.userId, newJobNumber: req.body.newJobNumber, newJobName: req.body.newJobName, newJobStatus: req.body.newJobStatus}
  connection.query("INSERT INTO JobbLista (userId,butikId,butiksNamn,jobStatus) VALUES ("+jobToAdd.userId+", "+ jobToAdd.newJobNumber+", '"+jobToAdd.newJobName+"', "+jobToAdd.newJobStatus+")",
  function(error,result){
    res.send({});
  });
  
});
*/