const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");

//console.log(rollback);

module.exports = function(messageParams, cb) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);
  
  if (message.status == "OK") {
    saveMessageTransaction(messageParams, cb);
  } else if (message.status == "ERROR") {
    console.log('entra ERROR');
    cb();
  }
};
