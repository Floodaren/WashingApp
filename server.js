var mysql = require('mysql');
var express = require('express')
var bodyParser = require('body-parser');
var moment = require('moment');
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

app.get('/GetWashTimes', function(req,res){
  connection.query('SELECT * FROM WashTime', 
  function(error,result)
  {
    res.send({washTimes: result});
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

app.post('/CreateWashTime', function(req, res) {
  var user = {userId: req.body.userId, startTime: req.body.startTime, endTime: req.body.endTime, description: req.body.description};
  connection.query('INSERT INTO WashTime (UserId,Starttime,Endtime,Description) VALUES (' + user.userId + ',"' + user.startTime + '","' + user.endTime + '","' + user.description + '")' ,
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

