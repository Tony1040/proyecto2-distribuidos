"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");
const headers = require("./headerCORS");
const clientPromise = require("./mongoDB");
const DB_NAME = "JazzLegendsApp";
const TRAILERS_COLECTION = "movieTrailers";

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

app.post("/", async (req, res) => {
  try {
    const client = await clientPromise;

    let data = req.body;
    // data._id = parseInt(data._id);

    await client.db(DB_NAME).collection(TRAILERS_COLECTION).insertOne(data);

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

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/trailer", app);
module.exports = exp;
module.exports.handler = serverless(exp);
