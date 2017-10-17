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