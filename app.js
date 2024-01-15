const express = require("express");
const { getTopics, invalidPath } = require("./controller");
const app = express();



app.get("/api/topics", getTopics)

app.all('*',invalidPath)


  
module.exports = app;