const kue = require("kue");
let queue = require('../../../messagesIndex');
const sendMessage = require("../../controllers/sendMessage");

queue.process("save&send", function(job, done) {
    console.log('1 entra save send???');
    
    sendMessage(job.data, done)
});
