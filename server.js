
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();
var doT = require('express-dot');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'dot' );
app.engine('html', doT.__express );


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// app.use("/", express.static(__dirname + '/'));

app.listen(80);