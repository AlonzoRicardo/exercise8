const kue = require("kue");
const uuidv4 = require("uuid/v4");
let queue = kue.createQueue();


module.exports = function(req, res) {
  let uniqueId = uuidv4();
  let messObj = req.body;
  messObj.uuid = uniqueId;
  let job = queue
    .create("msg", {
      messObj
    })
    .ttl(6000)
    .save(function(err) {
      if (!err) res.send(`0--> queue entry number: ${job.id}`);
    });
};

queue.on("job enqueue", function(id, type) {
  console.log("Job %s got queued of type %s", id, type);
});