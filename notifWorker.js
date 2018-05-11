process.on('message', (data) => {
    sendNotif(data); // use twilio or something to send sms
});