"use strict";

const headers = require("./headerCORS");
const fs = require("fs");
const stream = require("stream");
const https = require("https");
// const request = require("requests")
const rabbitPromise = require("./rabbitMQ");

exports.handler = async (event, context) => {
  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    let body = JSON.parse(event.body);

    // Reference https://stackoverflow.com/a/66629140/12817553

    const channel = await rabbitPromise();
    const request = `{"method":"INSERT","body":${JSON.stringify(body)}}`;
    await channel.sendToQueue("Proyecto2-trailers", Buffer.from(request));

    return { statusCode: 200, headers, body: "OK" };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }

  // const videoFileUrl =
  //   "https://movietrailers.apple.com/movies/independent/on-the-line/on-the-line-trailer-1_h480p.mov";
  // const videoFileName = __dirname + "/videos/video.mov";

  // if (typeof fetch === "undefined")
  //   throw new Error("Fetch API is not supported.");

  // const response = await fetch(videoFileUrl);

  // if (!response.ok) throw new Error("Response is not ok.");

  // const writeStream = fs.createWriteStream(videoFileName);
  // const Readable = stream.Readable;
  // // Reference https://stackoverflow.com/a/66629140/12817553
  // const readable = Readable.fromWeb(response.body);

  // readable.pipe(writeStream);

  // await new Promise((resolve, reject) => {
  //   readable.on("end", resolve);
  //   readable.on("error", reject);
  // });
  // console.log(x.body)

  // event.pipe(x)
  // x.pipe(context)
  // console.log(x)
};
