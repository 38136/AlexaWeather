"use strict";
const AlexaAppServer = require('alexa-app-server');
const express = require('express');
const bodyParser = require('body-parser');

var app =express();


// var server = new AlexaAppServer({
//     httpsEnabled: false,
//     port: process.env.PORT || 80
// });

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
}));


