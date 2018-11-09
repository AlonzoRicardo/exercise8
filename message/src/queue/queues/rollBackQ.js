const kue = require("kue");
let queue = kue.createQueue();

module.exports = function(messageParams) {
  let job3 = queue
    .create("rollBack", {
      jobWithAproval: messageParams
    })
    .ttl(6000)
    .save(function(err) {
      if (!err) console.log('saved in queue job: ', job3.id, job3.type);
    });
};


