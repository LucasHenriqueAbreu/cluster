process.on('message', (data) => {
    sendEmail(data); // use twilio or something to send sms
});