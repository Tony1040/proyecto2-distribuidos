"use strict";

const rabbitPromise = require("./rabbitMQ");
const fetch = require("node-fetch");
const headers = require("./headerCORS");

const url = "http://localhost:8888/.netlify/functions/";

exports.handler = async (event, context) => {
  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const channel = await rabbitPromise();
    let message = await channel.get("Proyecto2-trailers", { noAck: true });

    while (message) {
      console.log("This is the output: ", message.content.toString());
      const request = JSON.parse(message.content.toString());
      switch (request.method) {
        case "DELETE":
          await fetch(url + "trailer/" + request.id, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
          });
          break;
        case "UPDATE":
          await fetch(url + "trailer/" + request.id, {
            headers: { "Content-type": "application/json" },
            method: "PUT",
            body: JSON.stringify(request.body),
          });
          break;
        case "INSERT":
          await fetch(url + "trailer", {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(request.body),
          });
          break;
      }
      message = await channel.get("Proyecto2-trailers", { noAck: true });
    }
    return { statusCode: 200, headers, body: "OK" };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};
