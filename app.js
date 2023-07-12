var express = require('express');
var path = require('path');
var app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { allowedNodeEnvironmentFlags } = require('process');

const PORT = 3000;

app.set('views', path.join(__dirname, 'views')); 

app.set('view engine', 'ejs'); 


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const day = 1000*60*60*2;
app.use(sessions({
  secret: 'some secret',    // key that will sign the cookie
  resave: false,            // for every request to the server we want to create a new session
  cookie: {maxAge: day},  // duration of existance of the session
  saveUninitialized:false
}))
app.use(cookieParser());


var places = [];
places.push("Annapurna Circuit");
places.push("Bali Island");
places.push("Inca Trail to Machu Picchu");
places.push("Paris");
places.push("Rome");
places.push("Santorini Island");

// Main page view
app.get('/', function(req, res)
{
  res.render('login',{message:""});
});

app.post('/login', function(req, res)
{
  var username = req.body.username;
  var password = req.body.password;
  

  if (username.length === 0)
  {
    res.render('login',{message: "Username can not be empty!"});
  }

  else if (password.length === 0)
  {
    res.render('login',{message: "Password can not be empty!"});
  }

  else {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017",function(err, client)
    {
      if (err)  throw err;
      var db = client.db('myDB');
      var query = {username: username};
      
      db.collection('myCollection').find(query).toArray().then(function(array){
        var obj = array[0];
          
        if (obj != undefined && obj.length != 0 && obj.password === password)
        {
          // After succesful registration, user then redirected to the login page
          req.session.username = obj.username;
          res.render('home');
        }
        else
        {
          res.render('login',{message: "Username or Password is incorrect!"});
        }      
      });  
    });
  }
});

// Registration page view
app.get('/registration', function(req, res)
{
  
  res.render('registration',{message:""});
  
});

app.post('/register', function(req, res)
{
  var username = req.body.username;
  var password = req.body.password;

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    var query = {username: username};
    var obj =  db.collection('myCollection').find(query).toArray((err, req) => {
       
      if (req.length === 0)
      {
        if (username.length === 0)
        {
          res.render('registration',{message: "Username can not be empty!"})
        } 
        else if (password.length === 0)
        {
          res.render('registration',{message: "Password can not be empty!"})
        }
        else
        {
          db.collection('FirstCollection').insertOne({username: username, password: password, list:[]});
          // After succesful registration, user then redirected to the login page
          res.render('login',{message: "Registration successfully !"});

        } 
      }
      else
      {
        res.render('registration',{message: "Username already exist"});
      }      
    });
  });
})

app.post('/search',function(req,res){
  var data0 = "";
  var data1 = "";
  var data2 = "";
  var data3 = "";
  var data4 = "";
  var data5 = "";
  var data6 = "";
  var substring = req.body.Search+"";
  
  if(substring==""){
    data0="Destination not Found";
    res.render('searchresults',
    {error: data0 , annapurna: data1 , bali: data2 , inca: data3 , paris: data4 , rome: data5 , santorini: data6});
  }
  else
  {
  if(places[0].toLowerCase().includes(substring.toLowerCase())){data1="Annapurna Circuit"}
  if(places[1].toLowerCase().includes(substring.toLowerCase())){data2="Bali Island"}
  if(places[2].toLowerCase().includes(substring.toLowerCase())){data3="Inca Trail to Machu Picchu"}
  if(places[3].toLowerCase().includes(substring.toLowerCase())){data4="Paris"}
  if(places[4].toLowerCase().includes(substring.toLowerCase())){data5="Rome"}
  if(places[5].toLowerCase().includes(substring.toLowerCase())){data6="Santorini Island"}
  if(data1=="" && data2=="" && data3=="" && data4=="" && data5=="" && data6==""){data0="Destination not Found"};
  res.render('searchresults',
  {error: data0 , annapurna: data1 , bali: data2 , inca: data3 , paris: data4 , rome: data5 , santorini: data6});
}

});

// Want to go view
app.get('/wanttogo', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else{
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};

    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var d1 = "";
      var d2 = "";
      var d3 = "";
      var d4 = "";
      var d5 = "";
      var d6 = "";
      
    obj.forEach(element => {
      if(d1 == ""){
        d1=element;
      }else
      if(d2 == ""){
        d2=element;
      }else
      if(d3 == ""){
        d3=element;
      }else
      if(d4 == ""){
        d4=element;
      }else
      if(d5 == ""){
        d5=element;
      }else
      if(d6 == ""){
        d6=element;
      }
      
         
      
    });
    res.render('wanttogo',{dest1:d1,dest2:d2,dest3:d3,dest4:d4,dest5:d5,dest6:d6});
    
  
     
    });
  });
}  
})



