"use strict";

const headers = require("./headerCORS");

const rabbitPromise = require("./rabbitMQ");

exports.handler = async (event, context) => {
  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const id = event.path.split("/").reverse()[0];

    const channel = await rabbitPromise();
    const request = `{"method":"UPDATE","id":"${id}","body":${event.body}}`;
    await channel.sendToQueue("Proyecto2-trailers", Buffer.from(request));

    return { statusCode: 200, headers, body: "OK" };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};
