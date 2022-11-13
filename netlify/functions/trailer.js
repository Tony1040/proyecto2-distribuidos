"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const headers = require("./headerCORS");
const clientPromise = require("./mongoDB");
const DB_NAME = "JazzLegendsApp";
const TRAILERS_COLECTION = "movieTrailers";
const fs = require("fs");
const stream = require("stream");
const got = require("got");
const mongodb = require("mongodb");

const app = express.Router();

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/", async (req, res) => {
  try {
    const client = await clientPromise;

    const trailers = await client
      .db(DB_NAME)
      .collection(TRAILERS_COLECTION)
      .find({})
      .toArray();
    res.json(trailers);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    console.log("params: ", req.params.id);
    const trailer = await client
      .db(DB_NAME)
      .collection(TRAILERS_COLECTION)
      .find({ _id: req.params.id })
      .toArray();
    res.json(trailer);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

// app.get("/video/:id", async function (req, res) {
//   console.log("getting video: ", req.params.id);
//   const client = await clientPromise;

//   // Check for range headers to find our start time
//   const range = req.headers.range;
//   if (!range) {
//     res.status(400).send("Requires Range header");
//   }
//   console.log("range: ", range)

//   const db = client.db(DB_NAME);
//   // GridFS Collection
//   console.log("searching for: ", req.params.id);
//   db.collection("fs.files").findOne({}, (err, video) => {
//     console.log("this is the video: ", video);
//     if (!video) {
//       res.status(404).send("No video uploaded!");
//       return;
//     }

//     // Create response headers
//     const videoSize = video.length;
//     const start = Number(range.replace(/\D/g, ""));
//     const end = videoSize - 1;

//     const contentLength = end - start + 1;
//     const headers = {
//       "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": contentLength,
//       "Content-Type": "video/mp4",
//     };

//     // HTTP Status 206 for Partial Content
//     res.writeHead(206, headers);

//     // Get the bucket and download stream from GridFS
//     const bucket = new mongodb.GridFSBucket(db);
//     const downloadStream = bucket.openDownloadStreamByName(req.params.id, {
//       start,
//     });
//     console.log("downloadstream: ", downloadStream);
//     // const writeStream = fs.createWriteStream(__dirname + "/videos/db_test.mov");
//     // Finally pipe video to response
//     // downloadStream.pipe(writeStream);
//     // const test_stream = fs.createReadStream(__dirname + "/videos/db_test2.mp4");
//     downloadStream.pipe(res);
//   });
// });

app.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let data = req.body;

    await client.db(DB_NAME).collection(TRAILERS_COLECTION).insertOne(data);

    const videoFileUrl = data.url;
    const bucket = new mongodb.GridFSBucket(db);
    const videoUploadStream = bucket.openUploadStream(data._id);

    got.stream(videoFileUrl).pipe(videoUploadStream);

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const client = await clientPromise;

    let data = req.body;
    const id = data._id;

    await client
      .db(DB_NAME)
      .collection(TRAILERS_COLECTION)
      .updateOne({ _id: id }, { $set: data });

    const db = client.db(DB_NAME);

    const videoFileUrl = data.url;
    const bucket = new mongodb.GridFSBucket(db);
    const videoUploadStream = bucket.openUploadStream(data._id);

    got.stream(videoFileUrl).pipe(videoUploadStream);

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    const id = req.params.id;

    await client
      .db(DB_NAME)
      .collection(TRAILERS_COLECTION)
      .deleteOne({ _id: id });

    await client
      .db(DB_NAME)
      .collection("fs.files")
      .deleteMany({ filename: id });

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

app.delete("/category/:name", async (req, res) => {
  const client = await clientPromise;
  const name = req.params.name;
  console.log("Searching for: ", name);
  const results = await client
    .db(DB_NAME)
    .collection(TRAILERS_COLECTION)
    .find({ category: name })
    .toArray();

  console.log("This is the video results: ", results);

  await client
    .db(DB_NAME)
    .collection(TRAILERS_COLECTION)
    .deleteMany({ category: name });

  results.forEach(async (element) => {
    await client
      .db(DB_NAME)
      .collection("fs.files")
      .deleteMany({ filename: element._id });
  });

  res.json({ statusCode: 200, headers, body: results });
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/trailer", app);
module.exports = exp;
module.exports.handler = serverless(exp);
