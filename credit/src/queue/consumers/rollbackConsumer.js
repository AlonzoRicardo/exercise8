const kue = require("kue");
let queue = kue.createQueue();
const updateCreditTransaction = require("../../transactions/updateCredit");
const Message = require("../../models/message");

function rollBackCredit(job) {
  const MessageModel = Message();
  let message = new MessageModel(job.data.jobWithAproval);
  
  return updateCreditTransaction(
    {
      amount: { $gte: 1 },
      location: message.location.name
    },
    {
      $inc: { amount: +message.location.cost }
    },
    function(doc, error) {
      if (error) {
        return error;
      } else {
        console.log("ROLLBACK SUCCESFUL!");
      }
    }
  );
}

queue.process("rollBack", function(job, done) {
  rollBackCredit(job);
});
