const kue = require("kue");
let queue = kue.createQueue();
const sendMessage = require("../../controllers/sendMessage");

queue.process("save&send", function(job, done) {
    sendMessage(job.data, done)
});
