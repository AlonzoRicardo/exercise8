const kue = require("kue");
const getCredit = require("../clients/getCredit");
let queue = kue.createQueue();


queue.process("msg", function(job, done) {
  checkBalance(job, done);
});

function checkBalance(job, done) {
  let query = getCredit();
  query.exec(function(err, credit) {
    console.log(credit);
    current_credit = credit[0].amount;
    if (current_credit > 0) {
      console.log(current_credit);
      done();
    }
  });
}

//job 2
/* console.log("1--> creating job: charge");

let charge = 'charge this!'
let job2 = queue
  .create("charge", {
    charge
  })
  .ttl(6000)
  .save(function(err) {
    console.log(`2--> queue entry number: ${job2.id}`);
  }); 
    
    queue.process("charge", function(job2, done) {
  console.log("3--> charging message", job2.data);
}); */
