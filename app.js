const express = require("express");
const { getTopics } = require("./controller");

const app = express();

app.get("/api/topics", getTopics)

app.use((err,req,res,next)=>{
    if (err.code === '23502'){
    //   res.status(400).send({msg:'Bad request'})
    }
    else {
    //   next(err);
    }
  })
module.exports = app;