const debug = require("debug")("util");

function cleanClone(document) {
  const copy = Object.assign({}, document._doc);
  delete copy._id;
  delete copy.__v;
  return copy;
}

function getHostName(req, res) {
  let os = require("os");
  let hostname = os.hostname();
  debug("Health Check 200");
  res.send(hostname);
}

module.exports = {
  cleanClone,
  getHostName
};
