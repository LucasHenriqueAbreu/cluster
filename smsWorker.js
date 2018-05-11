process.on('message', (data) => {
    sendSMS(data); // use twilio or something to send sms
});