const kue = require("kue");
const uuidv4 = require("uuid/v4");
let queue = kue.createQueue();

module.exports = function(req, res) {
  let uniqueId = uuidv4();
  let messObj = req.body;
  messObj.uuid = uniqueId;
  let job = queue
    .create("new message", {
      messObj
    })
    .ttl(6000)
    .save(function(err) {
      if (!err) res.send(`MessageId: ${job.data.messObj.uuid}`);
    });
};

queue.on("job enqueue", function(id, type) {
  console.log("Job %s got queued of type %s", id, type);
});
