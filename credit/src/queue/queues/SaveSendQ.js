const kue = require("kue");
let queue = kue.createQueue();

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
      console.log(`queue entry number: ${job2.id}`);
      console.log(job2.data);
    });
};
