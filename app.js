const express = require("express");
const { getTopics, invalidPath, getApiInfo } = require("./controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api",getApiInfo)

app.all("*", invalidPath);


module.exports = app;
