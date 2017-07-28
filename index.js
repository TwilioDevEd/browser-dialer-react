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
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var local_creds = env['user-provided'][0].credentials;
    var accountSid = local_creds.twilio_account_sid;
    var authToken = local_creds.twilio_auth_token;
    var twilioAppSid = local_creds.twilio_twiml_app_sid;
    var twilioPhoneNumber = local_creds.twilio_number;
} else {
    var accountSid = process.env.TWILIO_ACCOUNT_SID;
    var authToken = process.env.TWILIO_AUTH_TOKEN;
    var twilioAppSid = process.env.TWILIO_TWIML_APP_SID;
    var twilioPhoneNumber = process.env.TWILIO_NUMBER;
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
