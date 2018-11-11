const http = require("http");
const saveMessage = require("../clients/saveMessage");

const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function(msgData, done) {
  const entireMsg = msgData;
  const body = JSON.stringify(msgData.job);

  if (msgData.isThereBalance) {
    const postOptions = {
      // host: "exercise6_messageapp_1",
      // host: "messageapp",
      host: "localhost",
      port: 3000,
      path: "/message",
      method: "post",
      json: true,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    };

    let postReq = http.request(postOptions);

    postReq.on("response", postRes => {
      if (postRes.statusCode === 200) {
        saveMessage(
          {
            destination: entireMsg.job.destination,
            body: entireMsg.job.body,
            uuid: entireMsg.job.uuid,
            status: "OK"
          },
          function(_result, error) {
            if (error) {
              console.log(error);
            } else {
              console.log(postRes.body);
            }
          }
        );
      } else {
        console.error("Error while sending message");
        saveMessage(
          {
            destination: entireMsg.job.destination,
            body: entireMsg.job.body,
            uuid: entireMsg.job.uuid,
            status: "ERROR"
          },
          () => {
            console.log("Internal server error: SERVICE ERROR");
          }
        );
      }
    });

    postReq.setTimeout(random(6000));

    postReq.on("timeout", () => {
      console.error("Timeout Exceeded!");
      postReq.abort();

      saveMessage(
        {
          destination: entireMsg.job.destination,
          body: entireMsg.job.body,
          uuid: entireMsg.job.uuid,
          status: "TIMEOUT"
        },
        () => {
          console.log("Internal server error: TIMEOUT");
        }
      );
    });

    postReq.on("error", response => {
      console.log(response.Error);
    });
    postReq.write(body);
    postReq.end();
  } else {
    console.log("No credit error");
  }
};
