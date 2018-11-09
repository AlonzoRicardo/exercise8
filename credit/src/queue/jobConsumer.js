const kue = require("kue");
const Message = require("../models/message");
const getCredit = require("../clients/getCredit");
const updateCreditTransaction = require("../transactions/updateCredit");
const addToQ = require("./addToQ");
let queue = kue.createQueue();


function cb(_result, error) {
  if (error) {
    console.log(error);
  }
}


function checkBalance(job, done) {
  return getCredit().then(result => {
    current_credit = result[0].amount;
    if (current_credit > 0) {
      //console.log(current_credit);
      //console.log(job.data);
      return true;
    } else {
      return false;
    }
  });
}


function decreaseBalance(job, enoughBalance) {
  const MessageModel = Message();
  let message = new MessageModel(job.data.messObj);
  return updateCreditTransaction(
    {
      amount: { $gte: 1 },
      location: message.location.name
    },
    {
      $inc: { amount: -message.location.cost }
    },
    function(doc, error) {
      if (error) {
        return cb(undefined, error);
      } else if (doc == undefined) {
        let error = "Not enough credit";
        console.log(error);
        cb(undefined, error);
      } else {
        addToQ(job, enoughBalance);
        //post save and send message job
        //saveMessageTransaction(messageParams, cb);
      }
    }
  );
}


queue.process("msg", function(job, done) {
  let promise = Promise.resolve(checkBalance(job, done));
  promise
    .then(response => {
      if (response) decreaseBalance(job, response);
      done();
    })
    .catch(err => {
      console.log(err);
    });
});
