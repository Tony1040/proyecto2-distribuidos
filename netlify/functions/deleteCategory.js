"use strict";

const headers = require("./headerCORS");

const rabbitPromise = require("./rabbitMQ");

exports.handler = async (event, context) => {
  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const name = event.path.split("/").reverse()[0];
    console.log("This is the id:", name);
    const channel = await rabbitPromise();
    const request = `{"method":"DELETE_CATEGORY","name": "${name}" }`;
    await channel.sendToQueue("Proyecto2-trailers", Buffer.from(request));

    return { statusCode: 200, headers, body: channel.status };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};
