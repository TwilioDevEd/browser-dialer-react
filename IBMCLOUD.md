# IBM Cloud Browser Dialer
Dial any number you'd like with Twilio's Programmable Video in the browser!

## Usage

1. In IBM Cloud, set up a new Twilio service.
2. Enter your Account SID and Auth Token from [the Twilio Console](https://twiliocom/console)
3. Clone this repository and branch
4. Login to IBM Cloud (ensure you have the [CLI installed](https://console.bluemix.net/docs/starters/install_cli.html)):
```
bluemix api https://api.ng.bluemix.net
bluemix login
```
5. Create a New IBM Cloud Video app, naming it something memorable
6. Navigate to the [TwiML App Section](https://www.twilio.com/console/voice/dev-tools/twiml-apps) of the console and create a new app.  In the 'Voice' url use the IBM Cloud url (https) version with `/voice` appended to the path.  Copy the App Sid.
7. Copy a voice capable phone number from your Twilio inventory.
8. Back in IBM Cloud, integrate the Twilio service with the new Voice app.
9. Add two new environment variables from the above steps to the app in Cloud:
```
TWILIO_TWIML_APP_SID
TWILIO_NUMBER
```
10. Visit <URL of Cloud App>
11. Call a number you control from the app
12. Talk to yourself!

## Meta & Licensing

* Lovingly crafted by [Twilio Developer Education](https://www.twilio.com/docs)
* MIT License