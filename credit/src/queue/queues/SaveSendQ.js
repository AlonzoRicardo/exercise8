const kue = require("kue");
let queue = kue.createQueue();
const debug = require("debug")("credit:queue");

//job 2
module.exports = (job, enoughBalance) => {
  let isThereBalance = enoughBalance;
  let job2 = queue
    .create("save&send", {
      job: job.data.messObj,
      isThereBalance
    })
    .ttl(6000)
    .save(function(err) {
      debug(`queue entry number: ${job2.id}`);
    });
};
