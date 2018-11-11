const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");
const rollBack = require("../queue/queues/rollBackQ");

module.exports = function(messageParams, cb) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);
  if (message.status == "OK") {
    saveMessageTransaction(messageParams, cb);
  } else if (message.status == "ERROR") {
    rollBack(messageParams);
    cb();
  }
};
