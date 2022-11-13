const express = require("express");
const exp = express();
const fs = require("fs");
const serverless = require("serverless-http");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const clientPromise = require("./mongoDB");
const headers = require("./headerCORS");

const DB_NAME = "JazzLegendsApp";

const app = express.Router();
	
app.use(bodyParser.json({ strict: false }));

// app.get();

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/:id", async function (req, res) {
  console.log("getting video: ", req.params.id);
  const client = await clientPromise;

  // Check for range headers to find our start time
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const db = client.db(DB_NAME);
  // GridFS Collection
  console.log("searching for: ", JSON.stringify(req.params.id));
  db.collection("fs.files").findOne(
    { filename: req.params.id },
    (err, video) => {
      console.log("this is the video: ", video);
    //   if (!video) {
    //     res.status(404).send("No video uploaded!");
    //     return;
    //   }

      // Create response headers
      const videoSize = video.length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
        // "Connection": "keep-alive"
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);

      // Get the bucket and download stream from GridFS
      const bucket = new mongodb.GridFSBucket(db);
      const downloadStream = bucket.openDownloadStreamByName(req.params.id, {
        start,
      });
      console.log("downloadstream: ", downloadStream);
      // const writeStream = fs.createWriteStream(__dirname + "/videos/db_test.mov");
      // Finally pipe video to response
      // downloadStream.pipe(writeStream);
      // const test_stream = fs.createReadStream(__dirname + "/videos/db_test2.mp4");
      downloadStream.pipe(res);
    }
  );
});

// exp.use(bodyParser.json());
exp.use("/.netlify/functions/video", app);
module.exports = exp;
module.exports.handler = serverless(exp);