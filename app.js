var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var session = require('express-session');
var fs = require("fs")

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'bnnland')));
// 가상디렉토리 app.use('/static', express.static('public'));
//app.use('/static', express.static(__dirname + '/public'));
console.log('디렉토리 경로:'+__dirname);


app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://banana:bananamongo@localhost/mongodb_tutorial?authSource=admin');
// DEFINE MODEL
var Book = require('./models/book');
var Gamst = require('./models/gamst');
// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// [CONFIGURE ROUTER]
var router = require('./router/main')(app, fs, Book, Gamst);
// [RUN SERVER]
var server = app.listen(3000, function(){
 console.log("Express server has started on port 3000")
});