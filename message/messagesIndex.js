const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const getMessages = require("./src/controllers/getMessages");

const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

require('./src/queue/consumers/sendConsumer')
require('./src/queue/queues/rollBackQ')
const queue = require('./src/queue/queues/newMessageQ')


app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  queue
  );
  
  app.get("/messages", getMessages);
  
  app.use(function(err, req, res, next) {
    console.log(res.body);
    if (err instanceof ValidationError) {
      res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9007, function() {
  console.log("Message App started on PORT 9007");
});
