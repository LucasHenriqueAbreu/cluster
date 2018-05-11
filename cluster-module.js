var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

module.exports.create = function (options, callback) {

  if (cluster.isMaster) {
    // fork child process for notif/sms/email worker
    global.smsWorker = require('child_process').fork('./smsWorker');
    global.emailWorker = require('child_process').fork('./emailWorker');
    global.notifiWorker = require('child_process').fork('./notifWorker');

    // fork application workers
    for (var i = 0; i < numCPUs; i++) {
      var worker = cluster.fork().process;
      console.log('worker started. process id %s', worker.pid);
    }

    // if application worker gets disconnected, start new one. 
    cluster.on('disconnect', function (worker) {
      console.error('Worker disconnect: ' + worker.id);
      var newWorker = cluster.fork().process;
      console.log('Worker started. Process id %s', newWorker.pid);
    });

    cluster.on('online', function (worker) {
      console.log('New worker is online. worker: ' + worker.id);
      // master receive messages and then forward it to worker based on type.
      worker.on('message', function (message) {
        switch (message.type) {
          case 'sms':
            global.smsWorker.send(message);
            break;
          // each of these worker is listning to process.on('message')
          // and then perform relevant tasks.
          case 'email':
            global.emailWorker.send(message);
            break;
          case 'notif':
            global.notifWorker.send(message);
            break;
        }
      });
    });
  } else {
    global.smsWorker = {
      send: (message) => {
        message.type = 'sms';
        process.send(message); // send message to master
        console.log('sms Message sent from worker.');
      }
    };
    global.emailWorker = {
      send: (message) => {
        message.type = 'email';
        process.send(message); // send message to master
        console.log('email Message sent from worker.');
      }
    };

    global.notifWorker = {
      send: (message) => {
        message.type = 'notif';
        process.send(message); // send message to master
        console.log('notification Message sent from worker.');
      }
    };
    callback(cluster);
  }
};
