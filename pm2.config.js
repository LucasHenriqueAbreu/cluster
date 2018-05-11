var pm2Config = {
    "apps": [
        {
            "name": "app",
            "script": "app.js",
            "exec_mode": "cluster_mode",
            "instances": "max"
        },
        {
            "name": "smsWorker",
            "script": "smsWorker.js",
            "instances": 1
        },
        {
            "name": "emailWorker",
            "script": "emailWorker.js",
            "instances": 1
        },
        {
            "name": "notifWorker",
            "script": "notifWorker.js",
            "instances": 1
        }
    ]
};

module.exports = pm2Config;