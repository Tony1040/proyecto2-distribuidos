"use strict";

const rabbitPromise = require("./rabbitMQ");
const fetch = require("node-fetch");
const headers = require("./headerCORS");

const run_netlify = process.env.RUN_NETLIFY || false;
let  url = "https://pendetrailers.netlify.app/.netlify/functions/";
if (!run_netlify) {
  console.log("Running locally");
  url = "http://localhost:8888/.netlify/functions/";

exports.handler = async (event, context) => {
  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const channel = await rabbitPromise();
    let message = await channel.get("Proyecto2-trailers", { noAck: true });
    console.log("this is the message:", message);
    while (message) {
      console.log("This is the output: ", message.content.toString());
      const request = JSON.parse(message.content.toString());
      console.log("this is the request: ", request);
      switch (request.method) {
        case "DELETE":
          console.log("Doing a delete: ", url + "trailer/" + request.id);
          await fetch(url + "trailer/" + request.id, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
          });
          break;
        case "DELETE_CATEGORY":
          console.log("Doing a delete: ", url + "trailer/category/" + request.name);
          await fetch(url + "trailer/category/" + request.name, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
          });
          break;
        case "UPDATE":
          console.log("Doing a update: ", url + "trailer/" + request.id);
          await fetch(url + "trailer/" + request.id, {
            headers: { "Content-type": "application/json" },
            method: "PUT",
            body: JSON.stringify(request.body),
          });
          break;
        case "INSERT":
          console.log("message inserted: ", JSON.stringify(request.body));
          await fetch(url + "trailer", {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(request.body),
          });
          break;
        default:
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
