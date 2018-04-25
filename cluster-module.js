'use-strict';

var cluster = require('cluster');
const numCPUs = require('os').cpus().length;

module.exports.create = function(options, callback){
  
  if (cluster.isMaster) {
    // fork child process for notif/sms/email worker
    global.smsWorker    = require('child_process').fork('./smsWorker');
    global.emailWorker  = require('child_process').fork('./emailWorker');
    global.notifiWorker = require('child_process').fork('./notifWorker');

    // fork application workers
    for (var i = 0; i < numCPUs; i++) {
      var worker = cluster.fork().process;
      console.log('worker started. process id %s', worker.pid);
    }
  } else {
    callback(cluster);
  }
};