// Santoini view
app.get('/santorini', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('santorini',{message:""});
  }
})

app.post('/santorini', function(req, res){

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};

    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var found = false;
     // console.log(obj);
      
      obj.forEach(element => {
        if(element == 'santorini')
        {
            found = true;
        }
      });
  
      if (found == true)
      {
        // the destination already exists in the want to go lists 
        res.render('santorini',{message:"Destination already exist in the Want to go list"});
      }
      else
      {
        db.collection('FirstCollection').updateOne(query, {$push: {list:'santorini'}});
        res.render('santorini',{message:"Destination added to the Want to go list successfully"});
      }
    });
  });
})

// Rome view
app.get('/rome', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('rome',{message:""});
  }
})

app.post('/rome', function(req, res){

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};

    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var found = false;
      //console.log(obj);
      
      obj.forEach(element => {
        if(element == 'rome')
        {
            found = true;
        }
      });
  
      if (found == true)
      {
        // the destination already exists in the want to go lists 
        res.render('rome',{message:"Destination already exist in the Want to go list"});
      }
      else
      {
        db.collection('FirstCollection').updateOne(query, {$push: {list:'rome'}});
        res.render('rome',{message:"Destination added to the Want to go list successfully"});
      }
    });
  });
})

// Paris view
app.get('/paris', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('paris',{message:""});
  }
})

app.post('/paris', function(req, res){

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};

    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var found = false;
      //console.log(obj);
      
      obj.forEach(element => {
        if(element == 'paris')
        {
            found = true;
        }
      });
  
      if (found == true)
      {
        // the destination already exists in the want to go lists 
        res.render('paris',{message:"Destination already exist in the Want to go list"});
      }
      else
      {
        db.collection('FirstCollection').updateOne(query, {$push: {list:'paris'}});
        res.render('paris',{message:"Destination added to the Want to go list successfully"});

      }
    });
  });
})

// Islands view
app.get('/islands', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('islands');
  }
})

// Inca view
app.get('/inca', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('inca',{message:""});
  }
})

app.post('/inca', function(req,res){
  
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};
    
    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var found = false;
      //console.log(obj);
      
      obj.forEach(element => {
        if(element == 'inca')
        {
            found = true;
        }
      });
  
      if (found == true)
      {
        // the destination already exists in the want to go lists 
        res.render('inca',{message:"Destination already exist in the Want to go list"});
      }
      else
      {
        db.collection('FirstCollection').updateOne(query, {$push: {list:'inca'}});
        res.render('inca',{message:"Destination added to the Want to go list successfully"});

      }
    });
  });
})

// Home view
app.get('/home', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
  res.render('home');
  }
})

// Hiking view
app.get('/hiking', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('hiking');
  }
})

// Cities view
app.get('/cities', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('cities');
  }
})

// Bali view
app.get('/bali', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('bali',{message:""});
  }
})

app.post('/bali', function(req, res){

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    // 1. check the request is from which user in the database 
    var query = {username: req.session.username};
    
    db.collection('myCollection').find(query).toArray().then(function(array){
      var obj = array[0].list;
      var found = false;
     // console.log(obj);
      
      obj.forEach(element => {
        if(element == 'bali')
        {
            found = true;
        }
      });
  
      if (found == true)
      {
        // the destination already exists in the want to go lists 
        res.render('bali',{message:"Destination already exist in the Want to go list"});
      }
      else
      {
        db.collection('FirstCollection').updateOne(query, {$push: {list:'bali'}});
        res.render('bali',{message:"Destination added to the Want to go list successfully"});

      }
    })
  });
})

// Annapurna view
app.get('/annapurna', function(req, res){
  if(req.session.username == undefined){
    res.render('login',{message:""});
  }
  else
  {
    res.render('annapurna',{message:""});
  }
})

app.post('/annapurna', function(req, res){

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost:27017",function(err, client)
  {
    if (err)  throw err;
    var db = client.db('myDB');
    var query = {username: req.session.username};
    
  db.collection('myCollection').find(query).toArray().then(function(array){
    var obj = array[0].list;
    var found = false;
   // console.log(obj);

    obj.forEach(element => {
      if(element == 'annapurna')
      {
          found = true;
      }
    });

    if (found == true)
    {
      // the destination already exists in the want to go lists 
      res.render('annapurna',{message:"Destination already exist in the Want to go list"});
    }
    else
    {
      db.collection('FirstCollection').updateOne(query, {$push: {list:'annapurna'}});
      res.render('annapurna',{message:"Destination added to the Want to go list successfully"});

    }
  }); 
  });
})

// App Listen 
app.listen(PORT);