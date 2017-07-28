'use strict';

require('dotenv').load();
const http = require('http');
const express = require('express');
const {urlencoded} = require('body-parser');
const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

// Retreive Twilio Credentials
if (process.env.VCAP_SERVICES) {
    let env = JSON.parse(process.env.VCAP_SERVICES);
    let localCreds = env['user-provided'][0].credentials;
    let accountSid = localCreds.twilio_account_sid;
    let authToken = localCreds.twilio_auth_token;
    let twilioAppSid = localCreds.twilio_twiml_app_sid;
    let twilioPhoneNumber = localCreds.twilio_number;
} else {
    let accountSid = process.env.TWILIO_ACCOUNT_SID;
    let authToken = process.env.TWILIO_AUTH_TOKEN;
    let twilioAppSid = process.env.TWILIO_TWIML_APP_SID;
    let twilioPhoneNumber = process.env.TWILIO_NUMBER;
}

let port = process.env.PORT || 3000;

let app = express();
app.use(express.static(__dirname + '/public'));
app.use(urlencoded({extended: false}));

// Generate a Twilio Client capability token
app.get('/token', (request, response) => {
  const capability = new ClientCapability({
    accountSid: accountSid,
    authToken: authToken,
  });

  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: twilioAppSid})
  );

  const token = capability.toJwt();

  // Include token in a JSON response
  response.send({
    token: token,
  });
});

// Create TwiML for outbound calls
app.post('/voice', (request, response) => {
  let voiceResponse = new VoiceResponse();
  voiceResponse.dial({
    callerId: twilioPhoneNumber,
  }, request.body.number);
  response.type('text/xml');
  response.send(voiceResponse.toString());
});

let server = http.createServer(app);
server.listen(port, () => {
  console.log(`Express Server listening on *:${port}`);
});

module.exports = app;
