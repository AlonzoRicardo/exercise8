const getMessageStatusById = require("../clients/getMessageStatusById");

module.exports = function(req, res) {
  console.log(req.body);
  getMessageStatusById().then(messages => {
    res.json(messages);
  });
};
