"use strict";
const AlexaAppServer = require('alexa-app-server');
const express = require('express');
const bodyParser = require('body-parser');
var Alexa = require('alexa-sdk');

// var Skill_name = "Confident_builder";


// var welcomeList = [
// "Today weather report in chennai is 33 C ",
// "hi have a good day. Today monsoon looks cool"
// ];

var app = express();


// var server = new AlexaAppServer({
//     httpsEnabled: false,
//     port: process.env.PORT || 80
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
// --------------- Functions that control the skill's behavior -----------------------


function getWeatherReport(intent, session, callback) {
    const sessionAttributes = {};
    const cardTitle = 'Weather Forecast';
    const speechOutput = 'Todays monsoon in chennai is 33F.';
    const repromptText = 'Todays monsoon in chennai is 33F.';
    const shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the Alexa Weather Forecasting. ' +
        'Would you want to know about the weather report';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Welcome to the Alexa Weather Forecasting, ' +
        'Would you want to know about todays Monsoon';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Weather Forecasting. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'WelcomeIntent') {
        getWeatherReport(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}




app.post('/hook', function (req, res) {

    function callback(error, response) {
        res.json(response);
        return true;
    }
    console.log(callback);

    let event = req.body;
    console.log(event);

    if (event.session.new) {
        onSessionStarted({
            requestId: event.request.requestId
        }, event.session);
    }

    if (event.request.type === 'LaunchRequest') {
        onLaunch(event.request,
            event.session,
            (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
    } else if (event.request.type === 'IntentRequest') {
        onIntent(event.request,
            event.session,
            (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
    } else if (event.request.type === 'SessionEndedRequest') {
        onSessionEnded(event.request, event.session);
        callback();
    }

});

app.listen((process.env.PORT || 5000), function () {
    console.log("Server listening to the port 5000");
});