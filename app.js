var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

d
var server = app.listen(3000, function(){
 console.log("Express server has started on port 3000")
});

//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'bnnland')));
// 가상디렉토리 app.use('/static', express.static('public'));
//app.use('/static', express.static(__dirname + '/public'));
//console.log(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true
}));


var router = require('./router/main')(app, fs);